
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { 
  Home, BookmarkCheck, LogOut, LogIn, 
  UserPlus, Volume2 
} from 'lucide-react';
import { logoutUser } from '@/lib/firebase';
import { toast } from "sonner";

interface ProfileNavigationProps {
  isAuthenticated: boolean;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { isTTSEnabled, toggleTTS } = useTextToSpeech();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Navigation</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <Button 
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4 mr-2 text-purple-500" />
          Home
        </Button>
        
        {isAuthenticated ? (
          <>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/saved-messages')}
            >
              <BookmarkCheck className="h-4 w-4 mr-2 text-purple-500" />
              Saved Messages
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTTS}
            >
              <Volume2 className="h-4 w-4 mr-2 text-purple-500" />
              {isTTSEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 text-purple-500" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4 mr-2 text-purple-500" />
              Login
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="h-4 w-4 mr-2 text-purple-500" />
              Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileNavigation;
