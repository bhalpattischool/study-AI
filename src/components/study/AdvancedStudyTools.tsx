import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedToolsHeader from './advanced-tools/AdvancedToolsHeader';
import ToolsTabNavigation from './advanced-tools/ToolsTabNavigation';
import ToolsTabContent from './advanced-tools/ToolsTabContent';
import ClosableAdBanner from '@/components/ads/ClosableAdBanner';

interface AdvancedStudyToolsProps {
  onSendMessage: (message: string) => void;
}

const AdvancedStudyTools: React.FC<AdvancedStudyToolsProps> = ({ onSendMessage }) => {
  const [activeTab, setActiveTab] = useState('quiz');
  const { t } = useLanguage();

  const tabTranslations = {
    quizGenerator: t('quizGenerator'),
    notesGenerator: t('notesGenerator'),
    studyPlanner: t('studyPlanner'),
    homeworkAssistant: t('homeworkAssistant'),
    motivationSystem: t('motivationSystem'),
    teacherMode: t('teacherMode')
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <ClosableAdBanner className="mb-2 w-full max-w-3xl mx-auto" />
      <AdvancedToolsHeader 
        title={t('advancedStudyTools')} 
        description={t('personalizedTools')} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ToolsTabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          translations={tabTranslations}
        />
        
        <ToolsTabContent
          activeTab={activeTab}
          onSendMessage={onSendMessage}
        />
      </Tabs>
    </div>
  );
};

export default AdvancedStudyTools;
