import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Book, Home, LogOut, MessageSquare, Settings, Sparkles, User, BookmarkCheck } from 'lucide-react';
import { logoutUser } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sparkles className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Study AI</SheetTitle>
            <SheetDescription>
              Navigate your learning journey.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Link to="/" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/saved-messages" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <BookmarkCheck className="h-4 w-4" />
                  <span>Saved Messages</span>
                </Link>
                <Button variant="ghost" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Book className="h-4 w-4" />
                  <span>Signup</span>
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
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-start">
                  <Avatar className="w-6 h-6">
                    {currentUser.photoURL ? (
                      <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-sm">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {currentUser ? (
                  <DropdownMenuItem asChild>
                    <Link to="/saved-messages" className="cursor-pointer">
                      <BookmarkCheck className="mr-2 h-4 w-4" />
                      Saved Messages
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Book className="h-4 w-4" />
                <span>Signup</span>
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
