
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserInfoCards from '@/components/profile/UserInfoCards';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const Profile = () => {
  const { currentUser, isLoading } = useAuth();
  const [userCategory, setUserCategory] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
    
    // Get user data from localStorage
    if (currentUser) {
      setUserCategory(localStorage.getItem('userCategory') || '');
      setEducationLevel(localStorage.getItem('educationLevel') || '');
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 p-2 sm:p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-bold">My Profile</h1>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 sm:p-6">
              <ProfileHeader currentUser={currentUser} />
              
              <UserInfoCards 
                userCategory={userCategory} 
                educationLevel={educationLevel} 
              />

              <Separator className="my-6" />
              
              <ProfileNavigation isAuthenticated={!!currentUser} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Profile;
