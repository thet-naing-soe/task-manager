import { z } from 'zod';

export const chatbotSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
  sessionId: z.string().uuid().optional(),
});

export const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty.'),
});

export type MessageInput = z.infer<typeof messageSchema>;
