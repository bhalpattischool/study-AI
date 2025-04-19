import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Clock, PlayCircle, PauseCircle, RotateCcw, Award, Check, Flag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { addPointsToUser } from '@/utils/points';
import { toast } from 'sonner';

interface StudyTimerProps {
  onComplete?: () => void;
  taskName?: string;
  taskSubject?: string;
  taskDuration?: number; // in minutes
  taskId?: string;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ 
  onComplete, 
  taskName = "Study Session",
  taskSubject = "General Study",
  taskDuration = 25,
  taskId
}) => {
  const [timeLeft, setTimeLeft] = useState(taskDuration * 60); // convert minutes to seconds
  const [isActive, setIsActive] = useState(false);
  const [studySessions, setStudySessions] = useState(0);
  const [taskComplete, setTaskComplete] = useState(false);
  const [initialDuration] = useState(taskDuration * 60);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setStudySessions(prev => prev + 1);
      setTaskComplete(true);
      
      toast({
        title: "Study Session Complete!",
        description: "Great job! You've earned XP points for completing this task.",
      });
      
      // Award XP points to the user
      if (currentUser) {
        addPointsToUser(
          currentUser.uid, 
          10, // Base XP for completing a study session
          'activity',
          `${taskSubject} - ${taskName} अध्ययन पूरा किया`
        );
      }
      
      if (onComplete) onComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, toast, onComplete, currentUser, taskName, taskSubject]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(taskDuration * 60);
    setTaskComplete(false);
  };

  const completeTask = () => {
    // Award additional XP for completing the task before timer ends (only if significant time was spent)
    const timeSpentPercentage = (initialDuration - timeLeft) / initialDuration * 100;
    
    if (currentUser && timeSpentPercentage >= 50) {
      // Calculate XP based on time spent percentage
      const xpAwarded = timeSpentPercentage >= 90 ? 15 : 7;
      
      addPointsToUser(
        currentUser.uid, 
        xpAwarded,
        'task',
        `${taskSubject} - ${taskName} अध्ययन कार्य पूरा किया`
      );
      
      toast({
        title: "Task Completed!",
        description: `You've earned ${xpAwarded} XP points. Keep up the good work!`,
      });
      
      setTaskComplete(true);
      if (onComplete) onComplete();
    } else if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Sign in to track your progress and earn XP points!",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Study More Time",
        description: "You need to study at least half the allocated time to earn XP!",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (taskDuration * 60)) * 100;

  return (
    <Card className="border border-purple-100 dark:border-purple-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <Clock className="h-5 w-5" />
            <span>{taskSubject}</span>
          </div>
          {taskComplete && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3" />
              पूरा हुआ
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <h3 className="text-purple-700 dark:text-purple-300 font-medium mb-2">{taskName}</h3>
          
          <div className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <Progress value={progress} className="w-full h-2 mb-4" />
          
          <div className="flex gap-2 mb-4 w-full">
            {!taskComplete ? (
              <>
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={toggleTimer}
                  className="flex-1 flex items-center justify-center gap-1 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  {isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {isActive ? "पॉज़" : "शुरू करें"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetTimer}
                  className="flex-1 flex items-center justify-center gap-1 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <RotateCcw className="h-4 w-4" />
                  रिसेट
                </Button>
                
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={completeTask}
                  disabled={isActive || (initialDuration - timeLeft) / initialDuration < 0.5}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Flag className="h-4 w-4" />
                  पूरा करें
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={resetTimer}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                नया सेशन शुरू करें
              </Button>
            )}
          </div>
          
          {studySessions > 0 && (
            <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 gap-1 animate-fade-in">
              <Award className="h-4 w-4" />
              <span>{studySessions} {studySessions === 1 ? 'सेशन' : 'सेशन'} पूरे हुए!</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {!isActive && !taskComplete && (initialDuration - timeLeft) / initialDuration > 0 && (
        <CardFooter className="pt-0 pb-4 px-6">
          <p className="text-xs text-center text-purple-600 dark:text-purple-400 w-full">
            {Math.round(((initialDuration - timeLeft) / initialDuration) * 100)}% पूरा हुआ • कम से कम 50% समय अध्ययन करें
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudyTimer;
