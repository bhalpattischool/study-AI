
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatFooterProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, isLoading, isDisabled = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { language } = useLanguage();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !isDisabled) {
      onSend(input.trim());
      setInput('');
      
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
    <div className="fixed bottom-0 left-0 right-0 p-3 pb-safe bg-white dark:bg-gray-800 border-t border-purple-100 dark:border-purple-900 shadow-lg animate-fade-in z-10">
      <div className="relative max-w-3xl mx-auto">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDisabled 
            ? (language === 'hi' ? "AI प्रतिक्रिया का इंतज़ार कर रहा है..." : "Waiting for AI to respond...")
            : (isMobile 
              ? (language === 'hi' ? "संदेश..." : "Message...") 
              : (language === 'hi' ? "स्टडी AI को संदेश भेजें..." : "Message Study AI..."))}
          className={`resize-none min-h-[48px] max-h-[200px] py-3 pr-14 pl-4 rounded-xl border-purple-200 shadow-md 
            focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 transition-all 
            dark:bg-gray-700 dark:border-gray-600 dark:focus:border-purple-500
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading || isDisabled}
          rows={1}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isDisabled}
            size="icon"
            className={`h-7 w-7 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 
              dark:bg-purple-700 dark:hover:bg-purple-600 transition-transform hover:scale-105
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
            ) : (
              <SendHorizonal size={16} />
            )}
          </Button>
        </div>
      </div>
      
      {!isMobile && (
        <div className="max-w-3xl mx-auto mt-2 text-xs text-center text-purple-500 dark:text-purple-400 flex items-center justify-center gap-1">
          <span className="text-yellow-500">✨</span>
          {language === 'hi' ? "स्टडी AI - स्मार्ट लर्निंग सहायक" : "Study AI - Smart learning assistant"}
          <span className="text-yellow-500">✨</span>
        </div>
      )}
    </div>
  );
};

export default ChatFooter;
