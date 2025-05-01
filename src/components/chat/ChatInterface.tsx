
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Users } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from '@/lib/firebase';
import { storage } from '@/lib/firebase';
import { useChatData, useGroupChat } from '@/hooks/useChat';
import { sendMessage } from '@/lib/firebase';
import GroupMembersModal from './GroupMembersModal';
import GroupMessageInput from './GroupMessageInput';
import ChatHeader from './ChatHeader';
import ChatError from './ChatError';
import ChatMessageArea from './ChatMessageArea';
import ChatHeaderActions from './ChatHeaderActions';
import DeleteGroupDialog from './DeleteGroupDialog';

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
  const { currentUser } = useAuth();
  const [membersModal, setMembersModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  const { displayName, loadError } = useChatData(chatId);
  
  // Use the stable useGroupChat hook
  const { messages, isLoading, groupDetails } = useGroupChat(chatId, () => {
    // Simplified callback that runs less often
    console.log("Chat updated with new messages");
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Memoize the send message handler to prevent unnecessary re-renders
  const handleSendMessage = useCallback(async (text: string, file?: File) => {
    if (!currentUser) {
      toast.error('आपको संदेश भेजने के लिए लॉग इन करना होगा');
      return;
    }
    
    try {
      setIsSendingMessage(true);
      
      // Optimistically add a temporary message to local state
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        text: file ? "[संदेश भेज रहे हैं...]" : text,
        sender: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        timestamp: Date.now(),
        isTemp: true
      };
      
      setLocalMessages(prev => [...prev, tempMessage]);

      if (file) {
        console.log("Sending image message...");
        const storageRef = ref(storage, `chat_images/${chatId}/${Date.now()}_${file.name}`);
        
        await uploadBytes(storageRef, file).then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
          await sendMessage(chatId, currentUser.uid, `[image:${downloadURL}]`, isGroup);
        });
        
        toast.success("छवि भेजी गई");
      } else {
        console.log("Sending text message...");
        await sendMessage(chatId, currentUser.uid, text, isGroup);
      }
      
      // Replace temp message with actual one
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempId));
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('संदेश भेजने में त्रुटि');
      
      // Remove temp message on error
      setLocalMessages(prev => prev.filter(msg => !msg.isTemp));
    } finally {
      setIsSendingMessage(false);
    }
  }, [chatId, currentUser, isGroup]);

  const refreshMessages = useCallback(() => {
    console.log("Messages will refresh automatically via listener");
  }, []);

  const isAdmin = isGroup && groupDetails?.admins && groupDetails.admins[currentUser?.uid];

  const memberAvatars = isGroup && groupDetails?.members
    ? Object.keys(groupDetails.members).slice(0, 3).map((memberId: string, idx: number) => (
        <div key={memberId || idx} className="w-7 h-7 rounded-full bg-primary inline-flex items-center justify-center text-xs font-semibold border-2 border-white -ml-2 z-10">
          <Users className="h-4 w-4 text-white" />
        </div>
      ))
    : null;

  if (loadError) {
    return <ChatError onBack={onBack} error={loadError} />;
  }

  return (
    <div className="flex flex-col h-full glass-morphism border border-purple-200 dark:border-purple-900 rounded-lg overflow-hidden">
      <ChatHeader
        displayName={displayName}
        isGroup={isGroup}
        onBack={onBack}
        onManageMembers={() => setMembersModal(true)}
        isAdmin={isAdmin}
        memberAvatars={memberAvatars}
      >
        <ChatHeaderActions 
          isAdmin={isAdmin}
          isGroup={isGroup}
          onDeleteClick={() => setDeleteDialog(true)}
        />
      </ChatHeader>
      
      <ChatMessageArea
        messages={localMessages}
        isLoading={isLoading}
        chatId={chatId}
        isGroup={isGroup}
        onRefreshMessages={refreshMessages}
      />
      
      <GroupMessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isSendingMessage} 
      />
      
      {isGroup && groupDetails && (
        <GroupMembersModal
          isOpen={membersModal}
          onClose={() => setMembersModal(false)}
          groupId={chatId}
          currentMembers={groupDetails.members || {}}
          admins={groupDetails.admins || {}}
        />
      )}

      <DeleteGroupDialog
        isOpen={deleteDialog}
        setIsOpen={setDeleteDialog}
        chatId={chatId}
        onDeleteSuccess={onBack}
        currentUserId={currentUser?.uid}
      />
    </div>
  );
};

export default ChatInterface;
