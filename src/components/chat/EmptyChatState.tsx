
import React, { useState } from 'react';
import EmptyChatUI from '../EmptyChatUI';
import StudyFeatures from '../StudyFeatures';
import AdvancedStudyTools from '../study/AdvancedStudyTools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Lightbulb } from 'lucide-react';

interface EmptyChatStateProps {
  onSendMessage: (message: string) => void;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="pb-48 px-4 pt-4 overflow-x-hidden">
      <EmptyChatUI 
        onCreateImage={() => onSendMessage("Help me understand quantum physics concepts")}
        onSurpriseMe={() => onSendMessage("Explain machine learning in simple terms")}
        onAnalyzeImages={() => onSendMessage("Give me a study plan for IELTS exam")}
        onSummarizeText={() => onSendMessage("Summarize the key concepts of organic chemistry")}
        onMore={() => {}}
      />
      
      <div className="my-6 max-w-3xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Basic Tools</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Advanced Tools</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <StudyFeatures onFeatureSelect={onSendMessage} />
          </TabsContent>
          
          <TabsContent value="advanced">
            <AdvancedStudyTools onSendMessage={onSendMessage} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Getting Started</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome to Study AI! Ask me any study-related question, or try one of these:
        </p>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
          <li>"Create a study schedule for my final exams"</li>
          <li>"Explain the process of photosynthesis"</li>
          <li>"What are the key events of World War II?"</li>
          <li>"Help me solve this math problem: ..."</li>
          <li>"Give me practice questions for my biology test"</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyChatState;
