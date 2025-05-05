
import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardUser } from '@/lib/leaderboard';
import TopUserPodium from './top-users/TopUserPodium';

interface TopUsersDisplayProps {
  topUsers: LeaderboardUser[];
}

const TopUsersDisplay: React.FC<TopUsersDisplayProps> = ({ topUsers }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
        टॉप लर्नर्स
      </h2>
      
      <div className="relative h-48 mb-6">
        {/* Second Place */}
        {topUsers[1] && (
          <TopUserPodium 
            user={topUsers[1]} 
            position={2} 
            cssProps={{
              position: "absolute bottom-0 left-0 w-1/4",
              podium: "bg-gray-200 dark:bg-gray-700 h-20 mt-2 rounded-t-lg",
              avatar: "w-12 h-12"
            }}
          />
        )}
        
        {/* First Place */}
        {topUsers[0] && (
          <TopUserPodium 
            user={topUsers[0]} 
            position={1} 
            cssProps={{
              position: "absolute bottom-0 left-1/4 w-1/2",
              podium: "bg-yellow-100 dark:bg-yellow-900/30 h-32 mt-2 rounded-t-lg",
              avatar: "w-16 h-16 border-2 border-yellow-400"
            }}
            showTrophy={true}
          />
        )}
        
        {/* Third Place */}
        {topUsers[2] && (
          <TopUserPodium 
            user={topUsers[2]} 
            position={3} 
            cssProps={{
              position: "absolute bottom-0 right-0 w-1/4",
              podium: "bg-amber-100 dark:bg-amber-900/30 h-16 mt-2 rounded-t-lg",
              avatar: "w-12 h-12"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TopUsersDisplay;
