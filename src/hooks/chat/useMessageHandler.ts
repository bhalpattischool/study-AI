
import { useCallback } from 'react';
import { chatDB } from '@/lib/db';
import { toast } from "sonner";

export const useMessageHandler = ({ 
  chatId, 
  loadMessages, 
  onChatUpdated,
  scrollToBottom,
  sendMessage 
}: {
  chatId: string;
  loadMessages: () => Promise<void>;
  onChatUpdated?: () => void;
  scrollToBottom: () => void;
  sendMessage: (text: string) => Promise<void>;
}) => {
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    await sendMessage(text);
    scrollToBottom();
  }, [sendMessage, scrollToBottom]);

  const handleMessageEdited = useCallback(async (messageId: string, newContent: string) => {
    try {
      await chatDB.editMessage(chatId, messageId, newContent);
      await loadMessages();
      if (onChatUpdated) onChatUpdated();
      toast.success('Message updated');
      scrollToBottom();
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to update message');
    }
  }, [chatId, loadMessages, onChatUpdated, scrollToBottom]);

  const handleMessageDeleted = useCallback(async (messageId: string) => {
    try {
      await chatDB.deleteMessage(chatId, messageId);
      await loadMessages();
      if (onChatUpdated) onChatUpdated();
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  }, [chatId, loadMessages, onChatUpdated]);

  return {
    handleSend,
    handleMessageEdited,
    handleMessageDeleted
  };
};
