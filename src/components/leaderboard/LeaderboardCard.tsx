
import React, { useState } from 'react';
import { Medal, Trophy, Star, Award, Flame, Clock, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LeaderboardUser, getBadgeInfo } from '@/lib/leaderboard-service';

interface LeaderboardCardProps {
  user: LeaderboardUser;
  currentUserId?: string;
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

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ user, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const isCurrentUser = currentUserId === user.id;
  const userInitials = getUserInitials(user.name);
  const avatarColor = getAvatarColor(user.id);
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500 mr-2" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400 mr-2" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600 mr-2" />;
    return <span className="font-mono text-lg font-bold min-w-[24px] text-center mr-2">{rank}</span>;
  };
  
  const getBadgeColors = (badgeId: string) => {
    const badgeInfo = getBadgeInfo(badgeId);
    const colorMap: Record<string, { bg: string, text: string, border: string }> = {
      'blue': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
      'green': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
      'purple': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
      'amber': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
      'red': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
      'teal': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
      'indigo': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
      'orange': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
      'rose': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
      'yellow': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' },
      'emerald': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
      'slate': { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' },
      'cyan': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
      'pink': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
      'sky': { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
      'violet': { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
      'lime': { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-800' },
      'fuchsia': { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200 dark:border-fuchsia-800' },
      'brown': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
      'gray': { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-800' },
    };
    
    return colorMap[badgeInfo.color] || colorMap.gray;
  };
  
  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${
        expanded ? 'mb-4' : 'mb-2'
      } ${
        isCurrentUser 
          ? 'border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20' 
          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      } rounded-lg shadow-sm hover:shadow-md`}
    >
      {isCurrentUser && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl">
          आप
        </div>
      )}
      
      <div className="flex items-center p-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center">
          {getRankIcon(user.rank)}
        </div>
        
        <Avatar className={`h-10 w-10 ${isCurrentUser ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''}`}>
          <AvatarFallback className={`${avatarColor} font-medium text-sm`}>
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 ml-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{user.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <span>लेवल {user.level}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                <Flame className="h-3 w-3 text-red-500" />
                <span className="ml-0.5">{user.streakDays} दिन</span>
              </div>
              <div className="flex items-center ml-2">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="ml-0.5">{user.studyHours} घंटे</span>
              </div>
            </div>
          </div>
        </div>
        
        <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">बैज:</p>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {user.badges.map((badgeId, index) => {
                  const badgeInfo = getBadgeInfo(badgeId);
                  const colors = getBadgeColors(badgeId);
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="outline" 
                          className={`${colors.bg} ${colors.text} ${colors.border} hover:${colors.bg.replace('bg-', 'bg-opacity-70')}`}
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {badgeInfo.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px] text-center">
                        <p className="font-medium">{badgeInfo.name}</p>
                        <p className="text-xs">{badgeInfo.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>अंतिम सक्रिय: {user.lastActive}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                प्रोफाइल देखें
              </Button>
              {!isCurrentUser && (
                <Button variant="outline" size="sm" className="h-8 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/40">
                  दोस्त बनाएँ
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardCard;
