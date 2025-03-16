
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash, Pencil, Check, X } from "lucide-react";
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

  return (
    <div 
      className={cn(
        "py-6 px-4 md:px-8 flex items-start gap-4 animate-fade-in border-b",
        message.role === "user" 
          ? "bg-white" 
          : "bg-secondary/40 backdrop-blur-sm"
      )}
    >
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          message.role === "user" 
            ? "bg-chat-user text-white" 
            : "bg-chat-bot text-white"
        )}
      >
        {message.role === "user" ? "U" : "G"}
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="w-full animate-fade-in">
            <Textarea
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[120px] mb-2 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancelEdit}
                className="flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                className="flex items-center gap-1"
              >
                <Check size={16} /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
          {message.role === "user" && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleEdit}
              className="w-8 h-8"
            >
              <Pencil size={16} />
            </Button>
          )}
          
          {message.role === "bot" && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCopy}
              className="w-8 h-8"
            >
              <Copy size={16} className={isCopied ? "text-green-500" : ""} />
            </Button>
          )}
          
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleDelete}
            className="w-8 h-8 text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Message;
