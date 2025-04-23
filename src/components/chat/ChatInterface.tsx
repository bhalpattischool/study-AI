
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Users, UserPlus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import {
  sendMessage,
  listenForMessages,
  getGroupDetails,
  getUserName,
  updateGroupMembership,
} from '@/lib/firebase';
import GroupMembersModal from './GroupMembersModal';

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
  // ग्रुप मेंबर मैनेजमेंट
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [membersModal, setMembersModal] = useState(false);

  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        if (isGroup) {
          const groupDetailsResp = await getGroupDetails(chatId);
          setDisplayName(groupDetailsResp?.name || 'Group Chat');
          setGroupDetails(groupDetailsResp);
        } else {
          const name = await getUserName(recipientId);
          setDisplayName(name || 'Chat');
          setGroupDetails(null);
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

  const handleDeleteMessage = async (msgId: string) => {
    // डिलीट मैसेज Log 
    toast.info('Message delete functionality should be implemented here!');
  };

  // Group member add modal
  const handleShowMembersModal = () => {
    setMembersModal(true);
  };

  // Show members avatars in group header
  const memberAvatars = isGroup && groupDetails?.members
    ? Object.keys(groupDetails.members).slice(0, 3).map((uid, idx) => (
        <div key={uid} className="w-7 h-7 rounded-full bg-primary inline-flex items-center justify-center text-xs font-semibold border-2 border-white -ml-2 z-10">
          <Users className="h-4 w-4 text-white" />
        </div>
      ))
    : null;

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
        {isGroup && groupDetails && groupDetails.admins?.[currentUser?.uid] && (
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
      
      <ChatInput onSendMessage={handleSendMessage} />
      {/* Add Group Members Modal */}
      {isGroup && groupDetails && (
        <GroupMembersModal
          isOpen={membersModal}
          onClose={() => setMembersModal(false)}
          groupId={chatId}
          currentMembers={groupDetails.members}
          admins={groupDetails.admins}
        />
      )}
    </div>
  );
};

export default ChatInterface;
