
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Lightbulb, Mic, SendHorizonal } from "lucide-react";

interface ChatFooterProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            className="resize-none min-h-[60px] pr-20 pl-12 py-4 rounded-full border-gray-200"
            disabled={isLoading}
          />
          
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
            >
              <Plus size={20} />
            </Button>
          </div>
          
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-100"
            >
              <Globe size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-100"
            >
              <Lightbulb size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-100"
            >
              <Mic size={20} />
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-9 w-9 rounded-full bg-black text-white hover:bg-gray-800"
            >
              <SendHorizonal size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
