
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from '@/hooks/use-media-query';
import DailyTaskGenerator from '@/components/study/DailyTaskGenerator';
import StudyPlanner from '@/components/study/StudyPlanner';
import StudentLearningProgress from '@/components/student/StudentLearningProgress';
import StudentPointsHistory from '@/components/student/StudentPointsHistory';
import StudentLeaderboard from '@/components/student/StudentLeaderboard';
import StudentGoals from '@/components/student/StudentGoals';
import StudentTasks from '@/components/student/StudentTasks';
import StudyGoalTracker from '@/components/student/StudyGoalTracker';
import { 
  TimerIcon, 
  ChartBarIcon, 
  TargetIcon, 
  ListTodoIcon, 
  TrophyIcon, 
  CalendarIcon 
} from '@/components/student/TabIcons';

interface StudentActivitiesTabsProps {
  currentUser: any;
  studentPoints: number;
  setStudentPoints: (points: number) => void;
  studentLevel: number;
  setStudentLevel: (level: number) => void;
  onSendMessage: (msg: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentActivitiesTabs: React.FC<StudentActivitiesTabsProps> = ({
  currentUser,
  studentPoints,
  setStudentPoints,
  studentLevel,
  setStudentLevel,
  onSendMessage,
  activeTab,
  setActiveTab,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Card className="border-purple-100 dark:border-purple-900 overflow-hidden shadow-md">
      <CardHeader className="p-0 pb-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 gap-1 bg-purple-50 dark:bg-purple-900/20 rounded-none">
            <TabsTrigger 
              value="timer"
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <TimerIcon className="h-5 w-5" />
              <span className="text-xs font-medium">टाइमर</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span className="text-xs font-medium">प्रगति</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <TargetIcon className="h-5 w-5" />
              <span className="text-xs font-medium">लक्ष्य</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <ListTodoIcon className="h-5 w-5" />
              <span className="text-xs font-medium">कार्य</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <TrophyIcon className="h-5 w-5" />
              <span className="text-xs font-medium">लीडरबोर्ड</span>
            </TabsTrigger>
            <TabsTrigger 
              value="planner" 
              className="flex flex-col items-center justify-center gap-1 h-16 sm:h-14 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="text-xs font-medium">प्लानर</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="m-0 space-y-4 p-4 animate-fade-in">
            <DailyTaskGenerator />
          </TabsContent>
          <TabsContent value="planner" className="m-0 space-y-4 p-4 animate-fade-in">
            <StudyPlanner onSendMessage={onSendMessage} />
          </TabsContent>
          <TabsContent value="progress" className="m-0 animate-fade-in">
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
          <TabsContent value="goals" className="m-0 animate-fade-in">
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
            </div>
          </TabsContent>
          <TabsContent value="tasks" className="m-0 animate-fade-in">
            <div className="grid grid-cols-1 gap-4 p-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">दैनिक कार्य सूची</CardTitle>
                </CardHeader>
                <StudentTasks 
                  currentUser={currentUser} 
                  studentPoints={studentPoints}
                  setStudentPoints={setStudentPoints}
                  studentLevel={studentLevel}
                  setStudentLevel={setStudentLevel}
                />
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">अध्ययन ट्रैकर</CardTitle>
                </CardHeader>
                <StudyGoalTracker currentUser={currentUser} />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="leaderboard" className="m-0 animate-fade-in">
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
    </Card>
  );
};

export default StudentActivitiesTabs;
