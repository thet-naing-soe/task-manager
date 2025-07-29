import { type ChatMessage, useChatbotStore } from '@/lib/stores/chatbot-store';
import { useSendMessage } from '@/hooks/use-chatbot';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ChatbotTrigger } from './chatbot-trigger';
import { ChatbotWindow } from './chatbot-window';

export function Chatbot() {
  const { isOpen, openChat, closeChat, addMessage, sessionId, setSessionId } =
    useChatbotStore();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      role: 'user',
    };
    addMessage(userMessage);
    sendMessage(
      { message: text, sessionId },
      {
        onSuccess: (data) => {
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            text: data.reply,
            role: 'bot',
          };
          addMessage(botMessage);
          setSessionId(data.sessionId);
        },
        onError: () => {
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            text: 'Sorry, something went wrong. Please try again.',
            role: 'bot',
          };
          addMessage(errorMessage);
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openChat();
    } else {
      closeChat();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <ChatbotTrigger />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={15}
        align="end"
        className="w-80 rounded-lg p-0 shadow-xl border-none"
      >
        <ChatbotWindow onSend={handleSendMessage} isThinking={isPending} />
      </PopoverContent>
    </Popover>
  );
}
