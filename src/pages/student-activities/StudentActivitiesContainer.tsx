
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import StudentProfileQR from '@/components/student/StudentProfileQR';
import StudentActivitiesHelp from '@/components/student/StudentActivitiesHelp';
import StudentActivitiesHeader from './StudentActivitiesHeader';
import StudentActivitiesTabs from './StudentActivitiesTabs';
import FloatingLeaderboardWidget from '@/components/student/FloatingLeaderboardWidget';
import { useMediaQuery } from '@/hooks/use-media-query';

interface StudentActivitiesContainerProps {
  currentUser: any;
  studentPoints: number;
  setStudentPoints: (points: number) => void;
  studentLevel: number;
  setStudentLevel: (level: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSendMessage: (msg: string) => void;
  handleOpenQRDialog: () => void;
  isMobile: boolean;
}

const StudentActivitiesContainer: React.FC<StudentActivitiesContainerProps> = ({
  currentUser,
  studentPoints,
  setStudentPoints,
  studentLevel,
  setStudentLevel,
  activeTab,
  setActiveTab,
  onSendMessage,
  handleOpenQRDialog,
  isMobile,
}) => (
  <div className="max-w-4xl mx-auto relative">
    <StudentActivitiesHeader 
      currentUser={currentUser}
      onOpenQRDialog={handleOpenQRDialog}
    />
    <StudentActivitiesTabs
      currentUser={currentUser}
      studentPoints={studentPoints}
      setStudentPoints={setStudentPoints}
      studentLevel={studentLevel}
      setStudentLevel={setStudentLevel}
      onSendMessage={onSendMessage}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
    <ScrollArea className={isMobile ? 'h-[calc(100vh-9rem)]' : 'h-[calc(100vh-8rem)]'}>
      <div className="h-0"></div>
    </ScrollArea>
    <StudentProfileQR 
      currentUser={currentUser}
      studentPoints={studentPoints}
      studentLevel={studentLevel}
    />
    <StudentActivitiesHelp />
    
    {/* फ्लोटिंग लीडरबोर्ड विजेट */}
    {currentUser && <FloatingLeaderboardWidget currentUserId={currentUser.uid} />}
  </div>
);

export default StudentActivitiesContainer;
