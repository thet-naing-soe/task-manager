'use client';

import { type MessageInput, messageSchema } from '@/lib/validations/chatbot';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Loader2, SendHorizonal } from 'lucide-react';

interface ChatInputFormProps {
  onSend: (text: string) => void;
  isSending: boolean;
}

export function ChatInputForm({ onSend, isSending }: ChatInputFormProps) {
  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '' },
  });

  const onSubmit = (data: MessageInput) => {
    onSend(data.text);
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2 border-t p-2"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ask about your tasks..."
                  autoComplete="off"
                  disabled={isSending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isSending}>
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}
