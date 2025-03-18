
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatDB } from '@/lib/db';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import ChatHeader from '@/components/ChatHeader';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles, LogIn, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!authLoading) {
      initializeChat();
    }
  }, [authLoading]);

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

  if (isLoading || authLoading) {
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
          rightContent={
            <div className="flex items-center gap-2">
              {currentUser ? (
                <Button 
                  variant="ghost" 
                  size="icon"
                  asChild
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/40"
                >
                  <Link to="/profile">
                    <UserCircle className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/40"
                >
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          }
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
