import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Star, Calendar, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { addPointsToUser } from '@/utils/points';

interface StudentDailyStreakProps {
  currentUser: any;
}

const StudentDailyStreak: React.FC<StudentDailyStreakProps> = ({ currentUser }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  
  useEffect(() => {
    if (currentUser) {
      loadStreakData();
    }
  }, [currentUser]);
  
  const loadStreakData = () => {
    const streakKey = `${currentUser.uid}_login_streak`;
    const longestStreakKey = `${currentUser.uid}_longest_streak`;
    const lastLoginKey = `${currentUser.uid}_last_login`;
    
    const currentStreakValue = parseInt(localStorage.getItem(streakKey) || '0');
    const longestStreakValue = parseInt(localStorage.getItem(longestStreakKey) || '0');
    const lastLogin = localStorage.getItem(lastLoginKey);
    
    setCurrentStreak(currentStreakValue);
    setLongestStreak(longestStreakValue);
    setLastLoginDate(lastLogin);
    
    const today = new Date().toDateString();
    setTodayCheckedIn(lastLogin === today);
    
    setWeeklyProgress(Math.min(currentStreakValue, 7) * (100/7));
  };
  
  const handleDailyCheckIn = async () => {
    if (todayCheckedIn || !currentUser) return;
    
    const today = new Date().toDateString();
    const lastLoginKey = `${currentUser.uid}_last_login`;
    const streakKey = `${currentUser.uid}_login_streak`;
    const longestStreakKey = `${currentUser.uid}_longest_streak`;
    
    const lastLogin = localStorage.getItem(lastLoginKey);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    let bonusPoints = 5;
    let streakMessage = '';
    
    if (lastLogin && new Date(lastLogin).toDateString() === yesterday.toDateString()) {
      const currentStreakValue = parseInt(localStorage.getItem(streakKey) || '0');
      newStreak = currentStreakValue + 1;
      
      if (newStreak % 7 === 0) {
        bonusPoints += 15;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक बोनस!)`;
      } else if (newStreak % 3 === 0) {
        bonusPoints += 10;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      } else {
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      }
    } else {
      newStreak = 1;
    }
    
    localStorage.setItem(lastLoginKey, today);
    localStorage.setItem(streakKey, newStreak.toString());
    
    const currentLongestStreak = parseInt(localStorage.getItem(longestStreakKey) || '0');
    if (newStreak > currentLongestStreak) {
      localStorage.setItem(longestStreakKey, newStreak.toString());
      setLongestStreak(newStreak);
    }
    
    await addPointsToUser(
      currentUser.uid, 
      bonusPoints, 
      'streak', 
      `दैनिक चेक-इन${streakMessage}`
    );
    
    setCurrentStreak(newStreak);
    setTodayCheckedIn(true);
    setWeeklyProgress(Math.min(newStreak, 7) * (100/7));
    
    toast.success(`चेक-इन सफल! +${bonusPoints} पॉइंट्स मिले${streakMessage}`);
  };
  
  return (
    <CardContent className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            दैनिक स्ट्रीक
          </h3>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            {currentStreak} दिन
          </Badge>
        </div>
        
        <div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 7 }).map((_, index) => {
              const isActive = index < Math.min(currentStreak, 7);
              return (
                <div 
                  key={index} 
                  className={`h-8 rounded-md flex items-center justify-center 
                  ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {isActive && <Flame className="h-4 w-4" />}
                </div>
              );
            })}
          </div>
          
          <Progress value={weeklyProgress} className="h-2 mb-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 दिन</span>
            <span>7 दिन</span>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">सबसे लंबी स्ट्रीक</span>
            </div>
            <Badge variant="secondary">{longestStreak} दिन</Badge>
          </div>
          
          <button
            onClick={handleDailyCheckIn}
            disabled={todayCheckedIn}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 
            ${todayCheckedIn 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
          >
            {todayCheckedIn ? (
              <>
                <Star className="h-4 w-4" />
                आज चेक-इन पूरा हो गया
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" />
                आज का चेक-इन करें
              </>
            )}
          </button>
          
          {lastLoginDate && (
            <div className="mt-2 text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              अंतिम चेक-इन: {new Date(lastLoginDate).toLocaleDateString('hi-IN')}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default StudentDailyStreak;
