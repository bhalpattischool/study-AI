
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, Trash, Pencil, User, VolumeIcon, Heart, Volume2, VolumeX, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  isUserMessage: boolean;
  isCopied: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  isTTSEnabled: boolean;
  handleEdit: () => void;
  handleCopy: () => void;
  handleDelete: () => void;
  handleLike: () => void;
  handleBookmark: () => void;
  handleTextToSpeech: () => void;
  toggleTTS: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  isUserMessage,
  isCopied,
  isLiked,
  isBookmarked,
  isTTSEnabled,
  handleEdit,
  handleCopy,
  handleDelete,
  handleLike,
  handleBookmark,
  handleTextToSpeech,
  toggleTTS
}) => {
  return (
    <div className={cn(
      "opacity-0 group-hover:opacity-100 transition-opacity gap-1",
      isUserMessage ? "flex justify-start flex-row-reverse" : "flex justify-start"
    )}>
      {isUserMessage && (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleEdit}
          className="h-7 px-2 text-xs text-purple-500 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 transition-colors"
        >
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleBookmark}
        className={cn(
          "h-7 px-2 text-xs transition-colors",
          isBookmarked 
            ? "text-amber-500" 
            : "text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900"
        )}
      >
        {isBookmarked ? (
          <>
            <BookmarkCheck size={14} className="mr-1 fill-amber-500" />
            Saved
          </>
        ) : (
          <>
            <Bookmark size={14} className="mr-1" />
            Save
          </>
        )}
      </Button>
      
      {!isUserMessage && (
        <>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleLike}
            className={cn(
              "h-7 px-2 text-xs transition-colors",
              isLiked 
                ? "text-pink-500" 
                : "text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900"
            )}
          >
            <Heart size={14} className={cn("mr-1", isLiked ? "fill-pink-500" : "")} />
            {isLiked ? "Liked" : "Like"}
          </Button>
          
          <div className="flex items-center gap-1 h-7 px-2 text-xs text-indigo-500 dark:text-indigo-400">
            {isTTSEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="mr-1">TTS</span>
            <Switch 
              checked={isTTSEnabled}
              onCheckedChange={toggleTTS} 
              className="scale-75 data-[state=checked]:bg-indigo-500"
            />
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleTextToSpeech}
            className={cn(
              "h-7 px-2 text-xs transition-colors",
              !isTTSEnabled 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900"
            )}
          >
            <VolumeIcon size={14} className="mr-1" />
            Speak
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-purple-500 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 transition-colors"
          >
            <Copy size={14} className={cn("mr-1", isCopied ? "text-green-500" : "")} />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </>
      )}
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleDelete}
        className="h-7 px-2 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
      >
        <Trash size={14} className="mr-1" />
        Delete
      </Button>
    </div>
  );
};

export default MessageActions;
