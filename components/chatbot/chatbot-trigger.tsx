'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useChatbotStore } from '@/lib/stores/chatbot-store';
import { BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatbotTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const openChat = useChatbotStore((state) => state.openChat);

  return (
    <Button
      ref={ref}
      variant="default"
      className={cn('h-10 w-10 rounded-lg shadow-lg', className)}
      onClick={openChat}
      size="icon"
      aria-label="Open Chatbot"
      {...props}
    >
      <BotMessageSquare className="h-7 w-7" />
    </Button>
  );
});
