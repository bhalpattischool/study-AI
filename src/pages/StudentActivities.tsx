
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from 'lucide-react';
import StudyTimerWidget from '@/components/student/StudyTimerWidget';
import StudentDailyStreak from '@/components/student/StudentDailyStreak';
import StudentLearningProgress from '@/components/student/StudentLearningProgress';
import StudentPointsHistory from '@/components/student/StudentPointsHistory';
import StudentLeaderboard from '@/components/student/StudentLeaderboard';
import StudentGoals from '@/components/student/StudentGoals';
import StudentTasks from '@/components/student/StudentTasks';
import StudentProfileQR from '@/components/student/StudentProfileQR';
import StudentActivitiesHelp from '@/components/student/StudentActivitiesHelp';
import QRScanner from '@/components/student/QRScanner';
import StudyGoalTracker from '@/components/student/StudyGoalTracker';
import { useMediaQuery } from '@/hooks/use-media-query';

const StudentActivities = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('timer');
  const [studentPoints, setStudentPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
    
    if (currentUser) {
      loadStudentData();
    }
  }, [currentUser, isLoading, navigate]);
  
  const loadStudentData = () => {
    if (!currentUser) return;
    
    // Get points from localStorage (fallback) or try to get from Firebase
    const points = localStorage.getItem(`${currentUser.uid}_points`);
    const level = localStorage.getItem(`${currentUser.uid}_level`);
    
    setStudentPoints(points ? parseInt(points) : 0);
    setStudentLevel(level ? parseInt(level) : 1);
  };
  
  const handleOpenQRDialog = () => {
    const qrDialog = document.getElementById('qr-dialog') as HTMLButtonElement;
    if (qrDialog) {
      qrDialog.click();
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">अध्ययन गतिविधियां</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <QRScanner currentUser={currentUser} />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
              onClick={handleOpenQRDialog}
            >
              <QrCode className="h-4 w-4" />
              मेरा QR कोड
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="p-4 pb-0">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="timer">टाइमर</TabsTrigger>
                <TabsTrigger value="progress">प्रगति</TabsTrigger>
                <TabsTrigger value="goals">लक्ष्य</TabsTrigger>
                <TabsTrigger value="leaderboard">लीडरबोर्ड</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timer" className="m-0 space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StudyTimerWidget currentUser={currentUser} />
                  <StudentDailyStreak currentUser={currentUser} />
                </div>
                <StudyGoalTracker currentUser={currentUser} />
              </TabsContent>
              
              <TabsContent value="progress" className="m-0">
                <div className="grid grid-cols-1 gap-4 p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">अध्ययन प्रगति</CardTitle>
                    </CardHeader>
                    <StudentLearningProgress currentUser={currentUser} />
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">पॉइंट्स इतिहास</CardTitle>
                    </CardHeader>
                    <StudentPointsHistory currentUser={currentUser} />
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="m-0">
                <div className="grid grid-cols-1 gap-4 p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">अध्ययन लक्ष्य</CardTitle>
                    </CardHeader>
                    <StudentGoals 
                      currentUser={currentUser} 
                      studentPoints={studentPoints}
                      setStudentPoints={setStudentPoints}
                      studentLevel={studentLevel}
                      setStudentLevel={setStudentLevel}
                    />
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">अध्ययन कार्य</CardTitle>
                    </CardHeader>
                    <StudentTasks 
                      currentUser={currentUser} 
                      studentPoints={studentPoints}
                      setStudentPoints={setStudentPoints}
                      studentLevel={studentLevel}
                      setStudentLevel={setStudentLevel}
                    />
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="leaderboard" className="m-0">
                <div className="p-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">लीडरबोर्ड</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StudentLeaderboard currentUser={currentUser} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <ScrollArea className={isMobile ? 'h-[calc(100vh-9rem)]' : 'h-[calc(100vh-8rem)]'}>
            {/* ScrollArea content is now empty as we moved the TabsContent components up */}
          </ScrollArea>
        </Card>
        
        <StudentProfileQR 
          currentUser={currentUser}
          studentPoints={studentPoints}
          studentLevel={studentLevel}
        />
        
        <StudentActivitiesHelp />
      </div>
    </div>
  );
};

export default StudentActivities;
