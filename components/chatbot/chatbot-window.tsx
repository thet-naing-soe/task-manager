import { useRef, useEffect } from 'react';
import { useChatbotStore } from '@/lib/stores/chatbot-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { ChatInputForm } from '@/components/chatbot/chat-input-form';
import { ChatMessage } from '@/components/chatbot/chat-message';
import { ChatSkeleton } from '@/components/chatbot/chat-skeleton';

interface ChatbotWindowProps {
  onSend: (text: string) => void;
  isThinking: boolean;
}

export function ChatbotWindow({ onSend, isThinking }: ChatbotWindowProps) {
  const { messages, closeChat } = useChatbotStore();
  const ScrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (ScrollAreaRef.current) {
      ScrollAreaRef.current.scrollTo({
        top: ScrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isThinking]);
  2;
  return (
    <div className="flex flex-col h-[28rem]">
      {/* ... Header ... */}
      <div className="flex items-center justify-between p-3 border-b">
        <h4 className="font-semibold">Task Manger Bot</h4>
        <Button variant="ghost" size="icon" onClick={closeChat}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea ref={ScrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isThinking && <ChatSkeleton />}
        </div>
      </ScrollArea>
      <ChatInputForm onSend={onSend} isSending={isThinking} />
    </div>
  );
}
