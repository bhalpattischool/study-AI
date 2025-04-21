
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessagesSquare, 
  Bookmark, 
  User,
  BookOpen,
  GraduationCap,
  SendHorizontal,
  Users,
  MessageCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center space-x-2 font-semibold">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span>Study AI</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          <SidebarLink 
            to="/" 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
            active={isActive('/')} 
          />
          
          <SidebarLink 
            to="/messages" 
            icon={<MessagesSquare className="h-5 w-5" />} 
            label="History" 
            active={isActive('/messages')} 
          />
          
          <SidebarLink 
            to="/saved" 
            icon={<Bookmark className="h-5 w-5" />} 
            label="Saved" 
            active={isActive('/saved')} 
          />

          <SidebarLink 
            to="/chat" 
            icon={<MessageCircle className="h-5 w-5" />} 
            label="Chat" 
            active={isActive('/chat')} 
          />
          
          <SidebarLink 
            to="/activities" 
            icon={<GraduationCap className="h-5 w-5" />} 
            label="Activities" 
            active={isActive('/activities')} 
          />
          
          <SidebarLink 
            to="/teacher" 
            icon={<SendHorizontal className="h-5 w-5" />} 
            label="Ask Teacher" 
            active={isActive('/teacher')} 
          />
          
          <SidebarLink 
            to="/profile" 
            icon={<User className="h-5 w-5" />} 
            label="Profile" 
            active={isActive('/profile')} 
          />
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg bg-purple-50 dark:bg-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium">Students Community</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Connect with other students on the leaderboard and share your learning journey!
            </p>
            <Button 
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Link to="/chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Open Chat
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Button 
      asChild
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Link to={to}>
        <span className="mr-2">{icon}</span>
        {label}
      </Link>
    </Button>
  );
};

export default Sidebar;
