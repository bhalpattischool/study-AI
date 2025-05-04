
import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardUser } from '@/lib/leaderboard';

interface TopUsersDisplayProps {
  topUsers: LeaderboardUser[];
}

// Function to get user initials
const getUserInitials = (name: string): string => {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Function to generate a deterministic color based on user id
const getAvatarColor = (userId: string): string => {
  const colors = [
    "bg-purple-500 text-white", // Primary purple
    "bg-indigo-500 text-white", // Indigo
    "bg-blue-500 text-white",   // Blue
    "bg-green-500 text-white",  // Green
    "bg-yellow-500 text-white", // Yellow
    "bg-orange-500 text-white", // Orange
    "bg-red-500 text-white",    // Red
    "bg-pink-500 text-white",   // Pink
    "bg-violet-500 text-white", // Violet
    "bg-emerald-500 text-white", // Emerald
    "bg-teal-500 text-white",   // Teal
    "bg-cyan-500 text-white",   // Cyan
  ];
  
  // Use the sum of character codes to pick a color
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }
  
  return colors[sum % colors.length];
};

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
          <div className="absolute bottom-0 left-0 w-1/4 flex flex-col items-center">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(topUsers[1].id)}`}>
                {getUserInitials(topUsers[1].name)}
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
              <div className={`w-16 h-16 rounded-full border-2 border-yellow-400 flex items-center justify-center ${getAvatarColor(topUsers[0].id)}`}>
                {getUserInitials(topUsers[0].name)}
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
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(topUsers[2].id)}`}>
                {getUserInitials(topUsers[2].name)}
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
  );
};

export default TopUsersDisplay;
