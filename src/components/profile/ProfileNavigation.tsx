
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
    <div className="space-y-4 w-full">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Navigation</h3>
      
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        <Button 
          variant="outline"
          className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
          Home
        </Button>
        
        {isAuthenticated ? (
          <>
            <Button 
              variant="outline"
              className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
              onClick={() => navigate('/saved-messages')}
            >
              <BookmarkCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
              Saved Messages
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
              onClick={toggleTTS}
            >
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
              <span className="truncate">
                {isTTSEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
              </span>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline"
              className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
              Login
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start text-sm sm:text-base py-1.5 sm:py-2"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-500" />
              Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileNavigation;
