
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut, Activity, Star } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserInfoCards from '@/components/profile/UserInfoCards';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { currentUser, isLoading } = useAuth();
  const [userCategory, setUserCategory] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [studentPoints, setStudentPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
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
      
      // Get student points and level
      const storedPoints = localStorage.getItem(`${currentUser.uid}_points`);
      const storedLevel = localStorage.getItem(`${currentUser.uid}_level`);
      
      setStudentPoints(storedPoints ? parseInt(storedPoints) : 0);
      setStudentLevel(storedLevel ? parseInt(storedLevel) : 1);
      
      // Calculate level progress
      const pointsForNextLevel = studentLevel * 100;
      const pointsSinceLastLevel = studentPoints - ((studentLevel - 1) * 100);
      const progress = Math.min(Math.floor((pointsSinceLastLevel / pointsForNextLevel) * 100), 100);
      setLevelProgress(progress);
    }
  }, [currentUser, isLoading, navigate, studentLevel, studentPoints]);

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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="info">Profile Info</TabsTrigger>
                <TabsTrigger value="nav">Navigation</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <TabsContent value="info" className="m-0">
                <div className="p-4 sm:p-6">
                  <ProfileHeader currentUser={currentUser} />
                  
                  {/* Student Points & Level Card */}
                  <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        Student Points
                      </h3>
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        {studentPoints} points
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Level {studentLevel}</span>
                        <span>Next: {((studentLevel * 100) - studentPoints) > 0 ? ((studentLevel * 100) - studentPoints) : 0} points needed</span>
                      </div>
                      <Progress value={levelProgress} className="h-2" />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-white dark:bg-gray-800"
                      asChild
                    >
                      <Link to="/student-activities">
                        <Activity className="h-4 w-4 mr-1" />
                        View Activities
                      </Link>
                    </Button>
                  </div>
                  
                  <UserInfoCards 
                    userCategory={userCategory} 
                    educationLevel={educationLevel} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="nav" className="m-0">
                <div className="p-4 sm:p-6">
                  <ProfileNavigation isAuthenticated={!!currentUser} />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
