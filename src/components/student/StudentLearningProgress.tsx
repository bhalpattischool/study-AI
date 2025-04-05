import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, BarChart, Clock, Award, Trophy } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface StudentLearningProgressProps {
  currentUser: any;
}

const StudentLearningProgress: React.FC<StudentLearningProgressProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [subjectProgress, setSubjectProgress] = useState<{ name: string; progress: number; color: string }[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; points: number }[]>([]);
  const [achievements, setAchievements] = useState<number>(0);
  
  const subjectColors = [
    '#8b5cf6', // Purple
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f97316', // Orange
    '#0ea5e9', // Light blue
  ];
  
  useEffect(() => {
    if (currentUser) {
      const loadProgressData = async () => {
        setLoading(true);
        try {
          const savedProgress = localStorage.getItem(`${currentUser.uid}_subject_progress`);
          
          let subjectProgressData;
          if (savedProgress) {
            subjectProgressData = JSON.parse(savedProgress);
          } else {
            subjectProgressData = [
              { name: 'गणित', progress: 45, color: subjectColors[0] },
              { name: 'विज्ञान', progress: 70, color: subjectColors[1] },
              { name: 'हिंदी', progress: 85, color: subjectColors[2] },
              { name: 'अंग्रेजी', progress: 30, color: subjectColors[3] },
              { name: 'सामाजिक विज्ञान', progress: 60, color: subjectColors[4] }
            ];
            
            localStorage.setItem(
              `${currentUser.uid}_subject_progress`, 
              JSON.stringify(subjectProgressData)
            );
          }
          
          setSubjectProgress(subjectProgressData);
          
          const savedActivity = localStorage.getItem(`${currentUser.uid}_weekly_activity`);
          
          let weeklyActivityData;
          if (savedActivity) {
            weeklyActivityData = JSON.parse(savedActivity);
          } else {
            weeklyActivityData = [
              { day: 'सोम', points: 25 },
              { day: 'मंगल', points: 40 },
              { day: 'बुध', points: 30 },
              { day: 'गुरु', points: 60 },
              { day: 'शुक्र', points: 45 },
              { day: 'शनि', points: 15 },
              { day: 'रवि', points: 35 }
            ];
            
            localStorage.setItem(
              `${currentUser.uid}_weekly_activity`, 
              JSON.stringify(weeklyActivityData)
            );
          }
          
          setWeeklyActivity(weeklyActivityData);
          
          const pointsHistory = JSON.parse(
            localStorage.getItem(`${currentUser.uid}_points_history`) || '[]'
          );
          
          const achievementCount = pointsHistory.filter(
            (item: any) => item.type === 'achievement'
          ).length;
          
          setAchievements(achievementCount);
        } catch (error) {
          console.error('Error loading progress data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadProgressData();
    }
  }, [currentUser]);
  
  const calculateOverallProgress = () => {
    if (subjectProgress.length === 0) return 0;
    const totalProgress = subjectProgress.reduce((sum, subject) => sum + subject.progress, 0);
    return Math.round(totalProgress / subjectProgress.length);
  };
  
  const pieData = subjectProgress.map(subject => ({
    name: subject.name,
    value: subject.progress,
    color: subject.color
  }));

  return (
    <CardContent className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-600" />
            लर्निंग प्रगति
          </h3>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            {calculateOverallProgress()}% पूर्ण
          </Badge>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 text-purple-800 dark:text-purple-300 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  विषय प्रगति
                </h4>
                
                <div className="aspect-square">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  साप्ताहिक गतिविधि
                </h4>
                
                <div className="aspect-square">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyActivity}>
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => `${value} पॉइंट्स`} />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        dot={{ fill: '#8b5cf6' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  उपलब्धियां
                </h4>
                <span className="text-sm">{achievements}</span>
              </div>
              
              <div className="space-y-4">
                {subjectProgress.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{subject.name}</span>
                      <span className="text-xs">{subject.progress}%</span>
                    </div>
                    <Progress 
                      value={subject.progress} 
                      className={`h-2 bg-${subject.color.replace('#', '')}/20`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </CardContent>
  );
};

export default StudentLearningProgress;
