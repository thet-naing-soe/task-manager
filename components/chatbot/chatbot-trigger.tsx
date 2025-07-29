import { Button } from '@/components/ui/button';
import { useChatbotStore } from '@/lib/stores/chatbot-store';
import { MessageCircle } from 'lucide-react';

export function ChatbotTrigger() {
  const openChat = useChatbotStore((state) => state.openChat);

  return (
    <Button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      onClick={openChat}
      size="icon"
      aria-label="Open Chatbot"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
}
