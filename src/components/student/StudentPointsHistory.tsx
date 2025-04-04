
import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, CheckSquare, Target, Calendar, Star, Trophy, LogIn } from 'lucide-react';
import { getUserPointsHistory } from '@/lib/firebase';

interface PointsHistoryItem {
  id: number;
  type: 'goal' | 'task' | 'activity' | 'login' | 'streak' | 'achievement' | 'quiz';
  points: number;
  description: string;
  timestamp: string;
}

interface StudentPointsHistoryProps {
  currentUser: any;
}

const StudentPointsHistory: React.FC<StudentPointsHistoryProps> = ({ currentUser }) => {
  const [historyItems, setHistoryItems] = useState<PointsHistoryItem[]>([]);
  const [groupedByDate, setGroupedByDate] = useState<Record<string, PointsHistoryItem[]>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      const loadHistory = async () => {
        setLoading(true);
        try {
          // Try to get history from Firebase
          const firebaseHistory = await getUserPointsHistory(currentUser.uid);
          
          if (firebaseHistory && firebaseHistory.length > 0) {
            // Sort by timestamp (newest first)
            const sortedHistory = [...firebaseHistory].sort((a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setHistoryItems(sortedHistory);
          } else {
            // Fallback to localStorage
            const savedHistory = localStorage.getItem(`${currentUser.uid}_points_history`);
            if (savedHistory) {
              const history = JSON.parse(savedHistory);
              
              // Sort by timestamp (newest first)
              const sortedHistory = [...history].sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              );
              
              setHistoryItems(sortedHistory);
            } else {
              // Create initial history with login bonus if no history exists
              const initialHistory: PointsHistoryItem[] = [{
                id: Date.now(),
                type: 'login',
                points: 5,
                description: 'पहला लॉगिन बोनस',
                timestamp: new Date().toISOString()
              }];
              
              localStorage.setItem(`${currentUser.uid}_points_history`, JSON.stringify(initialHistory));
              setHistoryItems(initialHistory);
              
              // Add initial points
              const currentPoints = parseInt(localStorage.getItem(`${currentUser.uid}_points`) || '0');
              localStorage.setItem(`${currentUser.uid}_points`, (currentPoints + 5).toString());
            }
          }
        } catch (error) {
          console.error("Error loading points history:", error);
          
          // Fallback to localStorage if Firebase fails
          const savedHistory = localStorage.getItem(`${currentUser.uid}_points_history`);
          if (savedHistory) {
            const history = JSON.parse(savedHistory);
            
            // Sort by timestamp (newest first)
            const sortedHistory = [...history].sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            setHistoryItems(sortedHistory);
          }
        } finally {
          setLoading(false);
        }
      };
      
      loadHistory();
    }
  }, [currentUser]);
  
  // Group history items by date
  useEffect(() => {
    const grouped = historyItems.reduce<Record<string, PointsHistoryItem[]>>((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString('hi-IN');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
    
    setGroupedByDate(grouped);
  }, [historyItems]);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'goal': return <Target className="h-4 w-4 text-indigo-500" />;
      case 'task': return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'activity': return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'streak': return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'quiz': return <Star className="h-4 w-4 text-blue-500" />;
      case 'login': 
      default: return <LogIn className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <CardContent className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            पॉइंट्स इतिहास
          </h3>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            {historyItems.length} गतिविधियां
          </Badge>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedByDate).length > 0 ? (
              Object.entries(groupedByDate).map(([date, items]) => (
                <div key={date} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {date}
                  </h4>
                  
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md"
                      >
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleTimeString('hi-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          +{item.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Award className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>कोई पॉइंट्स इतिहास नहीं मिला</p>
              </div>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default StudentPointsHistory;
