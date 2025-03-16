
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Attachment, Mic, SendHorizonal } from "lucide-react";

interface ChatFooterProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-white dark:bg-gray-800 border-t">
      <div className="relative max-w-3xl mx-auto">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="resize-none min-h-[48px] max-h-[200px] py-3 pr-14 pl-4 rounded-lg border-gray-300 shadow-sm focus:border-gray-300 focus:ring-0"
          disabled={isLoading}
          rows={1}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-gray-400 hover:text-gray-500"
            title="Attach files"
          >
            <Attachment size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-gray-400 hover:text-gray-500"
            title="Voice input"
          >
            <Mic size={16} />
          </Button>
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-7 w-7 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-300"
          >
            <SendHorizonal size={16} />
          </Button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto mt-2 text-xs text-center text-gray-500">
        Free Research Preview. ChatGPT may produce inaccurate information.
      </div>
    </div>
  );
};

export default ChatFooter;
