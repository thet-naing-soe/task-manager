import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';
import * as chatbotApi from '@/lib/api/chatbot';
import { QUERY_KEYS } from '@/lib/constants/chatbot';

export function useSendMessage() {
  return useMutation({
    mutationKey: QUERY_KEYS.chatbot.sendMessage,
    mutationFn: chatbotApi.sendMessageToBot,
    onError: (err) => {
      toast.error(`Chatbot Error: ${getErrorMessage(err)}`);
    },
  });
}
