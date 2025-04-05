import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, PlayCircle, PauseCircle, RotateCcw, Award, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { addPointsToUser } from '@/utils/pointsSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudyTimerWidgetProps {
  currentUser: any;
}

const StudyTimerWidget: React.FC<StudyTimerWidgetProps> = ({ currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [originalTime, setOriginalTime] = useState(25 * 60); // For resetting and calculating progress
  const [isActive, setIsActive] = useState(false);
  const [studySessions, setStudySessions] = useState(0);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      if (timerMode === 'study') {
        // Completed study session
        setStudySessions(prev => prev + 1);
        
        // Award points for study session
        if (currentUser) {
          addPointsToUser(
            currentUser.uid,
            15,
            'activity',
            `${Math.floor(originalTime / 60)} मिनट का अध्ययन सत्र पूरा किया`
          );
        }
        
        // Switch to break mode
        setTimerMode('break');
        setTimeLeft(5 * 60); // 5 minute break
        setOriginalTime(5 * 60);
        
        toast.success("अध्ययन सत्र पूरा हुआ! 5 मिनट का ब्रेक लें।");
      } else {
        // Completed break
        setTimerMode('study');
        setTimeLeft(25 * 60); // Back to 25 minute study session
        setOriginalTime(25 * 60);
        
        toast.success("ब्रेक पूरा हुआ! अगला अध्ययन सत्र शुरू करें।");
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, currentUser, originalTime]);
  
  // Load session count from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      const savedSessions = localStorage.getItem(`${currentUser.uid}_study_sessions`);
      if (savedSessions) {
        setStudySessions(parseInt(savedSessions));
      }
    }
  }, [currentUser]);
  
  // Save session count to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${currentUser.uid}_study_sessions`, studySessions.toString());
    }
  }, [studySessions, currentUser]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(originalTime);
  };
  
  const changeTimerDuration = (minutes: number) => {
    if (!isActive) {
      const newTime = minutes * 60;
      setTimeLeft(newTime);
      setOriginalTime(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / originalTime) * 100;

  return (
    <Card className="border border-purple-100 dark:border-purple-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className={`pb-2 ${
        timerMode === 'study' 
          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40' 
          : 'bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <Clock className="h-5 w-5" />
            <span>{timerMode === 'study' ? 'अध्ययन टाइमर' : 'ब्रेक टाइमर'}</span>
          </CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>टाइमर सेटिंग</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => changeTimerDuration(15)}>15 मिनट</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeTimerDuration(25)}>25 मिनट</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeTimerDuration(45)}>45 मिनट</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeTimerDuration(60)}>60 मिनट</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className={`text-4xl font-bold mb-4 ${
            timerMode === 'study' 
              ? 'text-purple-700 dark:text-purple-300' 
              : 'text-green-700 dark:text-green-300'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          <Progress value={progress} className={`w-full h-2 mb-4 ${
            timerMode === 'study' 
              ? 'bg-purple-100 dark:bg-purple-900' 
              : 'bg-green-100 dark:bg-green-900'
          }`} />
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline"
              size="sm" 
              onClick={toggleTimer}
              className={`flex items-center gap-1 ${
                timerMode === 'study'
                  ? 'border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  : 'border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              {isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {isActive ? "पॉज़" : "स्टार्ट"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetTimer}
              className={`flex items-center gap-1 ${
                timerMode === 'study'
                  ? 'border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  : 'border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              रीसेट
            </Button>
          </div>
          
          {studySessions > 0 && (
            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 gap-1">
              <Award className="h-4 w-4" />
              <span>{studySessions} {studySessions === 1 ? 'सत्र' : 'सत्र'} पूरा किया</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimerWidget;
