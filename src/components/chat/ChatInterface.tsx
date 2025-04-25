
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Users, Trash2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from '@/lib/firebase';
import { storage } from '@/lib/firebase';
import { useChatData } from '@/hooks/useChat';
import { sendMessage, deleteGroup } from '@/lib/firebase';
import ChatMessageList from './ChatMessageList';
import GroupMembersModal from './GroupMembersModal';
import GroupMessageInput from './GroupMessageInput';
import ChatHeader from './ChatHeader';
import ChatError from './ChatError';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  
  const {
    messages,
    isLoading,
    displayName,
    groupDetails,
    loadError,
    setMessages,
    refreshMessages
  } = useChatData(chatId);

  const handleSendMessage = async (text: string, file?: File) => {
    if (!currentUser) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    try {
      if (file) {
        console.log("Sending image message...");
        const storageRef = ref(storage, `chat_images/${chatId}/${Date.now()}_${file.name}`);
        
        await uploadBytes(storageRef, file).then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
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

  const handleDeleteGroup = async () => {
    if (!currentUser || !isGroup) return;

    try {
      await deleteGroup(chatId);
      toast.success("Group deleted successfully");
      onBack();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

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

  const isAdmin = isGroup && groupDetails?.admins && groupDetails.admins[currentUser?.uid];

  return (
    <div className="flex flex-col h-full glass-morphism border border-purple-200 dark:border-purple-900">
      <ChatHeader
        displayName={displayName}
        isGroup={isGroup}
        onBack={onBack}
        onManageMembers={() => setMembersModal(true)}
        isAdmin={isAdmin}
        memberAvatars={memberAvatars}
      >
        {isAdmin && isGroup && (
          <Button
            variant="outline"
            size="sm" 
            className="ml-2 bg-red-50 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </ChatHeader>
      
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ChatMessageList 
          messages={messages} 
          isGroup={isGroup} 
          chatId={chatId}
          onMessageUpdated={refreshMessages}
        />
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

      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group 
              and remove all messages for all members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatInterface;
