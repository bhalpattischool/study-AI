
import { useState, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

// Removed the FREE_MESSAGE_LIMIT constant to solve the issue

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
        
        // Removed the limit check to fix the issue with authenticated users
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading || isResponding) return;
    
    // Removed the message limit check to allow authenticated users to send messages without limits

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
      
      // Removed the limit check after user message
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
