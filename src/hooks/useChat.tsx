
import { useState, useEffect } from 'react';
import { getGroupDetails, getUserName, listenForMessages } from '@/lib/firebase';
import { toast } from "sonner";

export const useChatData = (chatId: string, recipientId: string, isGroup: boolean) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        if (isGroup) {
          console.log("Fetching group details for ID:", chatId);
          const groupDetailsResp = await getGroupDetails(chatId);
          console.log("Group details:", groupDetailsResp);
          setDisplayName(groupDetailsResp?.name || 'Group Chat');
          setGroupDetails(groupDetailsResp);
        } else {
          const userName = await getUserName(recipientId);
          setDisplayName(userName || 'Chat');
          setGroupDetails(null);
        }
      } catch (error) {
        console.error('Error fetching chat details:', error);
        setLoadError("Failed to load chat information");
        toast.error('Failed to load chat information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();

    let unsubscribe = () => {};
    try {
      unsubscribe = listenForMessages(chatId, isGroup, (chatMessages) => {
        console.log("Messages received:", chatMessages.length);
        setMessages(chatMessages);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error setting up message listener:", error);
      toast.error("Failed to connect to message service");
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [chatId, isGroup, recipientId]);

  return {
    messages,
    isLoading,
    displayName,
    groupDetails,
    loadError,
    setMessages
  };
};
