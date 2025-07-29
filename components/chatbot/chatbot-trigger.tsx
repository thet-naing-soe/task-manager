import { Button } from '@/components/ui/button';
import { useChatbotStore } from '@/lib/stores/chatbot-store';
import { BotMessageSquare } from 'lucide-react';

export function ChatbotTrigger() {
  const openChat = useChatbotStore((state) => state.openChat);

  return (
    <Button
      className="h-10 w-10 rounded-lg shadow-lg"
      onClick={openChat}
      size="icon"
      aria-label="Open Chatbot"
    >
      <BotMessageSquare className="h-7 w-7" />
    </Button>
  );
}
