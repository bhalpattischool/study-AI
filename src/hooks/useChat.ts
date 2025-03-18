
import { useState, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const FREE_MESSAGE_LIMIT = 5;

export const useChat = (chatId: string, onChatUpdated?: () => void) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const { currentUser, messageLimitReached, setMessageLimitReached } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const chat = await chatDB.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
        
        // Check if unauthenticated user has reached message limit
        if (!currentUser && chat.messages.filter(m => m.role === 'user').length >= FREE_MESSAGE_LIMIT) {
          setMessageLimitReached(true);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading || isResponding) return;
    
    // Check message limit for unauthenticated users
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (!currentUser && userMessageCount >= FREE_MESSAGE_LIMIT) {
      setMessageLimitReached(true);
      setShowLimitAlert(true);
      return;
    }

    try {
      setIsLoading(true);
      setIsResponding(true);
      
      // Add user message
      const userMessage = await chatDB.addMessage(chatId, input.trim(), 'user');
      setMessages((prev) => [...prev, userMessage]);
      
      if (onChatUpdated) onChatUpdated();

      // Get current conversation history
      const currentChat = await chatDB.getChat(chatId);
      const chatHistory = currentChat?.messages || [];
      
      console.log("Sending chat with history length:", chatHistory.length);

      // Get AI response with complete conversation history
      const response = await generateResponse(input.trim(), chatHistory);
      
      // Add bot message
      const botMessage = await chatDB.addMessage(chatId, response, 'bot');
      setMessages((prev) => [...prev, botMessage]);
      
      if (onChatUpdated) onChatUpdated();
      
      // Check if user has reached limit after this exchange
      if (!currentUser && userMessageCount + 1 >= FREE_MESSAGE_LIMIT) {
        setMessageLimitReached(true);
        setShowLimitAlert(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
      setIsResponding(false);
    }
  };

  return {
    messages,
    isLoading,
    isResponding,
    showLimitAlert,
    setShowLimitAlert,
    loadMessages,
    sendMessage,
    messageLimitReached
  };
};
