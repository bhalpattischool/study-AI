
import { useState, useEffect, useRef } from 'react';
import { getGroupDetails, listenForMessages } from '@/lib/firebase';

export const useGroupChat = (groupId: string, onChatUpdated?: () => void) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const messagesRef = useRef<any[]>([]);
  const unsubscribeRef = useRef<any>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  
  // Load group details separately from the message subscription
  useEffect(() => {
    const loadGroupDetails = async () => {
      if (!groupId) return;
      
      try {
        console.log("Loading group details for:", groupId);
        const details = await getGroupDetails(groupId);
        setGroupDetails(details);
      } catch (error) {
        console.error('Error loading group details:', error);
        
        // Retry loading group details
        if (retryCountRef.current < MAX_RETRIES) {
          console.log(`Retrying group details load (${retryCountRef.current + 1}/${MAX_RETRIES})`);
          retryCountRef.current++;
          
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
          }
          
          retryTimerRef.current = setTimeout(loadGroupDetails, 2000);
        }
      }
    };
    
    loadGroupDetails();
    
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [groupId]);
  
  // Set up the message listener with a stable reference and retry mechanism
  useEffect(() => {
    if (!groupId) return;
    
    setIsLoading(true);
    retryCountRef.current = 0;
    
    const setupListener = () => {
      // Use a stable callback to prevent re-renders
      const messageUpdateCallback = (newMessages: any[]) => {
        console.log(`Received ${newMessages.length} messages for group ${groupId}`);
        
        // Only update if messages have actually changed
        if (JSON.stringify(newMessages) !== JSON.stringify(messagesRef.current)) {
          messagesRef.current = newMessages;
          setMessages(newMessages);
          setIsLoading(false);
          if (onChatUpdated) onChatUpdated();
        } else {
          setIsLoading(false);
        }
      };
      
      // Clean up previous listener if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      try {
        console.log(`Setting up message listener for group ${groupId}`);
        // Subscribe to real-time updates
        unsubscribeRef.current = listenForMessages(groupId, true, messageUpdateCallback);
        
        // Reset retry counter on success
        retryCountRef.current = 0;
      } catch (error) {
        console.error(`Error setting up message listener for group ${groupId}:`, error);
        
        // Retry setup on failure
        if (retryCountRef.current < MAX_RETRIES) {
          console.log(`Retrying listener setup (${retryCountRef.current + 1}/${MAX_RETRIES})...`);
          retryCountRef.current++;
          
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
          }
          
          retryTimerRef.current = setTimeout(setupListener, 2000 * retryCountRef.current);
        } else {
          console.error("Failed to set up message listener after maximum retries");
          setIsLoading(false);
        }
      }
    };
    
    setupListener();
    
    return () => {
      // Clean up listener and retry timer when component unmounts
      if (unsubscribeRef.current) {
        console.log(`Cleaning up message listener for group ${groupId}`);
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [groupId, onChatUpdated]);
  
  return {
    messages,
    isLoading,
    groupDetails
  };
};
