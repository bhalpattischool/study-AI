
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash, Pencil, Heart, VolumeIcon, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageContextMenuProps {
  children: React.ReactNode;
  isUserMessage: boolean;
  isLiked: boolean;
  isTTSEnabled: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onLike?: () => void;
  onTextToSpeech?: () => void;
  onToggleTTS?: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  children,
  isUserMessage,
  isLiked,
  isTTSEnabled,
  onCopy,
  onEdit,
  onDelete,
  onLike,
  onTextToSpeech,
  onToggleTTS,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-full h-full">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <ContextMenuItem 
          onClick={onCopy}
          className="flex items-center cursor-pointer text-sm"
        >
          <Copy size={16} className="mr-2" />
          Copy
        </ContextMenuItem>
        
        {isUserMessage && onEdit && (
          <ContextMenuItem 
            onClick={onEdit}
            className="flex items-center cursor-pointer text-sm"
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </ContextMenuItem>
        )}
        
        {!isUserMessage && (
          <>
            <ContextMenuItem 
              onClick={onLike}
              className={cn(
                "flex items-center cursor-pointer text-sm",
                isLiked && "text-pink-500"
              )}
            >
              <Heart size={16} className={cn("mr-2", isLiked && "fill-pink-500")} />
              {isLiked ? "Unlike" : "Like"}
            </ContextMenuItem>
            
            {onTextToSpeech && (
              <ContextMenuItem 
                onClick={onTextToSpeech}
                className={cn(
                  "flex items-center cursor-pointer text-sm",
                  !isTTSEnabled && "text-gray-400 cursor-not-allowed"
                )}
                disabled={!isTTSEnabled}
              >
                <VolumeIcon size={16} className="mr-2" />
                Speak
              </ContextMenuItem>
            )}
            
            {onToggleTTS && (
              <ContextMenuItem 
                onClick={onToggleTTS}
                className="flex items-center cursor-pointer text-sm"
              >
                {isTTSEnabled ? (
                  <>
                    <VolumeX size={16} className="mr-2" />
                    Disable TTS
                  </>
                ) : (
                  <>
                    <VolumeIcon size={16} className="mr-2" />
                    Enable TTS
                  </>
                )}
              </ContextMenuItem>
            )}
          </>
        )}
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={onDelete}
          className="flex items-center cursor-pointer text-sm text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
        >
          <Trash size={16} className="mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
