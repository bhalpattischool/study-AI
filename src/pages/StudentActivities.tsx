
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import StudentProfileQR from '@/components/student/StudentProfileQR';
import StudentActivitiesHelp from '@/components/student/StudentActivitiesHelp';
import { useMediaQuery } from '@/hooks/use-media-query';
import StudentActivitiesHeader from './student-activities/StudentActivitiesHeader';
import StudentActivitiesTabs from './student-activities/StudentActivitiesTabs';

const StudentActivities = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('timer');
  const [studentPoints, setStudentPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const location = useLocation();
  
  const handleSendMessage = (message: string) => {
    console.log("Message to be sent:", message);
  };
  
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
    
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
    
    if (currentUser) {
      loadStudentData();
    }
  }, [currentUser, isLoading, navigate, location.state]);
  
  const loadStudentData = () => {
    if (!currentUser) return;
    
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
          onSendMessage={handleSendMessage}
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
      </div>
    </div>
  );
};

export default StudentActivities;

