
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash, Pencil, Check, X, User, VolumeIcon, Code, Bold, Italic, List, Heading, Heart } from "lucide-react";
import { chatDB, Message as MessageType } from "@/lib/db";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    toast.success("Playing audio");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Response marked as helpful");
    }
  };

  const insertMarkdown = (pattern: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = editedContent.substring(start, end);
    const beforeText = editedContent.substring(0, start);
    const afterText = editedContent.substring(end);
    
    let newText;
    switch (pattern) {
      case 'bold':
        newText = beforeText + `**${selectedText || 'bold text'}**` + afterText;
        break;
      case 'italic':
        newText = beforeText + `*${selectedText || 'italic text'}*` + afterText;
        break;
      case 'code':
        newText = beforeText + `\`\`\`\n${selectedText || 'code block'}\n\`\`\`` + afterText;
        break;
      case 'list':
        newText = beforeText + `\n- ${selectedText || 'list item'}\n- another item\n` + afterText;
        break;
      case 'heading':
        newText = beforeText + `\n## ${selectedText || 'Heading'}\n` + afterText;
        break;
      default:
        newText = editedContent;
    }
    
    setEditedContent(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const isUserMessage = message.role === "user";

  return (
    <div 
      className={cn(
        "py-6 group transition-colors duration-300",
        isUserMessage 
          ? "bg-white dark:bg-gray-800" 
          : "bg-purple-50 dark:bg-gray-900"
      )}
    >
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
            <div className="w-full animate-fade-in">
              <div className="flex gap-1 mb-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertMarkdown('bold')}
                  className="h-7 px-2 text-xs"
                >
                  <Bold size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertMarkdown('italic')}
                  className="h-7 px-2 text-xs"
                >
                  <Italic size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertMarkdown('code')}
                  className="h-7 px-2 text-xs"
                >
                  <Code size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertMarkdown('list')}
                  className="h-7 px-2 text-xs"
                >
                  <List size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => insertMarkdown('heading')}
                  className="h-7 px-2 text-xs"
                >
                  <Heading size={14} />
                </Button>
              </div>
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[120px] mb-2 resize-none border-gray-300 dark:border-gray-600 rounded-xl"
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
                  className="flex items-center gap-1 text-sm bg-purple-600 hover:bg-purple-700"
                >
                  <Check size={14} /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn(
              "prose dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:p-0 prose-headings:mt-3 prose-headings:mb-2",
              isTyping && message.role === 'bot' && "after:content-['▎'] after:animate-pulse after:ml-0.5 after:text-purple-500"
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = props.inline || false; // Fix: Use isInline instead of inline
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={atomDark}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {displayedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <div className={cn(
          "max-w-3xl mx-auto px-4 md:px-8 mt-3",
          isUserMessage ? "text-right" : "text-left"
        )}>
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
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleTextToSpeech}
                  className="h-7 px-2 text-xs text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900 transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default Message;
