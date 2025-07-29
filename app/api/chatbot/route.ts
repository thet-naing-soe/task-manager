import { NextResponse } from 'next/server';
import { chatbotSchema } from '@/lib/validations/chatbot';
import { SessionsClient } from '@google-cloud/dialogflow';
import { getCurrentUser } from '@/lib/auth-client';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // validate
    const body = await request.json();
    const validation = chatbotSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { message, sessionId } = validation.data;
    const sessionIdentifier = sessionId || uuid();

    // Environment Variables
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

    if (!projectId || !credentialsJson) {
      console.error('Google Cloud credentials are not set in .env');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // Dialogflow client
    const parsedCredentials = JSON.parse(credentialsJson);
    const sessionClient = new SessionsClient({
      projectId,
      credentials: {
        client_email: parsedCredentials.client_email,
        private_key: parsedCredentials.private_key,
      },
    });
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionIdentifier
    );

    // To request Dialogflow
    const dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    // Dialogflow API
    const response = await sessionClient.detectIntent(dialogflowRequest);
    const result = response[0].queryResult;

    if (result && result.fulfillmentText) {
      return NextResponse.json({
        reply: result.fulfillmentText,
        sessionId: sessionIdentifier,
      });
    } else {
      return NextResponse.json({
        reply: "I'm sorry, I don't catch that. Could you it again?",
        sessionId: sessionIdentifier,
      });
    }
  } catch (error) {
    console.error('Chatbot API Error', error);
    return NextResponse.json(
      { error: 'Faild to communicate with the chatbot.' },
      { status: 500 }
    );
  }
}
