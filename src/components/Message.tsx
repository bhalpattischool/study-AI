
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash, Pencil, Check, X, User, VolumeIcon } from "lucide-react";
import { chatDB, Message as MessageType } from "@/lib/db";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: MessageType;
  onEdited: () => void;
  onDeleted: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onEdited, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);

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
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(editedContent.length, editedContent.length);
      }
    }, 0);
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

  const handleTextToSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(message.content);
    window.speechSynthesis.speak(utterance);
    toast.success("Playing audio");
  };

  return (
    <div 
      className={cn(
        "py-6 group",
        message.role === "user" 
          ? "bg-white dark:bg-gray-800" 
          : "bg-gray-50 dark:bg-gray-900"
      )}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-8 flex gap-4">
        <div 
          className={cn(
            "w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1",
            message.role === "user" 
              ? "bg-gray-300 text-gray-800" 
              : "bg-emerald-600 text-white"
          )}
        >
          {message.role === "user" ? <User size={16} /> : "AI"}
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="w-full animate-fade-in">
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[120px] mb-2 resize-none border-gray-300"
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-sm"
                >
                  <X size={14} /> Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 text-sm"
                >
                  <Check size={14} /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {message.content}
            </div>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <div className="max-w-3xl mx-auto px-4 md:px-8 mt-3">
          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            {message.role === "user" && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleEdit}
                className="h-7 px-2 text-xs text-gray-500"
              >
                <Pencil size={14} className="mr-1" />
                Edit
              </Button>
            )}
            
            {message.role === "bot" && (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleTextToSpeech}
                  className="h-7 px-2 text-xs text-gray-500"
                >
                  <VolumeIcon size={14} className="mr-1" />
                  Speak
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCopy}
                  className="h-7 px-2 text-xs text-gray-500"
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
              className="h-7 px-2 text-xs text-gray-500 hover:text-red-500"
            >
              <Trash size={14} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
