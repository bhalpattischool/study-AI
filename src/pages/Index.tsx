
import React, { useState, useEffect } from 'react';
import { chatDB } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import ChatHeader from '@/components/ChatHeader';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const chats = await chatDB.getAllChats();
      
      if (chats.length > 0) {
        // Load the most recent chat
        setCurrentChatId(chats[0].id);
      } else {
        // Create a new chat if none exists
        const newChat = await chatDB.createNewChat();
        setCurrentChatId(newChat.id);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to initialize chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatDB.createNewChat();
      setCurrentChatId(newChat.id);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            <Sparkles className="animate-pulse" />
          </div>
          <div className="text-purple-800 dark:text-purple-300 font-medium">Loading Study AI...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar 
        currentChatId={currentChatId} 
        onChatSelect={handleChatSelect} 
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen || !isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-full">
        <ChatHeader 
          onToggleSidebar={toggleSidebar} 
          onNewChat={handleNewChat}
        />
        
        {currentChatId && (
          <div className="flex-1 overflow-hidden">
            <Chat 
              chatId={currentChatId} 
              onChatUpdated={() => {}} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
