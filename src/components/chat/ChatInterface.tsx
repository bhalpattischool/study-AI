
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Users } from 'lucide-react';
import { toast } from "sonner";
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessage, listenForMessages, getGroupDetails, getUserName } from '@/lib/firebase';

interface ChatInterfaceProps {
  recipientId: string;
  chatId: string;
  isGroup: boolean;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  recipientId, 
  chatId, 
  isGroup, 
  onBack 
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        if (isGroup) {
          const groupDetails = await getGroupDetails(chatId);
          setDisplayName(groupDetails?.name || 'Group Chat');
        } else {
          const name = await getUserName(recipientId);
          setDisplayName(name || 'Chat');
        }
      } catch (error) {
        console.error('Error fetching chat details:', error);
        toast.error('Failed to load chat information');
      }
    };

    fetchChatData();

    // Set up real-time listener for messages
    const unsubscribe = listenForMessages(chatId, isGroup, (chatMessages) => {
      setMessages(chatMessages);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [chatId, recipientId, isGroup]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to send messages');
      return;
    }

    try {
      await sendMessage(chatId, currentUser.uid, text, isGroup);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center flex-1">
          {isGroup && <Users className="h-5 w-5 mr-2 text-purple-500" />}
          <h2 className="font-semibold text-lg">{displayName}</h2>
        </div>
        
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ChatMessageList messages={messages} isGroup={isGroup} />
      )}
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
