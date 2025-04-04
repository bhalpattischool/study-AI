
import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Medal, Star, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
  photoURL?: string;
  isCurrentUser?: boolean;
}

interface StudentLeaderboardProps {
  currentUser: any;
}

const StudentLeaderboard: React.FC<StudentLeaderboardProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    if (currentUser) {
      loadLeaderboardData();
    }
  }, [currentUser]);
  
  const loadLeaderboardData = () => {
    setLoading(true);
    
    // In a real app, this would be a database query
    // For now, we'll simulate loading data from localStorage
    
    // Get all keys from localStorage that contain "_points"
    const allKeys = Object.keys(localStorage);
    const userPointsKeys = allKeys.filter(key => key.includes('_points'));
    
    // Collect student data
    const studentsData: Student[] = [];
    
    userPointsKeys.forEach(key => {
      const userId = key.split('_')[0];
      const points = parseInt(localStorage.getItem(key) || '0');
      const level = parseInt(localStorage.getItem(`${userId}_level`) || '1');
      
      // Try to get the user's name from other localStorage entries if available
      // In a real app, this would come from the database
      let name = 'Student_' + userId.substring(0, 5);
      
      // Flag if this is the current user
      const isCurrentUser = userId === currentUser.uid;
      
      if (isCurrentUser && currentUser.displayName) {
        name = currentUser.displayName;
      }
      
      studentsData.push({
        id: userId,
        name,
        points,
        level,
        rank: 0, // Will be calculated after sorting
        photoURL: isCurrentUser ? currentUser.photoURL : undefined,
        isCurrentUser
      });
    });
    
    // Add some dummy data if we have fewer than 10 students (for demonstration)
    if (studentsData.length < 10) {
      const existingIds = new Set(studentsData.map(s => s.id));
      
      for (let i = studentsData.length; i < 10; i++) {
        const dummyId = `dummy_${i}`;
        if (!existingIds.has(dummyId)) {
          studentsData.push({
            id: dummyId,
            name: `छात्र_${i + 1}`,
            points: Math.floor(Math.random() * 1000),
            level: Math.floor(Math.random() * 10) + 1,
            rank: 0,
          });
        }
      }
    }
    
    // Sort by points (descending)
    studentsData.sort((a, b) => b.points - a.points);
    
    // Assign ranks
    studentsData.forEach((student, index) => {
      student.rank = index + 1;
      if (student.isCurrentUser) {
        setCurrentUserRank(index + 1);
      }
    });
    
    setStudents(studentsData);
    setLoading(false);
    
    // If user is in top 10, give them a bonus
    const currentUserRecord = studentsData.find(s => s.isCurrentUser);
    if (currentUserRecord && currentUserRecord.rank <= 10) {
      // Check if bonus was already given
      const bonusKey = `${currentUser.uid}_top10_bonus`;
      if (!localStorage.getItem(bonusKey)) {
        // Add 20 points bonus
        const currentPoints = parseInt(localStorage.getItem(`${currentUser.uid}_points`) || '0');
        localStorage.setItem(`${currentUser.uid}_points`, (currentPoints + 20).toString());
        
        // Log this bonus in history
        const pointsHistory = JSON.parse(localStorage.getItem(`${currentUser.uid}_points_history`) || '[]');
        pointsHistory.push({
          id: Date.now(),
          type: 'achievement',
          points: 20,
          description: 'टॉप 10 लीडरबोर्ड बोनस',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(`${currentUser.uid}_points_history`, JSON.stringify(pointsHistory));
        
        // Mark bonus as given
        localStorage.setItem(bonusKey, 'true');
        
        toast.success('आप टॉप 10 में हैं! +20 पॉइंट्स मिले');
      }
    }
  };
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-medium">{rank}</span>;
  };
  
  const shareLeaderboard = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'अध्ययन लीडरबोर्ड',
          text: 'देखें कौन है सबसे आगे!',
          url: window.location.href,
        });
        toast.success('लीडरबोर्ड शेयर किया गया');
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('लिंक कॉपी किया गया');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('शेयर करने में त्रुटि');
    }
  };
  
  return (
    <CardContent className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            लीडरबोर्ड
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareLeaderboard}
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            शेयर
          </Button>
        </div>
        
        {currentUserRank && (
          <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium">
              आपका रैंक: <Badge className="ml-2">{currentUserRank}</Badge>
            </p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">रैंक</TableHead>
                  <TableHead>छात्र</TableHead>
                  <TableHead className="text-right">पॉइंट्स</TableHead>
                  <TableHead className="text-right w-20">लेवल</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow 
                    key={student.id}
                    className={student.isCurrentUser ? "bg-purple-50 dark:bg-purple-900/20" : ""}
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {getRankIcon(student.rank)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center mr-2 text-xs">
                          {student.photoURL ? (
                            <img 
                              src={student.photoURL} 
                              alt={student.name} 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          ) : (
                            student.name.charAt(0)
                          )}
                        </div>
                        <span className={student.isCurrentUser ? "font-bold" : ""}>
                          {student.name}
                          {student.isCurrentUser && <span className="text-xs ml-1">(आप)</span>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                        {student.points}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {student.level}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default StudentLeaderboard;
