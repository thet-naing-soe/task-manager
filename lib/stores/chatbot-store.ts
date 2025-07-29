import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'bot';
}

interface ChatbotState {
  messages: ChatMessage[];
  sessionId: string | undefined;
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  setSessionId: (id: string) => void;
  openChat: () => void;
  closeChat: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  // Default values
  messages: [
    {
      id: 'welcome-msg',
      text: 'Hello! How can I help you with your tasks today?',
      role: 'bot',
    },
  ],
  sessionId: undefined,
  isOpen: false,

  // Actions
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setSessionId: (id) => set({ sessionId: id }),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
}));
