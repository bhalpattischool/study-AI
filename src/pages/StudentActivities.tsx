
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import StudentActivitiesLoading from './student-activities/StudentActivitiesLoading';
import StudentActivitiesContainer from './student-activities/StudentActivitiesContainer';
import { awardDailyLoginBonus } from '@/utils/points';
import { toast } from 'sonner';

const StudentActivities = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('timer');
  const [studentPoints, setStudentPoints] = useState(0);
  const [studentLevel, setStudentLevel] = useState(1);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const location = useLocation();
  const [bonusAwarded, setBonusAwarded] = useState(false);

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
      // Award daily login bonus when user visits the page
      if (!bonusAwarded) {
        awardDailyLoginBonus(currentUser.uid).then(awarded => {
          if (awarded) {
            // If points were awarded, refresh student data
            loadStudentData();
            setBonusAwarded(true);
            toast.success("दैनिक लॉगिन बोनस मिला! अपने पॉइंट्स देखें।", {
              duration: 5000,
            });
          }
        }).catch(error => {
          console.error("Error awarding daily login bonus:", error);
        });
      }
    }
    // eslint-disable-next-line
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
    return <StudentActivitiesLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 p-2 sm:p-4">
      <StudentActivitiesContainer 
        currentUser={currentUser}
        studentPoints={studentPoints}
        setStudentPoints={setStudentPoints}
        studentLevel={studentLevel}
        setStudentLevel={setStudentLevel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSendMessage={handleSendMessage}
        handleOpenQRDialog={handleOpenQRDialog}
        isMobile={isMobile}
      />
    </div>
  );
};

export default StudentActivities;
