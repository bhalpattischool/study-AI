
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyStreakDisplayProps {
  streakDays: number;
  nextMilestone?: number;
  className?: string;
}

const DailyStreakDisplay: React.FC<DailyStreakDisplayProps> = ({ 
  streakDays, 
  nextMilestone = 7,
  className 
}) => {
  const { t } = useLanguage();
  
  // Calculate next milestone (next multiple of 7, or next multiple of 3 if less than 7)
  const calculateNextMilestone = () => {
    if (streakDays < 3) return 3;
    if (streakDays < 7) return 7;
    return Math.ceil(streakDays / 7) * 7;
  };

  const actualNextMilestone = nextMilestone || calculateNextMilestone();
  const progress = Math.min(100, (streakDays / actualNextMilestone) * 100);
  
  // Determine flame color based on streak length
  const getFlameColor = () => {
    if (streakDays >= 30) return "text-red-500";
    if (streakDays >= 14) return "text-orange-500";
    if (streakDays >= 7) return "text-yellow-500";
    return "text-amber-400";
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2 px-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Flame className={`h-5 w-5 ${getFlameColor()}`} />
          {t('dailyStreak')}
        </h3>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1">
              <Flame className={`h-4 w-4 mr-1 ${getFlameColor()}`} />
              {streakDays} {t('dayStreak')}
            </Badge>
          </div>
          
          {streakDays >= 7 && (
            <Badge className="bg-yellow-500">
              <Award className="h-3 w-3 mr-1" />
              {Math.floor(streakDays / 7)} {t('streakBonus')}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span>{streakDays} {t('dayStreak')}</span>
            <span>{actualNextMilestone} {t('dayStreak')}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-purple-500" />
          {t('loginTomorrow')}
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyStreakDisplay;
