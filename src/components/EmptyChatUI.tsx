
import React from 'react';
import SuggestionButton from './SuggestionButton';
import { Image, Sparkles, FileText, Eye, MoreHorizontal } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-10">
      <h1 className="text-3xl font-medium text-gray-800">What can I help with?</h1>
      
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <div className="flex gap-4 justify-center">
          <SuggestionButton 
            icon={<Image className="text-green-500" />} 
            label="Create image" 
            onClick={onCreateImage}
            className="flex-1"
          />
          <SuggestionButton 
            icon={<Sparkles className="text-blue-400" />} 
            label="Surprise me" 
            onClick={onSurpriseMe}
            className="flex-1"
          />
        </div>
        
        <div className="flex gap-4 justify-center">
          <SuggestionButton 
            icon={<Eye className="text-violet-500" />} 
            label="Analyze images" 
            onClick={onAnalyzeImages}
            className="flex-1"
          />
          <SuggestionButton 
            icon={<FileText className="text-orange-400" />} 
            label="Summarize text" 
            onClick={onSummarizeText}
            className="flex-1"
          />
          <SuggestionButton 
            icon={<MoreHorizontal />} 
            label="More" 
            onClick={onMore}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyChatUI;
