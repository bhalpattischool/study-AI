
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials, getAvatarColor } from './utils/avatarUtils';

interface UserAvatarProps {
  userId: string;
  userName: string;
  isCurrentUser: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, userName, isCurrentUser }) => {
  const userInitials = getUserInitials(userName);
  const avatarColor = getAvatarColor(userId);

  return (
    <Avatar className={`h-10 w-10 ${isCurrentUser ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''}`}>
      <AvatarFallback className={`${avatarColor} font-medium text-sm`}>
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
