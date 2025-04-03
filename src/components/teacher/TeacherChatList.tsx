
import React from 'react';
import { Chat } from '@/lib/db';
import { School, Calendar, Eye, Edit, Trash2, MoreHorizontal, Check } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TeacherChatListProps {
  chats: Chat[];
  isDataLoading: boolean;
  editingChatId: string | null;
  editingChatTitle: string;
  onChatClick: (chatId: string) => void;
  onEditChat: (chatId: string, e?: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e?: React.MouseEvent) => void;
  onEditingTitleChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  formatDate: (timestamp: number) => string;
  formatTime: (timestamp: number) => string;
  isBatchDeleteMode?: boolean;
  selectedChats?: Set<string>;
  onToggleSelection?: (chatId: string, e?: React.MouseEvent) => void;
}

const TeacherChatList: React.FC<TeacherChatListProps> = ({
  chats,
  isDataLoading,
  editingChatId,
  editingChatTitle,
  onChatClick,
  onEditChat,
  onDeleteChat,
  onEditingTitleChange,
  onSaveEdit,
  onCancelEdit,
  formatDate,
  formatTime,
  isBatchDeleteMode = false,
  selectedChats = new Set(),
  onToggleSelection = () => {},
}) => {
  if (isDataLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <EmptyChatList />
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="grid gap-4">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            editingChatId={editingChatId}
            editingChatTitle={editingChatTitle}
            onChatClick={onChatClick}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
            onEditingTitleChange={onEditingTitleChange}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            formatDate={formatDate}
            formatTime={formatTime}
            isBatchDeleteMode={isBatchDeleteMode}
            isSelected={selectedChats.has(chat.id)}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

interface ChatListItemProps {
  chat: Chat;
  editingChatId: string | null;
  editingChatTitle: string;
  onChatClick: (chatId: string) => void;
  onEditChat: (chatId: string, e?: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e?: React.MouseEvent) => void;
  onEditingTitleChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  formatDate: (timestamp: number) => string;
  formatTime: (timestamp: number) => string;
  isBatchDeleteMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (chatId: string, e?: React.MouseEvent) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  editingChatId,
  editingChatTitle,
  onChatClick,
  onEditChat,
  onDeleteChat,
  onEditingTitleChange,
  onSaveEdit,
  onCancelEdit,
  formatDate,
  formatTime,
  isBatchDeleteMode = false,
  isSelected = false,
  onToggleSelection = () => {},
}) => {
  const handleChatItemClick = () => {
    onChatClick(chat.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={cn(
            "relative cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
            editingChatId === chat.id && "border-green-500 dark:border-green-500",
            isSelected && "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
          )}
          onClick={handleChatItemClick}
        >
          <div className="p-4">
            {editingChatId === chat.id ? (
              <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editingChatTitle}
                  onChange={(e) => onEditingTitleChange(e.target.value)}
                  placeholder="Enter chat title"
                  className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={onSaveEdit}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {isBatchDeleteMode ? (
                      <div 
                        className="flex items-center mr-2" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelection(chat.id, e);
                        }}
                      >
                        <Checkbox 
                          checked={isSelected}
                          className="mr-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          aria-label={`Select ${chat.title}`}
                        />
                      </div>
                    ) : (
                      <School className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {chat.title}
                    </h3>
                  </div>
                  
                  {/* Don't show action buttons in batch delete mode */}
                  {!isBatchDeleteMode && (
                    <>
                      {/* Desktop: Show all buttons */}
                      <div className="hidden sm:flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={(e) => onChatClick(chat.id)}
                          title="View chat"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={(e) => onEditChat(chat.id, e)}
                          title="Edit chat"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => onDeleteChat(chat.id, e)}
                          title="Delete chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Mobile: Show dropdown menu */}
                      <div className="block sm:hidden">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start rounded-none text-left pl-2 pr-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onChatClick(chat.id);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start rounded-none text-left pl-2 pr-6"
                                onClick={(e) => onEditChat(chat.id, e)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start rounded-none text-left pl-2 pr-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => onDeleteChat(chat.id, e)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(chat.timestamp)} at {formatTime(chat.timestamp)}</span>
                  <span className="mx-2">•</span>
                  <span>{chat.messages.length} messages</span>
                </div>
                
                {chat.messages.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {chat.messages[chat.messages.length - 1].content}
                  </div>
                )}
              </>
            )}
          </div>
          {/* Touch-friendly action hint for mobile */}
          {!isBatchDeleteMode && (
            <div className="text-xs text-center py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 sm:hidden">
              Press and hold for options
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem
          className="flex items-center text-sm cursor-pointer"
          onClick={() => onChatClick(chat.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </ContextMenuItem>
        <ContextMenuItem
          className="flex items-center text-sm cursor-pointer"
          onClick={(e) => onEditChat(chat.id)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          className="flex items-center text-sm cursor-pointer text-red-500"
          onClick={() => onDeleteChat(chat.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const EmptyChatList = () => (
  <div className="text-center py-12">
    <School className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
      No teacher conversations found
    </h3>
    <p className="text-gray-400 dark:text-gray-500 mt-2">
      Start a conversation with a teacher to see it here
    </p>
    <Button
      variant="outline"
      className="mt-4"
      onClick={() => window.location.href = '/'}
    >
      Start a Teacher Chat
    </Button>
  </div>
);

export default TeacherChatList;
