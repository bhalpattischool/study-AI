
import React from 'react';
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import MessageEditor from './MessageEditor';
import MessageMarkdownContent from './MessageMarkdownContent';

interface MessageBodyProps {
  isUserMessage: boolean;
  isEditing: boolean;
  editedContent: string;
  setEditedContent: (content: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  isTyping: boolean;
  displayedContent: string;
}

const MessageBody: React.FC<MessageBodyProps> = ({
  isUserMessage,
  isEditing,
  editedContent,
  setEditedContent,
  handleSaveEdit,
  handleCancelEdit,
  isTyping,
  displayedContent
}) => {
  return (
    <div className={cn(
      "max-w-3xl mx-auto px-4 md:px-8 flex gap-4",
      isUserMessage ? "flex-row-reverse" : "flex-row"
    )}>
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-transform hover:scale-110 shadow-md",
          isUserMessage 
            ? "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200" 
            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
        )}
      >
        {isUserMessage ? <User size={16} /> : "AI"}
      </div>
      
      <div className={cn(
        "flex-1 min-w-0",
        isUserMessage 
          ? "bg-purple-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-tr-none shadow-sm"
          : "bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-purple-100 dark:border-gray-700"
      )}>
        {isEditing ? (
          <MessageEditor 
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
          />
        ) : (
          <MessageMarkdownContent 
            content={displayedContent}
            isTyping={isTyping}
            isBot={!isUserMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBody;
