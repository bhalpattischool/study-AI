
import React, { useState, useEffect } from 'react';
import { chatDB, Chat } from '@/lib/db';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { MessageSquare, Trash, Menu, X } from "lucide-react";
import NewChatButton from './NewChatButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentChatId, onChatSelect, onNewChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadChats();
  }, [currentChatId]);

  const loadChats = async () => {
    try {
      const allChats = await chatDB.getAllChats();
      setChats(allChats);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    try {
      await chatDB.deleteChat(chatId);
      toast.success('Chat deleted');
      
      // If we deleted the current chat, trigger a new chat creation
      if (chatId === currentChatId) {
        onNewChat();
      }
      
      // Refresh the chat list
      loadChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const handleChatClick = (chatId: string) => {
    onChatSelect(chatId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}
      
      <aside 
        className={cn(
          "bg-sidebar text-sidebar-foreground w-64 flex flex-col border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out h-full",
          isMobile ? "fixed inset-y-0 left-0 z-40" : "relative",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-4">
          <NewChatButton onClick={handleNewChat} />
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-md cursor-pointer",
                  "transition-colors truncate hover:bg-sidebar-accent",
                  chat.id === currentChatId && "bg-sidebar-accent"
                )}
                onClick={() => handleChatClick(chat.id)}
              >
                <MessageSquare size={16} className="flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash size={14} className="text-sidebar-foreground/70 hover:text-destructive" />
                </Button>
              </div>
            ))}
            
            {chats.length === 0 && (
              <div className="py-8 text-center text-sidebar-foreground/50 italic text-sm">
                No chat history
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 text-xs text-sidebar-foreground/50 border-t border-sidebar-border">
          Gemini Chat
        </div>
      </aside>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
