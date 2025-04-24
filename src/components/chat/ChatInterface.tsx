
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Users, UserPlus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import ChatMessageList from './ChatMessageList';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserName,
  getGroupDetails,
  listenForMessages,
  sendMessage
} from '@/lib/firebase';
import GroupMembersModal from './GroupMembersModal';
import GroupMessageInput from './GroupMessageInput';

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
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [membersModal, setMembersModal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Set up our main chat functionality
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
          // For 1-on-1 chats, get the other user's name
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

    // Set up real-time listener for messages
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

  const handleSendMessage = async (text: string, file?: File) => {
    if (!currentUser) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    try {
      if (file) {
        console.log("Sending image message...");
        const storage = await import('firebase/storage').then(mod => mod.getStorage());
        const storageRef = await import('firebase/storage').then(mod => mod.ref)(storage, `chat_images/${chatId}/${Date.now()}_${file.name}`);
        
        await import('firebase/storage').then(mod => mod.uploadBytes)(storageRef, file).then(async (snapshot) => {
          const downloadURL = await import('firebase/storage').then(mod => mod.getDownloadURL)(snapshot.ref);
          await sendMessage(chatId, currentUser.uid, `[image:${downloadURL}]`, isGroup);
        });
        
        toast.success("Image sent");
      } else {
        console.log("Sending text message...");
        await sendMessage(chatId, currentUser.uid, text, isGroup);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleShowMembersModal = () => {
    setMembersModal(true);
  };

  const memberAvatars = isGroup && groupDetails?.members
    ? Object.keys(groupDetails.members).slice(0, 3).map((memberId: string, idx: number) => (
        <div key={memberId || idx} className="w-7 h-7 rounded-full bg-primary inline-flex items-center justify-center text-xs font-semibold border-2 border-white -ml-2 z-10">
          <Users className="h-4 w-4 text-white" />
        </div>
      ))
    : null;

  if (loadError) {
    return (
      <div className="flex flex-col h-full glass-morphism border border-purple-200 dark:border-purple-900">
        <div className="flex items-center p-3 border-b bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-gray-900">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg">Chat Error</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Could not load chat</h3>
          <p className="text-gray-500 mb-4">
            {loadError}
          </p>
          <Button onClick={onBack}>Return to Chat List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass-morphism border border-purple-200 dark:border-purple-900">
      <div className={`flex items-center p-3 border-b bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-gray-900`}>
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center flex-1">
          {isGroup && <Users className="h-5 w-5 mr-2 text-purple-600" />}
          <h2 className="font-semibold text-lg">{displayName}</h2>
          {memberAvatars}
        </div>
        {isGroup && groupDetails && groupDetails.admins && groupDetails.admins[currentUser?.uid] && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowMembersModal}
            className="ml-1 bg-white dark:bg-gray-800 border-purple-300 hover:bg-purple-100"
          >
            <UserPlus className="h-4 w-4 mr-1 text-purple-500" />
            Manage
          </Button>
        )}
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
      
      <GroupMessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      {isGroup && groupDetails && (
        <GroupMembersModal
          isOpen={membersModal}
          onClose={() => setMembersModal(false)}
          groupId={chatId}
          currentMembers={groupDetails.members || {}}
          admins={groupDetails.admins || {}}
        />
      )}
    </div>
  );
};

export default ChatInterface;
