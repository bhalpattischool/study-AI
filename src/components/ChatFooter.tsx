
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic, SendHorizonal, MicOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatFooterProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMobile = useIsMobile();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(currentTranscript);
        setInput(currentTranscript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again.');
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Listening... Speak now');
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      setTranscript('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      if (isListening) {
        toggleListening();
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
          placeholder={isMobile ? "Message..." : "Message Study AI..."}
          className="resize-none min-h-[48px] max-h-[200px] py-3 pr-14 pl-4 rounded-xl border-purple-200 shadow-md focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 transition-all dark:bg-gray-700 dark:border-gray-600 dark:focus:border-purple-500"
          disabled={isLoading}
          rows={1}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-purple-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 dark:hover:text-purple-300 transition-colors"
              title="Attach files"
            >
              <Paperclip size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className={`h-7 w-7 rounded-md transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300 animate-pulse' 
                : 'text-purple-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 dark:hover:text-purple-300'
            }`}
            title={isListening ? 'Stop recording' : 'Voice input'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-7 w-7 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 dark:bg-purple-700 dark:hover:bg-purple-600 transition-transform hover:scale-105"
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
          <Sparkles size={12} className="text-yellow-500" />
          Study AI - Smart learning assistant
          <Sparkles size={12} className="text-yellow-500" />
        </div>
      )}
    </div>
  );
};

export default ChatFooter;
