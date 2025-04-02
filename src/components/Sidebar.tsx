
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Home, User, History, School, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose ? (open) => !open && onClose() : undefined}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Study AI</SheetTitle>
            <SheetDescription>
              Navigate your learning journey.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Link to="/" onClick={onClose} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link to="/profile" onClick={onClose} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>

            {currentUser && (
              <>
                <Link to="/chat-history" onClick={onClose} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <History className="h-4 w-4 text-blue-500" />
                  <span>Chat History</span>
                </Link>
                
                <Link to="/teacher-chats" onClick={onClose} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <School className="h-4 w-4 text-green-500" />
                  <span>Teacher Chats</span>
                </Link>
                
                <Link to="/feedback" onClick={onClose} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                  <span>Share Feedback</span>
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="text-lg font-semibold">Study AI</Link>
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex-grow px-4 py-6">
          <Link to="/" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          <Link to="/profile" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
          
          {currentUser && (
            <>
              <Link to="/chat-history" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <History className="h-4 w-4 text-blue-500" />
                <span>Chat History</span>
              </Link>
              
              <Link to="/teacher-chats" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <School className="h-4 w-4 text-green-500" />
                <span>Teacher Chats</span>
              </Link>
              
              <Link to="/feedback" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <MessageSquare className="h-4 w-4 text-orange-500" />
                <span>Share Feedback</span>
              </Link>
            </>
          )}
        </div>
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <a href="https://github.com/AntonioErdeljac/next13-ai-chatbot" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            © 2024 Study AI
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
