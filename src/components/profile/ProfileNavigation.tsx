
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  History,
  Bookmark,
  LogOut,
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  Activity
} from 'lucide-react';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProfileNavigationProps {
  isAuthenticated: boolean;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full justify-start bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
        asChild
      >
        <Link to="/chat-history">
          <History className="mr-2 h-5 w-5 text-purple-600" />
          Chat History
        </Link>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="w-full justify-start bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
        asChild
      >
        <Link to="/saved-messages">
          <Bookmark className="mr-2 h-5 w-5 text-purple-600" />
          Saved Messages
        </Link>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="w-full justify-start bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
        asChild
      >
        <Link to="/teacher-chats">
          <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
          Teacher Chats
        </Link>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="w-full justify-start bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
        asChild
      >
        <Link to="/student-activities">
          <Activity className="mr-2 h-5 w-5 text-purple-600" />
          Student Activities
        </Link>
      </Button>

      <Button 
        variant="outline" 
        size="lg" 
        className="w-full justify-start bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700" 
        asChild
      >
        <Link to="/feedback">
          <ThumbsUp className="mr-2 h-5 w-5 text-purple-600" />
          Send Feedback
        </Link>
      </Button>
      
      {isAuthenticated && (
        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      )}
    </div>
  );
};

export default ProfileNavigation;
