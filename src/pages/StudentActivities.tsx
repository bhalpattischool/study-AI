
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, CheckSquare, Award, QrCode, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentGoals from '@/components/student/StudentGoals';
import StudentTasks from '@/components/student/StudentTasks';
import StudentPointsHistory from '@/components/student/StudentPointsHistory';
import StudentProfileQR from '@/components/student/StudentProfileQR';
import { ScrollArea } from '@/components/ui/scroll-area';

const StudentActivities = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('goals');
  const [studentPoints, setStudentPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
    
    // Get student points and level from localStorage
    if (currentUser) {
      const storedPoints = localStorage.getItem(`${currentUser.uid}_points`);
      const storedLevel = localStorage.getItem(`${currentUser.uid}_level`);
      
      setStudentPoints(storedPoints ? parseInt(storedPoints) : 0);
      setStudentLevel(storedLevel ? parseInt(storedLevel) : 1);
      
      // Calculate level progress (points needed for next level = level * 100)
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
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">छात्र गतिविधियाँ</h1>
        </div>
        
        <Card className="mb-4 bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{currentUser?.displayName || 'Student'}</h2>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Level {studentLevel}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {studentPoints} पॉइंट्स
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById('qr-dialog')?.click()}
                >
                  <QrCode className="h-4 w-4" />
                  प्रोफाइल शेयर
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">अगले लेवल तक</span>
                <span className="text-sm font-medium">{levelProgress}%</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="goals" className="text-xs sm:text-sm">
                  <Target className="h-4 w-4 mr-1 hidden sm:inline" />
                  लक्ष्य
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                  <CheckSquare className="h-4 w-4 mr-1 hidden sm:inline" />
                  कार्य
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs sm:text-sm">
                  <Award className="h-4 w-4 mr-1 hidden sm:inline" />
                  इतिहास
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <TabsContent value="goals" className="m-0">
              <StudentGoals 
                studentPoints={studentPoints} 
                setStudentPoints={setStudentPoints} 
                studentLevel={studentLevel}
                setStudentLevel={setStudentLevel}
                currentUser={currentUser}
              />
            </TabsContent>
            
            <TabsContent value="tasks" className="m-0">
              <StudentTasks 
                studentPoints={studentPoints} 
                setStudentPoints={setStudentPoints}
                studentLevel={studentLevel}
                setStudentLevel={setStudentLevel}
                currentUser={currentUser}
              />
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              <StudentPointsHistory currentUser={currentUser} />
            </TabsContent>
          </ScrollArea>
        </Card>
        
        {/* Hidden QR code dialog trigger */}
        <StudentProfileQR currentUser={currentUser} studentPoints={studentPoints} studentLevel={studentLevel} />
      </div>
    </div>
  );
};

export default StudentActivities;
