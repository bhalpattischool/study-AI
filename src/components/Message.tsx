
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { chatDB, Message as MessageType } from "@/lib/db";
import MessageBody from './message/MessageBody';
import MessageActions from './message/MessageActions';
import MessageContextMenu from './message/MessageContextMenu';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { toggleMessageBookmark } from '@/lib/chat/message-operations';

interface MessageProps {
  message: MessageType;
  onEdited: () => void;
  onDeleted: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onEdited, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(!!message.bookmarked);
  const { isTTSEnabled, toggleTTS, handleTextToSpeech } = useTextToSpeech();

  useEffect(() => {
    if (message.role === 'bot' && !isEditing) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let i = 0;
      const typingSpeed = 15; // ms per character
      
      const typingInterval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedContent(prev => prev + message.content.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.role, isEditing]);

  // Update local state when message bookmarked status changes
  useEffect(() => {
    setIsBookmarked(!!message.bookmarked);
  }, [message.bookmarked]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    try {
      await chatDB.deleteMessage(message.chatId, message.id);
      onDeleted();
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editedContent.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await chatDB.editMessage(message.chatId, message.id, editedContent);
      setIsEditing(false);
      onEdited();
      toast.success("Message updated");
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Response marked as helpful");
    }
  };

  const handleBookmark = async () => {
    try {
      // Remove the db argument since it's no longer needed
      const newBookmarkStatus = await toggleMessageBookmark(message.chatId, message.id);
      setIsBookmarked(newBookmarkStatus);
      
      toast.success(newBookmarkStatus 
        ? "Message saved to bookmarks" 
        : "Message removed from bookmarks"
      );
      
      // Refresh message data
      onEdited();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark status");
    }
  };

  const isUserMessage = message.role === "user";

  return (
    <div 
      className={cn(
        "py-4 sm:py-6 group transition-colors duration-300 w-full max-w-full overflow-hidden",
        isUserMessage 
          ? "bg-white dark:bg-gray-800" 
          : "bg-purple-50 dark:bg-gray-900",
        isBookmarked && "border-l-4 border-amber-400"
      )}
    >
      {!isEditing ? (
        <MessageContextMenu
          isUserMessage={isUserMessage}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          isTTSEnabled={isTTSEnabled}
          onCopy={handleCopy}
          onEdit={isUserMessage ? handleEdit : undefined}
          onDelete={handleDelete}
          onLike={!isUserMessage ? handleLike : undefined}
          onBookmark={handleBookmark}
          onTextToSpeech={!isUserMessage ? () => handleTextToSpeech(message.content) : undefined}
          onToggleTTS={!isUserMessage ? toggleTTS : undefined}
        >
          <MessageBody 
            isUserMessage={isUserMessage}
            isEditing={isEditing}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            isTyping={isTyping}
            displayedContent={displayedContent}
          />
        </MessageContextMenu>
      ) : (
        <MessageBody 
          isUserMessage={isUserMessage}
          isEditing={isEditing}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          isTyping={isTyping}
          displayedContent={displayedContent}
        />
      )}
      
      {!isEditing && (
        <div className={cn(
          "w-full max-w-full mx-auto px-3 sm:px-4 md:px-8 mt-2 sm:mt-3",
          isUserMessage ? "text-right" : "text-left"
        )}>
          <MessageActions 
            isUserMessage={isUserMessage}
            isCopied={isCopied}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            isTTSEnabled={isTTSEnabled}
            handleEdit={handleEdit}
            handleCopy={handleCopy}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleBookmark={handleBookmark}
            handleTextToSpeech={() => handleTextToSpeech(message.content)}
            toggleTTS={toggleTTS}
          />
        </div>
      )}
    </div>
  );
};

export default Message;
