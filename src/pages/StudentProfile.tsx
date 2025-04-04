
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Star, 
  Award, 
  Share2, 
  ArrowLeft, 
  Calendar, 
  Trophy, 
  Puzzle, 
  BookOpen,
  LinkIcon
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { getDatabase, ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

interface ProfileData {
  id: string;
  name: string;
  level: number;
  points: number;
  joinedOn: string;
  photoURL?: string;
  category?: string;
  education?: string;
}

interface Achievement {
  id: number;
  type: string;
  points: number;
  description: string;
  timestamp: string;
}

const StudentProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [levelProgress, setLevelProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (userId) {
      loadProfileData(userId);
    }
  }, [userId]);
  
  const loadProfileData = async (id: string) => {
    setLoading(true);
    
    try {
      // Try to get profile data from Firebase
      const userRef = ref(database, `users/${id}`);
      const userSnapshot = await get(userRef);
      
      // Get points history
      const historyRef = ref(database, `users/${id}/pointsHistory`);
      const historySnapshot = await get(historyRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        
        // Sort achievements from points history
        let topAchievements: Achievement[] = [];
        
        if (historySnapshot.exists()) {
          const history = Object.values(historySnapshot.val()) as Achievement[];
          
          // Sort achievements by points (highest first)
          topAchievements = history
            .filter((item: any) => ['achievement', 'quiz'].includes(item.type))
            .sort((a: any, b: any) => b.points - a.points)
            .slice(0, 5); // Get top 5
        }
        
        // Create profile data object
        const profileInfo: ProfileData = {
          id,
          name: userData.displayName || `छात्र_${id.substring(0, 5)}`,
          level: userData.level || 1,
          points: userData.points || 0,
          category: userData.userCategory || 'student',
          education: userData.educationLevel || 'high-school',
          joinedOn: userData.createdAt || new Date().toISOString(),
          photoURL: userData.photoURL
        };
        
        // Calculate level progress
        const pointsForNextLevel = profileInfo.level * 100;
        const pointsSinceLastLevel = profileInfo.points - ((profileInfo.level - 1) * 100);
        const progress = Math.min(Math.floor((pointsSinceLastLevel / pointsForNextLevel) * 100), 100);
        
        setProfileData(profileInfo);
        setAchievements(topAchievements);
        setLevelProgress(progress);
      } else {
        // Fallback to localStorage for backward compatibility
        fallbackToLocalStorage(id);
      }
    } catch (error) {
      console.error('Error loading profile from Firebase:', error);
      // Fallback to localStorage
      fallbackToLocalStorage(id);
    } finally {
      setLoading(false);
    }
  };
  
  const fallbackToLocalStorage = (id: string) => {
    try {
      const points = localStorage.getItem(`${id}_points`);
      const level = localStorage.getItem(`${id}_level`);
      const userCategory = localStorage.getItem('userCategory');
      const educationLevel = localStorage.getItem('educationLevel');
      const history = JSON.parse(localStorage.getItem(`${id}_points_history`) || '[]');
      
      // Sort achievements by points (highest first)
      const topAchievements = history
        .filter((item: any) => ['achievement', 'quiz'].includes(item.type))
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 5); // Get top 5
      
      if (points && level) {
        const profileInfo: ProfileData = {
          id,
          name: `छात्र_${id.substring(0, 5)}`, // Default name if we can't get actual name
          level: parseInt(level),
          points: parseInt(points),
          category: userCategory || 'student',
          education: educationLevel || 'high-school',
          joinedOn: new Date().toISOString()
        };
        
        // Calculate level progress
        const pointsForNextLevel = profileInfo.level * 100;
        const pointsSinceLastLevel = profileInfo.points - ((profileInfo.level - 1) * 100);
        const progress = Math.min(Math.floor((pointsSinceLastLevel / pointsForNextLevel) * 100), 100);
        
        setProfileData(profileInfo);
        setAchievements(topAchievements);
        setLevelProgress(progress);
      }
    } catch (error) {
      console.error('Error fallback to localStorage:', error);
    }
  };
  
  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profileData?.name || 'Student'} का अध्ययन प्रोफाइल`,
          text: `देखें ${profileData?.name || 'Student'} का अध्ययन प्रोफाइल! वर्तमान स्तर: ${profileData?.level}, अर्जित अंक: ${profileData?.points}`,
          url: window.location.href,
        });
        toast.success('प्रोफाइल शेयर किया गया');
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('प्रोफाइल लिंक कॉपी किया गया');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('शेयर करने में त्रुटि');
    }
  };
  
  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('प्रोफाइल लिंक कॉपी किया गया');
  };
  
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'quiz': return <Puzzle className="h-4 w-4 text-blue-500" />;
      default: return <Star className="h-4 w-4 text-purple-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">प्रोफाइल नहीं मिला</h2>
            <p className="text-gray-500 mb-4">
              यह प्रोफाइल मौजूद नहीं है या फिर हटा दिया गया है।
            </p>
            <Button onClick={() => navigate('/')}>
              होम पेज पर जाएं
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">छात्र प्रोफाइल</h1>
        </div>
        
        <Card className="mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-24"></div>
          <CardContent className="pt-0 relative">
            <div className="flex flex-col items-center -mt-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                {profileData.photoURL ? (
                  <img 
                    src={profileData.photoURL} 
                    alt={profileData.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-700">
                    {profileData.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold mt-4">{profileData.name}</h2>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {profileData.points} पॉइंट्स
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Level {profileData.level}
                </Badge>
              </div>
              
              <div className="w-full mt-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">अगले लेवल तक</span>
                  <span className="text-sm font-medium">{levelProgress}%</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 w-full gap-2 mt-6">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={copyProfileLink}
                >
                  <LinkIcon className="h-4 w-4" />
                  लिंक कॉपी करें
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={shareProfile}
                >
                  <Share2 className="h-4 w-4" />
                  शेयर करें
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              प्रमुख उपलब्धियां
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-2">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md"
                  >
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.timestamp).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      +{achievement.points}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>कोई उपलब्धि नहीं मिली</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              प्रोफाइल विवरण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">श्रेणी</TableCell>
                  <TableCell>{profileData.category === 'student' ? 'छात्र' : profileData.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">शिक्षा स्तर</TableCell>
                  <TableCell>
                    {profileData.education === 'high-school' ? 'हाई स्कूल' : 
                     profileData.education === 'intermediate' ? 'इंटरमीडिएट' : 
                     profileData.education === 'undergraduate' ? 'अंडरग्रेजुएट' : 
                     profileData.education === 'graduate' ? 'ग्रेजुएट' : 
                     profileData.education}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">शामिल हुए</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(profileData.joinedOn).toLocaleDateString('hi-IN')}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
