
import { useState, useEffect } from 'react';
import { getGroupDetails, getUserName, listenForMessages, sendMessage } from '@/lib/firebase';
import { toast } from "sonner";

// Export the sendMessage function from firebase for convenience
export { sendMessage } from '@/lib/firebase';

// Re-export the useChat and useChatData hooks
export { useChat, useChatData } from './useChat.ts';

// Add a specific hook for group chat that handles realtime updates
export const useGroupChat = (groupId: string, onChatUpdated?: () => void) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  
  useEffect(() => {
    if (!groupId) return;
    
    setIsLoading(true);
    
    // Subscribe to real-time updates for this group
    const unsubscribe = listenForMessages(groupId, true, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
      if (onChatUpdated) onChatUpdated();
    });
    
    // Load group details
    const loadGroupDetails = async () => {
      try {
        const details = await getGroupDetails(groupId);
        setGroupDetails(details);
      } catch (error) {
        console.error('Error loading group details:', error);
      }
    };
    
    loadGroupDetails();
    
    return () => {
      // Clean up listener when component unmounts
      if (unsubscribe) unsubscribe();
    };
  }, [groupId, onChatUpdated]);
  
  return {
    messages,
    isLoading,
    groupDetails
  };
};
