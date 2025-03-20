
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface TranslationKeys {
  advancedStudyTools: string;
  personalizedTools: string;
  language: string;
  english: string;
  hindi: string;
  quizGenerator: string;
  notesGenerator: string;
  studyPlanner: string;
  homeworkAssistant: string;
  motivationSystem: string;
  generateQuiz: string;
  generateNotes: string;
  planStudy: string;
  assistHomework: string;
  motivate: string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    advancedStudyTools: 'Advanced Study Tools',
    personalizedTools: 'Your Personalized Learning Assistant',
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    quizGenerator: 'Quiz Generator',
    notesGenerator: 'Notes Generator',
    studyPlanner: 'Study Planner',
    homeworkAssistant: 'Homework Assistant',
    motivationSystem: 'Motivation System',
    generateQuiz: 'Generate Quiz',
    generateNotes: 'Generate Notes',
    planStudy: 'Plan Study',
    assistHomework: 'Get Help',
    motivate: 'Get Motivated'
  },
  hi: {
    advancedStudyTools: 'उन्नत अध्ययन टूल्स',
    personalizedTools: 'आपका व्यक्तिगत लर्निंग असिस्टेंट',
    language: 'भाषा',
    english: 'अंग्रेजी',
    hindi: 'हिंदी',
    quizGenerator: 'क्विज जनरेटर',
    notesGenerator: 'नोट्स जनरेटर',
    studyPlanner: 'अध्ययन योजनाकार',
    homeworkAssistant: 'होमवर्क सहायक',
    motivationSystem: 'प्रेरणा सिस्टम',
    generateQuiz: 'क्विज बनाएं',
    generateNotes: 'नोट्स बनाएं',
    planStudy: 'अध्ययन योजना',
    assistHomework: 'मदद लें',
    motivate: 'प्रेरित हों'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
