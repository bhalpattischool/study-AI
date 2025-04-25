
import { useState, useEffect } from 'react';
import { chatDB, Message as MessageType } from '@/lib/db';
import { generateResponse } from '@/lib/gemini';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

// Adding constant for guest message limit
const GUEST_MESSAGE_LIMIT = 2;

// Export the useChatData hook
export const useChatData = (chatId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chat = await chatDB.getChat(chatId);
        if (chat) {
          setMessages(chat.messages);
          setDisplayName(chat.title || 'Chat');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
        setLoadError('Failed to load messages');
      }
    };

    loadMessages();
  }, [chatId]);

  const refreshMessages = async () => {
    try {
      const chat = await chatDB.getChat(chatId);
      if (chat) {
        setMessages(chat.messages);
      }
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  return {
    messages,
    isLoading,
    displayName,
    groupDetails,
    loadError,
    setMessages,
    refreshMessages
  };
};

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
        
        // Check message limit for non-logged in users
        if (!currentUser && chat.messages.filter(m => m.role === 'user').length >= GUEST_MESSAGE_LIMIT) {
          setMessageLimitReached(true);
          setShowLimitAlert(true);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (input: string) => {
    if (!input.trim() || isLoading || isResponding) return;
    
    // Check if user has reached message limit
    if (!currentUser && messages.filter(m => m.role === 'user').length >= GUEST_MESSAGE_LIMIT) {
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
      
      // Get AI response
      const response = await generateResponse(input.trim(), chatHistory);
      
      // Add bot message
      const botMessage = await chatDB.addMessage(chatId, response, 'bot');
      setMessages((prev) => [...prev, botMessage]);
      
      if (onChatUpdated) onChatUpdated();
      
      // Check if this message hits the limit
      if (!currentUser && messages.filter(m => m.role === 'user').length >= GUEST_MESSAGE_LIMIT - 1) {
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
