
import React from 'react';
import SuggestionButton from './SuggestionButton';
import { MessageSquare, Sparkles, FileText, Code, BookOpen } from 'lucide-react';

interface EmptyChatUIProps {
  onCreateImage: () => void;
  onSurpriseMe: () => void;
  onAnalyzeImages: () => void;
  onSummarizeText: () => void;
  onMore: () => void;
}

const EmptyChatUI: React.FC<EmptyChatUIProps> = ({
  onCreateImage,
  onSurpriseMe,
  onAnalyzeImages,
  onSummarizeText,
  onMore
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-8">
      <h1 className="text-2xl font-medium text-gray-800">ChatGPT</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
        <div className="col-span-1 md:col-span-2 mb-2">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Examples</h2>
        </div>
        
        <SuggestionButton 
          icon={<MessageSquare size={16} />} 
          label="Explain quantum computing in simple terms" 
          onClick={onSurpriseMe}
        />
        
        <SuggestionButton 
          icon={<Code size={16} />} 
          label="Generate a React component for a contact form" 
          onClick={onCreateImage}
        />
        
        <SuggestionButton 
          icon={<FileText size={16} />} 
          label="Summarize this article for a 2nd grader" 
          onClick={onSummarizeText}
        />
        
        <SuggestionButton 
          icon={<BookOpen size={16} />} 
          label="Give me ideas for my next vacation" 
          onClick={onAnalyzeImages}
        />
      </div>

      <div className="text-center text-xs text-gray-500 max-w-md">
        ChatGPT can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};

export default EmptyChatUI;
