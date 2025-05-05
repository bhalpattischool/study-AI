
import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardUser } from '@/lib/leaderboard';
import { getUserInitials, getAvatarColor } from '../utils/avatarUtils';

interface TopUserPodiumProps {
  user: LeaderboardUser;
  position: number;
  cssProps: {
    position: string;
    podium: string;
    avatar: string;
  };
  showTrophy?: boolean;
}

const TopUserPodium: React.FC<TopUserPodiumProps> = ({ 
  user, 
  position, 
  cssProps,
  showTrophy = false
}) => {
  const userInitials = getUserInitials(user.name);
  const avatarColor = getAvatarColor(user.id);
  
  let badgeColor = "bg-gray-300";
  if (position === 1) badgeColor = "bg-yellow-500";
  if (position === 3) badgeColor = "bg-amber-600";
  
  return (
    <div className={`flex flex-col items-center ${cssProps.position}`}>
      <div className="relative">
        {showTrophy && (
          <Trophy className="h-6 w-6 text-yellow-500 absolute -top-8 left-1/2 transform -translate-x-1/2" />
        )}
        <div className={`rounded-full flex items-center justify-center ${avatarColor} ${cssProps.avatar}`}>
          {userInitials}
        </div>
        <div className={`absolute -bottom-1 -right-1 ${badgeColor} text-white rounded-full w-6 h-6 flex items-center justify-center`}>
          {position}
        </div>
      </div>
      <div className={`${cssProps.podium} w-full flex items-end justify-center`}>
        <p className="text-xs font-medium truncate max-w-full px-1 pb-1">
          {user.name}
        </p>
      </div>
    </div>
  );
};

export default TopUserPodium;
