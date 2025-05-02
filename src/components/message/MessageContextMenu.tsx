
import React, { ReactNode } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Pencil, Trash, Heart, Bookmark } from 'lucide-react';

interface MessageContextMenuProps {
  children: ReactNode;
  isUserMessage: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onLike?: () => void;
  onBookmark: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  children,
  isUserMessage,
  isLiked,
  isBookmarked,
  onCopy,
  onEdit,
  onDelete,
  onLike,
  onBookmark,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        
        {isUserMessage && onEdit && (
          <ContextMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        
        {!isUserMessage && onLike && (
          <ContextMenuItem onClick={onLike}>
            <Heart 
              className={`mr-2 h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : ""}`}
              fill={isLiked ? "currentColor" : "none"}
            />
            {isLiked ? "Unlike" : "Like"}
          </ContextMenuItem>
        )}
        
        <ContextMenuItem onClick={onBookmark}>
          <Bookmark
            className={`mr-2 h-4 w-4 ${isBookmarked ? "text-amber-500 fill-amber-500" : ""}`}
            fill={isBookmarked ? "currentColor" : "none"}
          />
          {isBookmarked ? "Unbookmark" : "Bookmark"}
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
