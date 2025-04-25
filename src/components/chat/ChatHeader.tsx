
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Users, UserPlus } from 'lucide-react';

interface ChatHeaderProps {
  displayName: string;
  isGroup: boolean;
  onBack: () => void;
  onManageMembers: () => void;
  isAdmin: boolean;
  memberAvatars: React.ReactNode;
  children?: ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  displayName,
  isGroup,
  onBack,
  onManageMembers,
  isAdmin,
  memberAvatars,
  children
}) => {
  return (
    <div className="flex items-center p-3 border-b bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-gray-900">
      <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center flex-1">
        {isGroup && <Users className="h-5 w-5 mr-2 text-purple-600" />}
        <h2 className="font-semibold text-lg">{displayName}</h2>
        {memberAvatars}
      </div>
      {isGroup && isAdmin && (
        <Button
          variant="outline"
          size="sm"
          onClick={onManageMembers}
          className="ml-1 bg-white dark:bg-gray-800 border-purple-300 hover:bg-purple-100"
        >
          <UserPlus className="h-4 w-4 mr-1 text-purple-500" />
          Manage
        </Button>
      )}
      {children}
      <Button variant="ghost" size="icon">
        <Info className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
