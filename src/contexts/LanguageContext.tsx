
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
  // Additional keys for QuizGenerator
  quizDescription: string;
  topic: string;
  topicPlaceholder: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  numberOfQuestions: string;
  processing: string;
  // Additional keys for NotesGenerator
  notesDescription: string;
  noteFormat: string;
  concise: string;
  comprehensive: string;
  examFocused: string;
  // Additional keys for StudyPlanner
  plannerDescription: string;
  examName: string;
  examNamePlaceholder: string;
  examDate: string;
  subjects: string;
  subjectsPlaceholder: string;
  hoursAvailable: string;
  hour: string;
  hours: string;
  plusHours: string;
  generatePlan: string;
  // Additional keys for HomeworkAssistant
  homeworkDescription: string;
  subject: string;
  mathematics: string;
  physics: string;
  chemistry: string;
  biology: string;
  history: string;
  geography: string;
  computerScience: string;
  yourProblem: string;
  problemPlaceholder: string;
  helpType: string;
  stepByStep: string;
  justHint: string;
  checkWork: string;
  getHelp: string;
  // Additional keys for MotivationSystem
  motivationDescription: string;
  studyMotivation: string;
  motivationDescription1: string;
  examPreparation: string;
  motivationDescription2: string;
  overcomeProcrastination: string;
  motivationDescription3: string;
  dailyAffirmations: string;
  motivationDescription4: string;
  studyEnergyBoost: string;
  motivationDescription5: string;
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
    motivate: 'Get Motivated',
    // QuizGenerator translations
    quizDescription: 'Create custom quizzes based on your topics of study',
    topic: 'Topic',
    topicPlaceholder: 'Enter the subject or topic (e.g., Photosynthesis)',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    numberOfQuestions: 'Number of Questions',
    processing: 'Processing...',
    // NotesGenerator translations
    notesDescription: 'Generate comprehensive study notes on any topic',
    noteFormat: 'Note Format',
    concise: 'Concise (Key Points)',
    comprehensive: 'Comprehensive (Detailed)',
    examFocused: 'Exam-Focused',
    // StudyPlanner translations
    plannerDescription: 'Create a customized study plan for your exams',
    examName: 'Exam Name',
    examNamePlaceholder: 'Enter the name of your exam',
    examDate: 'Exam Date',
    subjects: 'Subjects',
    subjectsPlaceholder: 'List subjects to study (comma separated)',
    hoursAvailable: 'Hours Available Daily',
    hour: 'hour',
    hours: 'hours',
    plusHours: '5+ hours',
    generatePlan: 'Generate Study Plan',
    // HomeworkAssistant translations
    homeworkDescription: 'Get help with difficult homework problems',
    subject: 'Subject',
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    history: 'History',
    geography: 'Geography',
    computerScience: 'Computer Science',
    yourProblem: 'Your Problem',
    problemPlaceholder: 'Type or paste your homework problem here',
    helpType: 'Type of Help',
    stepByStep: 'Step-by-Step Solution',
    justHint: 'Just Give Me a Hint',
    checkWork: 'Check My Work',
    getHelp: 'Get Help',
    // MotivationSystem translations
    motivationDescription: 'Get motivation and support for your study journey',
    studyMotivation: 'Study Motivation',
    motivationDescription1: 'Get personalized motivation to study',
    examPreparation: 'Exam Preparation',
    motivationDescription2: 'Mental preparation for upcoming exams',
    overcomeProcrastination: 'Overcome Procrastination',
    motivationDescription3: 'Break through study blocks',
    dailyAffirmations: 'Daily Affirmations',
    motivationDescription4: 'Positive statements for students',
    studyEnergyBoost: 'Energy Boost',
    motivationDescription5: 'Quick mental refreshers'
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
    motivate: 'प्रेरित हों',
    // QuizGenerator translations
    quizDescription: 'अपने अध्ययन के विषयों के आधार पर कस्टम क्विज बनाएं',
    topic: 'विषय',
    topicPlaceholder: 'विषय दर्ज करें (जैसे, प्रकाश संश्लेषण)',
    difficulty: 'कठिनाई',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    numberOfQuestions: 'प्रश्नों की संख्या',
    processing: 'प्रोसेसिंग...',
    // NotesGenerator translations
    notesDescription: 'किसी भी विषय पर व्यापक अध्ययन नोट्स जनरेट करें',
    noteFormat: 'नोट फॉर्मेट',
    concise: 'संक्षिप्त (मुख्य बिंदु)',
    comprehensive: 'व्यापक (विस्तृत)',
    examFocused: 'परीक्षा-केंद्रित',
    // StudyPlanner translations
    plannerDescription: 'अपनी परीक्षाओं के लिए अनुकूलित अध्ययन योजना बनाएं',
    examName: 'परीक्षा का नाम',
    examNamePlaceholder: 'अपनी परीक्षा का नाम दर्ज करें',
    examDate: 'परीक्षा की तारीख',
    subjects: 'विषय',
    subjectsPlaceholder: 'अध्ययन करने के विषयों की सूची (कॉमा से अलग)',
    hoursAvailable: 'दैनिक उपलब्ध घंटे',
    hour: 'घंटा',
    hours: 'घंटे',
    plusHours: '5+ घंटे',
    generatePlan: 'अध्ययन योजना बनाएं',
    // HomeworkAssistant translations
    homeworkDescription: 'कठिन होमवर्क समस्याओं में मदद प्राप्त करें',
    subject: 'विषय',
    mathematics: 'गणित',
    physics: 'भौतिकी',
    chemistry: 'रसायन विज्ञान',
    biology: 'जीव विज्ञान',
    history: 'इतिहास',
    geography: 'भूगोल',
    computerScience: 'कंप्यूटर विज्ञान',
    yourProblem: 'आपकी समस्या',
    problemPlaceholder: 'अपनी होमवर्क समस्या यहां टाइप करें या पेस्ट करें',
    helpType: 'मदद का प्रकार',
    stepByStep: 'चरण-दर-चरण समाधान',
    justHint: 'सिर्फ संकेत दें',
    checkWork: 'मेरा काम चेक करें',
    getHelp: 'मदद लें',
    // MotivationSystem translations
    motivationDescription: 'अपनी अध्ययन यात्रा के लिए प्रेरणा और समर्थन प्राप्त करें',
    studyMotivation: 'अध्ययन प्रेरणा',
    motivationDescription1: 'अध्ययन के लिए व्यक्तिगत प्रेरणा प्राप्त करें',
    examPreparation: 'परीक्षा की तैयारी',
    motivationDescription2: 'आगामी परीक्षाओं के लिए मानसिक तैयारी',
    overcomeProcrastination: 'टालमटोल पर काबू पाएं',
    motivationDescription3: 'अध्ययन में आने वाली बाधाओं को दूर करें',
    dailyAffirmations: 'दैनिक सकारात्मक पुष्टिकरण',
    motivationDescription4: 'छात्रों के लिए सकारात्मक कथन',
    studyEnergyBoost: 'ऊर्जा बढ़ावा',
    motivationDescription5: 'त्वरित मानसिक ताज़गी'
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
