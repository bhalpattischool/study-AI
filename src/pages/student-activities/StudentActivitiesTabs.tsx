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
    <Card>
      <CardHeader className="p-4 pb-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="timer">टाइमर</TabsTrigger>
            <TabsTrigger value="progress">प्रगति</TabsTrigger>
            <TabsTrigger value="goals">लक्ष्य</TabsTrigger>
            <TabsTrigger value="leaderboard">लीडरबोर्ड</TabsTrigger>
            <TabsTrigger value="planner">प्लानर</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="m-0 space-y-4 p-4">
            <DailyTaskGenerator />
          </TabsContent>
          <TabsContent value="planner" className="m-0 space-y-4 p-4">
            <StudyPlanner onSendMessage={onSendMessage} />
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
    </Card>
  );
};

export default StudentActivitiesTabs;
