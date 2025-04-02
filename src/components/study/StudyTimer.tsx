
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, PlayCircle, PauseCircle, RotateCcw, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

interface StudyTimerProps {
  onComplete?: () => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [studySessions, setStudySessions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setStudySessions(prev => prev + 1);
      toast({
        title: "Study Session Complete!",
        description: "Great job! Take a 5 minute break before your next session.",
      });
      if (onComplete) onComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, toast, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (25 * 60)) * 100;

  return (
    <Card className="border border-purple-100 dark:border-purple-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-purple-800 dark:text-purple-300">
          <Clock className="h-5 w-5" />
          <span>Study Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <Progress value={progress} className="w-full h-2 mb-4" />
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline"
              size="sm" 
              onClick={toggleTimer}
              className="flex items-center gap-1 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              {isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetTimer}
              className="flex items-center gap-1 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {studySessions > 0 && (
            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 gap-1 animate-fade-in">
              <Award className="h-4 w-4" />
              <span>{studySessions} {studySessions === 1 ? 'session' : 'sessions'} completed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;
