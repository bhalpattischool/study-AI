
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizGenerator from './QuizGenerator';
import NotesGenerator from './NotesGenerator';
import StudyPlanner from './StudyPlanner';
import HomeworkAssistant from './HomeworkAssistant';
import MotivationSystem from './MotivationSystem';
import TeacherMode from './TeacherMode';
import { BrainCircuit, FileText, Calendar, BookOpen, Sparkles, Globe, GraduationCap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageProvider, useLanguage, Language } from '@/contexts/LanguageContext';

interface AdvancedStudyToolsProps {
  onSendMessage: (message: string) => void;
}

// Wrapper component that provides language context
const AdvancedStudyToolsWithLanguage: React.FC<AdvancedStudyToolsProps> = (props) => {
  return (
    <LanguageProvider>
      <AdvancedStudyTools {...props} />
    </LanguageProvider>
  );
};

const AdvancedStudyTools: React.FC<AdvancedStudyToolsProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState('quiz');
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{t('advancedStudyTools')}</h2>
          <p className="text-sm text-purple-100">{t('personalizedTools')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white" />
          <Select
            value={language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-[110px] bg-white/10 border-white/20 text-white">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="hi">{t('hindi')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-6 bg-purple-50 dark:bg-gray-800 p-1">
          <TabsTrigger value="quiz" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <BrainCircuit className="h-4 w-4 mb-1" />
            {t('quizGenerator').split(' ')[0]}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <FileText className="h-4 w-4 mb-1" />
            {t('notesGenerator').split(' ')[0]}
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <Calendar className="h-4 w-4 mb-1" />
            {t('studyPlanner').split(' ')[0]}
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4 mb-1" />
            {t('homeworkAssistant').split(' ')[0]}
          </TabsTrigger>
          <TabsTrigger value="motivation" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 mb-1" />
            {t('motivationSystem').split(' ')[0]}
          </TabsTrigger>
          <TabsTrigger value="teacher" className="flex flex-col items-center py-2 px-1 text-xs sm:text-sm">
            <GraduationCap className="h-4 w-4 mb-1" />
            {t('teacherMode').split(' ')[0]}
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
          
          <TabsContent value="teacher" className="mt-0">
            <TeacherMode onSendMessage={onSendMessage} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdvancedStudyToolsWithLanguage;
