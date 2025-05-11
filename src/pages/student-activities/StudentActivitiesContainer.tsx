
import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import StudentProfileQR from '@/components/student/StudentProfileQR';
import StudentActivitiesHelp from '@/components/student/StudentActivitiesHelp';
import StudentActivitiesHeader from './StudentActivitiesHeader';
import StudentActivitiesTabs from './StudentActivitiesTabs';
import FloatingLeaderboardWidget from '@/components/student/FloatingLeaderboardWidget';
import DailyLoginBonus from '@/components/student/DailyLoginBonus';
import { useMediaQuery } from '@/hooks/use-media-query';
import DailyStreakDisplay from '@/components/student/DailyStreakDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { AdBanner } from '@/components/ads';

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
}) => {
  const [loginBonusPoints, setLoginBonusPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [showStreakCard, setShowStreakCard] = useState(true);
  const [showAds, setShowAds] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      const streakKey = `${currentUser.uid}_login_streak`;
      const streak = parseInt(localStorage.getItem(streakKey) || '0');
      setStreakDays(streak);
      
      // Check for today's login bonus
      const todayBonusKey = `${currentUser.uid}_today_bonus`;
      const todayBonus = localStorage.getItem(todayBonusKey);
      
      if (!todayBonus) {
        let bonusPoints = 5; // Increased base login bonus
        
        if (streak % 7 === 0 && streak > 0) {
          bonusPoints += 15;
        } else if (streak % 3 === 0 && streak > 0) {
          bonusPoints += 10;
        }
        
        setLoginBonusPoints(bonusPoints);
        localStorage.setItem(todayBonusKey, Date.now().toString());
      }
    }
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto relative">
      <StudentActivitiesHeader 
        currentUser={currentUser}
        onOpenQRDialog={handleOpenQRDialog}
      />
      
      {/* Display daily streak if streak > 0 */}
      {currentUser && streakDays > 0 && showStreakCard && (
        <div className="mb-4">
          <DailyStreakDisplay 
            streakDays={streakDays} 
            className="border-purple-200"
          />
        </div>
      )}
      
      {/* Non-intrusive ad placement */}
      {showAds && (
        <div className="px-4 mb-4">
          <AdBanner className="max-w-lg mx-auto" slot="2406295156" />
        </div>
      )}
      
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
      
      {/* Floating Leaderboard Widget */}
      {currentUser && <FloatingLeaderboardWidget currentUserId={currentUser.uid} />}
      
      {/* Daily Login Bonus */}
      {currentUser && loginBonusPoints > 0 && (
        <DailyLoginBonus 
          userId={currentUser.uid}
          points={loginBonusPoints}
          streakDays={streakDays}
        />
      )}
    </div>
  );
};

export default StudentActivitiesContainer;
