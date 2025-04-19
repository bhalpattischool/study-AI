import React, { useState, useEffect } from 'react';
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Medal, Star, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { observeLeaderboardData } from '@/lib/firebase';

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
      // Subscribe to real-time leaderboard updates
      const unsubscribe = observeLeaderboardData((leaderboardData) => {
        // Mark current user
        const studentsWithCurrentUser = leaderboardData.map(student => ({
          ...student,
          isCurrentUser: student.id === currentUser.uid
        }));
        
        setStudents(studentsWithCurrentUser);
        
        // Find current user rank
        const currentUserRecord = studentsWithCurrentUser.find(s => s.isCurrentUser);
        if (currentUserRecord) {
          setCurrentUserRank(currentUserRecord.rank);
          
          // Check if user is in top 10 for bonus
          if (currentUserRecord.rank <= 10 && leaderboardData.length > 5) {
            // Check if bonus was already given
            const bonusKey = `${currentUser.uid}_top10_bonus`;
            if (!localStorage.getItem(bonusKey)) {
              // Mark bonus as given to avoid duplicates
              localStorage.setItem(bonusKey, 'true');
              
              // Add 20 points bonus through the regular flow
              import('@/utils/points').then(({ addPointsToUser }) => {
                addPointsToUser(
                  currentUser.uid,
                  20,
                  'achievement',
                  'टॉप 10 लीडरबोर्ड बोनस'
                );
                toast.success('आप टॉप 10 में हैं! +20 पॉइंट्स मिले');
              });
            }
          }
        }
        
        setLoading(false);
      });
      
      // Cleanup subscription
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [currentUser]);
  
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
        ) : students.length > 0 ? (
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
        ) : (
          <div className="text-center py-8 border rounded-md">
            <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">अभी कोई छात्र रजिस्टर नहीं हुआ है</p>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default StudentLeaderboard;
