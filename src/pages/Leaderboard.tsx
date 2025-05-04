
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Medal, 
  Users, 
  Search, 
  ArrowUpDown, 
  Fire, 
  Clock, 
  Star, 
  Filter, 
  Calendar,
  Award,
  ChevronLeft
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LeaderboardUser, getLeaderboardData } from '@/lib/leaderboard-service';
import LeaderboardCard from '@/components/leaderboard/LeaderboardCard';
import { useAuth } from '@/contexts/AuthContext';

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'xp' | 'streakDays' | 'studyHours'>('xp');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'today'>('all');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from API with the filters applied
        // For now, we'll use our mock data and filter/sort it client-side
        const data = getLeaderboardData();
        setUsers(data);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeFilter]);
  
  // Sort the users based on the selected criteria
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'streakDays') return b.streakDays - a.streakDays;
    return b.studyHours - a.studyHours;
  });
  
  // Filter users based on search query
  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get top 3 users for the podium
  const topUsers = sortedUsers.slice(0, 3);
  
  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'today': return 'आज';
      case 'week': return 'इस सप्ताह';
      case 'month': return 'इस महीने';
      default: return 'सभी समय';
    }
  };
  
  const getSortByLabel = () => {
    switch (sortBy) {
      case 'streakDays': return 'स्ट्रीक दिन';
      case 'studyHours': return 'अध्ययन घंटे';
      default: return 'XP पॉइंट्स';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 pb-16">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            वापस जाएं
          </Button>
          
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 pb-1">
            लीडरबोर्ड
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            स्टडी AI के शीर्ष उपयोगकर्ताओं की रैंकिंग देखें और लीडरबोर्ड में अपनी जगह बनाएँ!
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="उपयोगकर्ता खोजें..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4 mr-1" />
                      {getTimeFilterLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTimeFilter('all')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      सभी समय
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter('today')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      आज
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter('week')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      इस सप्ताह
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter('month')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      इस महीने
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      {getSortByLabel()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('xp')}>
                      <Star className="h-4 w-4 mr-2" />
                      XP पॉइंट्स
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('streakDays')}>
                      <Fire className="h-4 w-4 mr-2" />
                      स्ट्रीक दिन
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('studyHours')}>
                      <Clock className="h-4 w-4 mr-2" />
                      अध्ययन घंटे
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Leaderboard Cards */}
            <div className="space-y-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <LeaderboardCard 
                    key={user.id} 
                    user={user} 
                    currentUserId={currentUser?.uid} 
                  />
                ))
              ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  <h3 className="mt-4 text-gray-500 dark:text-gray-400">कोई उपयोगकर्ता नहीं मिला</h3>
                </div>
              )}
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* Top 3 Podium */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                टॉप लर्नर्स
              </h2>
              
              <div className="relative h-48 mb-6">
                {/* Second Place */}
                {topUsers[1] && (
                  <div className="absolute bottom-0 left-0 w-1/4 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
                        <img 
                          src={topUsers[1].avatar || `https://i.pravatar.cc/150?img=${topUsers[1].id}`} 
                          alt={topUsers[1].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        2
                      </div>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-20 w-full mt-2 rounded-t-lg flex items-end justify-center">
                      <p className="text-xs font-medium truncate max-w-full px-1 pb-1">
                        {topUsers[1].name}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* First Place */}
                {topUsers[0] && (
                  <div className="absolute bottom-0 left-1/4 w-1/2 flex flex-col items-center">
                    <div className="relative">
                      <Trophy className="h-6 w-6 text-yellow-500 absolute -top-8 left-1/2 transform -translate-x-1/2" />
                      <div className="w-16 h-16 rounded-full border-2 border-yellow-400 overflow-hidden">
                        <img 
                          src={topUsers[0].avatar || `https://i.pravatar.cc/150?img=${topUsers[0].id}`} 
                          alt={topUsers[0].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        1
                      </div>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 h-32 w-full mt-2 rounded-t-lg flex items-end justify-center">
                      <p className="text-xs font-medium truncate max-w-full px-1 pb-1">
                        {topUsers[0].name}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Third Place */}
                {topUsers[2] && (
                  <div className="absolute bottom-0 right-0 w-1/4 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-600 overflow-hidden">
                        <img 
                          src={topUsers[2].avatar || `https://i.pravatar.cc/150?img=${topUsers[2].id}`}
                          alt={topUsers[2].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        3
                      </div>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900/30 h-16 w-full mt-2 rounded-t-lg flex items-end justify-center">
                      <p className="text-xs font-medium truncate max-w-full px-1 pb-1">
                        {topUsers[2].name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Your Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Award className="h-5 w-5 text-purple-500 mr-2" />
                आपकी स्थिति
              </h2>
              
              {currentUser ? (
                <div className="space-y-3">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">वर्तमान रैंक</p>
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-2xl font-bold">7</span>
                      <span className="text-green-500 text-xs ml-2">+2 ↑</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">XP</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-bold">9750</span>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">स्ट्रीक</p>
                      <div className="flex items-center">
                        <Fire className="h-3 w-3 text-red-500 mr-1" />
                        <span className="font-bold">15</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">घंटे</p>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="font-bold">148</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">अगला रैंक तक</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>820 XP प्राप्त किए</span>
                      <span>1250 XP की आवश्यकता</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-3">
                    अपनी रैंकिंग देखने के लिए लॉगिन करें
                  </p>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    लॉगिन करें
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h3 className="font-medium text-purple-800 dark:text-purple-300 flex items-center mb-2">
                <Users className="h-4 w-4 mr-2" />
                रैंकिंग कैसे काम करती है?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                स्टडी AI पर अध्ययन करके, क्विज हल करके, और लगातार अध्ययन स्ट्रीक बनाए रखकर XP अर्जित करें। जितने अधिक XP, उतनी उच्च रैंकिंग!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
