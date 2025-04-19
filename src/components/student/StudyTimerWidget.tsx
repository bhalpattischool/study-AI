
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, PlayCircle, PauseCircle, RotateCcw, Award, Settings2, Bell, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { addPointsToUser } from '@/utils/points';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalStudyTime, setTotalStudyTime] = useState(0); // Total study time in minutes
  const [breakTime, setBreakTime] = useState(5); // Break time in minutes
  
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Load saved settings
  useEffect(() => {
    if (currentUser) {
      const savedSoundSetting = localStorage.getItem(`${currentUser.uid}_timer_sound`);
      const savedBreakTime = localStorage.getItem(`${currentUser.uid}_break_time`);
      
      if (savedSoundSetting !== null) {
        setSoundEnabled(savedSoundSetting === 'true');
      }
      
      if (savedBreakTime) {
        setBreakTime(parseInt(savedBreakTime));
      }
    }
  }, [currentUser]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Play sound if enabled
      if (soundEnabled) {
        playTimerCompletionSound();
      }
      
      if (timerMode === 'study') {
        // Completed study session
        setStudySessions(prev => prev + 1);
        setTotalStudyTime(prev => prev + Math.floor(originalTime / 60));
        
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
        setTimeLeft(breakTime * 60); // Custom break time
        setOriginalTime(breakTime * 60);
        
        toast.success("अध्ययन सत्र पूरा हुआ! ब्रेक लें।");
      } else {
        // Completed break
        setTimerMode('study');
        setTimeLeft(25 * 60); // Back to 25 minute study session
        setOriginalTime(25 * 60);
        
        toast.success("ब्रेक पूरा हुआ! अगला अध्ययन सत्र शुरू करें।");
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, currentUser, originalTime, soundEnabled, breakTime]);
  
  // Load session count and total study time from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      const savedSessions = localStorage.getItem(`${currentUser.uid}_study_sessions`);
      const savedTotalTime = localStorage.getItem(`${currentUser.uid}_total_study_time`);
      
      if (savedSessions) {
        setStudySessions(parseInt(savedSessions));
      }
      
      if (savedTotalTime) {
        setTotalStudyTime(parseInt(savedTotalTime));
      }
    }
  }, [currentUser]);
  
  // Save session count and total study time to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${currentUser.uid}_study_sessions`, studySessions.toString());
      localStorage.setItem(`${currentUser.uid}_total_study_time`, totalStudyTime.toString());
    }
  }, [studySessions, totalStudyTime, currentUser]);

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
      toast.success(`टाइमर ${minutes} मिनट पर सेट किया गया`);
    }
  };
  
  const changeBreakDuration = (minutes: number) => {
    setBreakTime(minutes);
    localStorage.setItem(`${currentUser.uid}_break_time`, minutes.toString());
    toast.success(`ब्रेक समय ${minutes} मिनट पर सेट किया गया`);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem(`${currentUser.uid}_timer_sound`, (!soundEnabled).toString());
    toast.success(soundEnabled ? 'ध्वनि बंद की गई' : 'ध्वनि चालू की गई');
  };
  
  const playTimerCompletionSound = () => {
    try {
      // Create a simple beep sound using the Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatTotalTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} मिनट`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} घंटे ${remainingMinutes} मिनट` 
        : `${hours} घंटे`;
    }
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
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>अध्ययन समय</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => changeTimerDuration(15)}>15 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeTimerDuration(25)}>25 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeTimerDuration(45)}>45 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeTimerDuration(60)}>60 मिनट</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>ब्रेक समय</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => changeBreakDuration(3)}>3 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeBreakDuration(5)}>5 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeBreakDuration(10)}>10 मिनट</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeBreakDuration(15)}>15 मिनट</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onSelect={toggleSound}>
                {soundEnabled ? (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>ध्वनि बंद करें</span>
                  </>
                ) : (
                  <>
                    <Radio className="mr-2 h-4 w-4" />
                    <span>ध्वनि चालू करें</span>
                  </>
                )}
              </DropdownMenuItem>
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
          
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 text-sm">
            <div className="flex items-center text-purple-600 dark:text-purple-400 gap-1">
              <Award className="h-4 w-4" />
              <span>{studySessions} {studySessions === 1 ? 'सत्र' : 'सत्र'} पूरा</span>
            </div>
            
            {totalStudyTime > 0 && (
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 gap-1">
                <Clock className="h-4 w-4" />
                <span>कुल: {formatTotalTime(totalStudyTime)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimerWidget;
