
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages and their labels
export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    "language": "Language",
    "english": "English",
    "hindi": "Hindi",
    
    // Advanced Tools Common
    "advancedStudyTools": "Advanced Study Tools",
    "personalizedTools": "Personalized AI tools to enhance your learning experience",
    "generateBtn": "Generate",
    "processing": "Processing...",
    
    // Quiz Generator
    "quizGenerator": "Quiz Generator",
    "quizDescription": "Create custom quizzes to test your knowledge",
    "topic": "Topic",
    "topicPlaceholder": "Enter the topic (e.g., Photosynthesis, World War II)",
    "difficulty": "Difficulty",
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard",
    "numberOfQuestions": "Number of Questions",
    "generateQuiz": "Generate Quiz",
    "generatingQuiz": "Generating quiz...",
    
    // Notes Generator
    "notesGenerator": "Notes Generator",
    "notesDescription": "Create customized study notes for any topic",
    "noteFormat": "Note Format",
    "concise": "Concise (Key points only)",
    "comprehensive": "Comprehensive (Detailed explanations)",
    "examFocused": "Exam-Focused (With practice questions)",
    "generateNotes": "Generate Notes",
    "generatingNotes": "Generating notes...",
    
    // Study Planner
    "studyPlanner": "Study Planner",
    "plannerDescription": "Get a personalized study schedule for your exams",
    "examName": "Exam Name",
    "examNamePlaceholder": "E.g., Final Exams, NEET, JEE, etc.",
    "examDate": "Exam Date",
    "subjects": "Subjects (comma separated)",
    "subjectsPlaceholder": "E.g., Math, Physics, Chemistry",
    "hoursAvailable": "Hours Available Daily",
    "hour": "hour",
    "hours": "hours",
    "plusHours": "5+ hours",
    "generatePlan": "Generate Study Plan",
    "generatingPlan": "Generating study plan...",
    
    // Homework Assistant
    "homeworkAssistant": "Homework Assistant",
    "homeworkDescription": "Get help with your homework problems",
    "subject": "Subject",
    "mathematics": "Mathematics",
    "physics": "Physics",
    "chemistry": "Chemistry",
    "biology": "Biology",
    "english": "English",
    "history": "History",
    "geography": "Geography",
    "computerScience": "Computer Science",
    "yourProblem": "Your Problem",
    "problemPlaceholder": "Type or paste your homework problem here...",
    "helpType": "Help Type",
    "stepByStep": "Step-by-Step Solution",
    "justHint": "Just a Hint",
    "checkWork": "Check My Work",
    "getHelp": "Get Help",
    
    // Motivation System
    "motivationSystem": "Motivation System",
    "motivationDescription": "Get personalized motivation and study strategies",
    "studyMotivation": "Study Motivation",
    "motivationDescription1": "Get personalized motivation for your studies",
    "examPreparation": "Exam Preparation",
    "motivationDescription2": "Mental preparation for upcoming exams",
    "overcomeProcrastination": "Overcome Procrastination",
    "motivationDescription3": "Tips to beat procrastination",
    "dailyAffirmations": "Daily Affirmations",
    "motivationDescription4": "Positive affirmations for success",
    "studyEnergyBoost": "Study Energy Boost",
    "motivationDescription5": "Quick tips to regain energy"
  },
  hi: {
    // General
    "language": "भाषा",
    "english": "अंग्रेज़ी",
    "hindi": "हिंदी",
    
    // Advanced Tools Common
    "advancedStudyTools": "उन्नत अध्ययन उपकरण",
    "personalizedTools": "आपके सीखने के अनुभव को बढ़ाने के लिए व्यक्तिगत AI उपकरण",
    "generateBtn": "जनरेट करें",
    "processing": "प्रोसेसिंग...",
    
    // Quiz Generator
    "quizGenerator": "क्विज जनरेटर",
    "quizDescription": "अपने ज्ञान का परीक्षण करने के लिए कस्टम क्विज बनाएं",
    "topic": "विषय",
    "topicPlaceholder": "विषय दर्ज करें (जैसे, प्रकाश संश्लेषण, विश्व युद्ध II)",
    "difficulty": "कठिनाई",
    "easy": "आसान",
    "medium": "मध्यम",
    "hard": "कठिन",
    "numberOfQuestions": "प्रश्नों की संख्या",
    "generateQuiz": "क्विज जनरेट करें",
    "generatingQuiz": "क्विज जनरेट हो रही है...",
    
    // Notes Generator
    "notesGenerator": "नोट्स जनरेटर",
    "notesDescription": "किसी भी विषय के लिए अनुकूलित अध्ययन नोट्स बनाएं",
    "noteFormat": "नोट प्रारूप",
    "concise": "संक्षिप्त (केवल मुख्य बिंदु)",
    "comprehensive": "विस्तृत (विस्तृत स्पष्टीकरण)",
    "examFocused": "परीक्षा-केंद्रित (अभ्यास प्रश्नों के साथ)",
    "generateNotes": "नोट्स जनरेट करें",
    "generatingNotes": "नोट्स जनरेट हो रहे हैं...",
    
    // Study Planner
    "studyPlanner": "अध्ययन प्लानर",
    "plannerDescription": "अपनी परीक्षाओं के लिए एक व्यक्तिगत अध्ययन कार्यक्रम प्राप्त करें",
    "examName": "परीक्षा का नाम",
    "examNamePlaceholder": "जैसे, फाइनल परीक्षा, NEET, JEE, आदि",
    "examDate": "परीक्षा तिथि",
    "subjects": "विषय (कॉमा से अलग करें)",
    "subjectsPlaceholder": "जैसे, गणित, भौतिकी, रसायन विज्ञान",
    "hoursAvailable": "दैनिक उपलब्ध घंटे",
    "hour": "घंटा",
    "hours": "घंटे",
    "plusHours": "5+ घंटे",
    "generatePlan": "अध्ययन योजना जनरेट करें",
    "generatingPlan": "अध्ययन योजना जनरेट हो रही है...",
    
    // Homework Assistant
    "homeworkAssistant": "होमवर्क सहायक",
    "homeworkDescription": "अपने होमवर्क समस्याओं में मदद प्राप्त करें",
    "subject": "विषय",
    "mathematics": "गणित",
    "physics": "भौतिकी",
    "chemistry": "रसायन विज्ञान",
    "biology": "जीव विज्ञान",
    "english": "अंग्रेज़ी",
    "history": "इतिहास",
    "geography": "भूगोल",
    "computerScience": "कंप्यूटर विज्ञान",
    "yourProblem": "आपकी समस्या",
    "problemPlaceholder": "अपनी होमवर्क समस्या यहां टाइप या पेस्ट करें...",
    "helpType": "मदद का प्रकार",
    "stepByStep": "चरण-दर-चरण समाधान",
    "justHint": "सिर्फ एक संकेत",
    "checkWork": "मेरा काम चेक करें",
    "getHelp": "मदद प्राप्त करें",
    
    // Motivation System
    "motivationSystem": "प्रेरणा प्रणाली",
    "motivationDescription": "व्यक्तिगत प्रेरणा और अध्ययन रणनीतियां प्राप्त करें",
    "studyMotivation": "अध्ययन प्रेरणा",
    "motivationDescription1": "अपने अध्ययन के लिए व्यक्तिगत प्रेरणा प्राप्त करें",
    "examPreparation": "परीक्षा की तैयारी",
    "motivationDescription2": "आगामी परीक्षाओं के लिए मानसिक तैयारी",
    "overcomeProcrastination": "टालमटोल पर विजय पाएं",
    "motivationDescription3": "टालमटोल को हराने के लिए टिप्स",
    "dailyAffirmations": "दैनिक पुष्टिकरण",
    "motivationDescription4": "सफलता के लिए सकारात्मक पुष्टिकरण",
    "studyEnergyBoost": "अध्ययन ऊर्जा बूस्ट",
    "motivationDescription5": "ऊर्जा वापस पाने के लिए त्वरित टिप्स"
  }
};

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
