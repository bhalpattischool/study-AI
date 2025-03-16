
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Plus, Edit, MoreVertical } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onToggleSidebar, onNewChat, className }) => {
  return (
    <header className={cn("flex items-center justify-between px-4 py-3 border-b", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleSidebar}
        className="h-10 w-10"
      >
        <Menu size={24} />
      </Button>

      <Button 
        className="rounded-full flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black"
        variant="ghost"
        onClick={onNewChat}
      >
        <span>Get Plus</span>
        <Plus size={18} />
      </Button>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Edit size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <MoreVertical size={24} />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
