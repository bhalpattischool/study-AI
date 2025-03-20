
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizGenerator from './QuizGenerator';
import NotesGenerator from './NotesGenerator';
import StudyPlanner from './StudyPlanner';
import HomeworkAssistant from './HomeworkAssistant';
import MotivationSystem from './MotivationSystem';
import { BrainCircuit, FileText, Calendar, BookOpen, Sparkles } from 'lucide-react';

interface AdvancedStudyToolsProps {
  onSendMessage: (message: string) => void;
}

const AdvancedStudyTools: React.FC<AdvancedStudyToolsProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState('quiz');

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h2 className="text-xl font-bold">Advanced Study Tools</h2>
        <p className="text-sm text-purple-100">Personalized AI tools to enhance your learning experience</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 bg-purple-50 dark:bg-gray-800 p-1">
          <TabsTrigger value="quiz" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <BrainCircuit className="h-4 w-4 mb-1" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <FileText className="h-4 w-4 mb-1" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <Calendar className="h-4 w-4 mb-1" />
            Planner
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mb-1" />
            Homework
          </TabsTrigger>
          <TabsTrigger value="motivation" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 mb-1" />
            Motivation
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4">
          <TabsContent value="quiz" className="mt-0">
            <QuizGenerator onSendMessage={onSendMessage} />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <NotesGenerator onSendMessage={onSendMessage} />
          </TabsContent>
          
          <TabsContent value="planner" className="mt-0">
            <StudyPlanner onSendMessage={onSendMessage} />
          </TabsContent>
          
          <TabsContent value="homework" className="mt-0">
            <HomeworkAssistant onSendMessage={onSendMessage} />
          </TabsContent>
          
          <TabsContent value="motivation" className="mt-0">
            <MotivationSystem onSendMessage={onSendMessage} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdvancedStudyTools;
