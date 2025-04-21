
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Users } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import GroupChatModal from '@/components/chat/GroupChatModal';
import ChatInterface from '@/components/chat/ChatInterface';
import { getUserChats, getUserGroups } from '@/lib/firebase';
import { Chat } from '@/types/chat';

const ChatSystem = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadChats = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user-to-user chats
        const userChats = await getUserChats(currentUser.uid);
        
        // Get group chats
        const groupChats = await getUserGroups(currentUser.uid);
        
        // Combine both types of chats and ensure they match the Chat type
        const allChats: Chat[] = [
          ...userChats.map(chat => ({
            ...chat,
            type: "user" as const
          })),
          ...groupChats.map(chat => ({
            ...chat,
            type: "group" as const
          }))
        ];
        
        // Sort by timestamp (newest first)
        allChats.sort((a, b) => {
          const timeA = a.timestamp || 0;
          const timeB = b.timestamp || 0;
          return timeB - timeA;
        });
        
        setChats(allChats);
      } catch (error) {
        console.error("Error loading chats:", error);
        toast.error("Failed to load chat list");
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [currentUser]);

  const handleCreateGroup = (groupId: string) => {
    // Find the newly created group in the updated list
    getUserGroups(currentUser?.uid || '').then(groups => {
      const newGroup = groups.find(g => g.id === groupId);
      if (newGroup) {
        setChats(prev => [
          { ...newGroup, type: "group" as const },
          ...prev
        ]);
        setSelectedChat({ ...newGroup, type: "group" as const });
      }
    });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    // Refresh chat list
    if (currentUser) {
      setIsLoading(true);
      Promise.all([
        getUserChats(currentUser.uid),
        getUserGroups(currentUser.uid)
      ]).then(([userChats, groupChats]) => {
        const allChats: Chat[] = [
          ...userChats.map(chat => ({
            ...chat,
            type: "user" as const
          })),
          ...groupChats.map(chat => ({
            ...chat,
            type: "group" as const
          }))
        ];
        
        allChats.sort((a, b) => {
          const timeA = a.timestamp || 0;
          const timeB = b.timestamp || 0;
          return timeB - timeA;
        });
        
        setChats(allChats);
        setIsLoading(false);
      }).catch(error => {
        console.error("Error refreshing chats:", error);
        setIsLoading(false);
      });
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  };

  // If a chat is selected, show the chat interface
  if (selectedChat) {
    return (
      <div className="h-[calc(100vh-56px)]">
        <ChatInterface 
          recipientId={selectedChat.partnerId || selectedChat.id} 
          chatId={selectedChat.id}
          isGroup={selectedChat.type === 'group'}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  // Otherwise show the chat list
  return (
    <div className="container py-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">Messages</CardTitle>
            <CardDescription>Your conversations and group chats</CardDescription>
          </div>
          <Button onClick={() => setIsCreateGroupOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : chats.length > 0 ? (
            <div className="divide-y">
              {chats.map((chat) => (
                <div 
                  key={chat.id}
                  className="py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded"
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    {chat.type === 'group' ? (
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    ) : (
                      <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(chat.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No conversations yet</h3>
              <p className="text-gray-500 mb-4">
                Start chatting with users from the leaderboard or create a new group.
              </p>
              <Button onClick={() => setIsCreateGroupOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create a Group
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <GroupChatModal 
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onGroupCreated={handleCreateGroup}
      />
    </div>
  );
};

export default ChatSystem;
