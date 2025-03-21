
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { chatDB, Message } from "@/lib/db";

export function useMessageState(message: Message, onEdited: () => void, onDeleted: () => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(!!message.bookmarked);

  // Text animation effect for bot messages
  useEffect(() => {
    if (message.role === 'bot' && !isEditing) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let i = 0;
      const typingSpeed = 5; // Changed from 15 to 5 ms per character to make it faster
      
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

  // Update local bookmark state when message bookmarked status changes
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

  return {
    isEditing,
    editedContent,
    setEditedContent,
    isTyping,
    displayedContent,
    isCopied,
    isLiked,
    isBookmarked,
    setIsBookmarked,
    handleCopy,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleLike
  };
}
