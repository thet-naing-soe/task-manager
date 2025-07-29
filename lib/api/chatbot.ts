import { handleResponse, getHeaders } from '@/lib/utils';

interface SendMessagePayload {
  message: string;
  sessionId?: string;
}

interface ChatbotResponse {
  reply: string;
  sessionId: string;
}

export async function sendMessageToBot(
  payload: SendMessagePayload
): Promise<ChatbotResponse> {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
