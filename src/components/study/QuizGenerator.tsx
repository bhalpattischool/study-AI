
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, RefreshCw, Sparkles, BookOpenCheck, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuizGeneratorProps {
  onSendMessage: (message: string) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onSendMessage }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [quizType, setQuizType] = useState('multiple-choice');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const { t, language } = useLanguage();

  const subjects = [
    { id: 'general', name: language === 'en' ? 'General' : 'सामान्य' },
    { id: 'mathematics', name: language === 'en' ? 'Mathematics' : 'गणित' },
    { id: 'science', name: language === 'en' ? 'Science' : 'विज्ञान' },
    { id: 'history', name: language === 'en' ? 'History' : 'इतिहास' },
    { id: 'geography', name: language === 'en' ? 'Geography' : 'भूगोल' },
    { id: 'literature', name: language === 'en' ? 'Literature' : 'साहित्य' },
    { id: 'computer', name: language === 'en' ? 'Computer Science' : 'कंप्यूटर विज्ञान' },
  ];

  const quizTypes = [
    { id: 'multiple-choice', name: language === 'en' ? 'Multiple Choice' : 'बहुविकल्पीय' },
    { id: 'true-false', name: language === 'en' ? 'True/False' : 'सही/गलत' },
    { id: 'short-answer', name: language === 'en' ? 'Short Answer' : 'लघु उत्तर' },
    { id: 'flashcards', name: language === 'en' ? 'Flashcards' : 'फ्लैशकार्ड' },
  ];

  const handleGenerateQuiz = () => {
    if (!topic.trim()) {
      toast.error(language === 'en' ? 'Please enter a topic for the quiz' : 'कृपया क्विज के लिए एक विषय दर्ज करें');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (language === 'en') {
      prompt = `Generate a ${difficulty} difficulty ${quizType} quiz with ${numberOfQuestions} questions about ${topic} for ${selectedSubject} subject. For each question, provide options, mark the correct answer, and include a brief explanation of why it's correct.`;
    } else {
      prompt = `${selectedSubject} विषय के लिए ${topic} के बारे में ${numberOfQuestions} ${
        quizType === 'multiple-choice' ? 'बहुविकल्पीय' : 
        quizType === 'true-false' ? 'सही/गलत' : 
        quizType === 'short-answer' ? 'लघु उत्तर' : 'फ्लैशकार्ड'
      } प्रश्नों के साथ ${
        difficulty === 'easy' ? 'आसान' : (difficulty === 'medium' ? 'मध्यम' : 'कठिन')
      } कठिनाई वाली एक क्विज जनरेट करें। प्रत्येक प्रश्न के लिए, विकल्प प्रदान करें, सही उत्तर को चिह्नित करें, और संक्षेप में बताएं कि यह सही क्यों है।`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(
      language === 'en' 
        ? `Generating ${quizType} quiz on ${topic}...` 
        : `${topic} पर ${quizType === 'multiple-choice' ? 'बहुविकल्पीय' : 'सही/गलत'} क्विज जनरेट हो रही है...`
    );
  };

  const generateSampleQuestions = () => {
    const sampleTopics = [
      language === 'en' ? 'Solar System Planets' : 'सौर मंडल के ग्रह',
      language === 'en' ? 'World War II' : 'द्वितीय विश्व युद्ध',
      language === 'en' ? 'Periodic Table Elements' : 'आवर्त सारणी के तत्व',
      language === 'en' ? 'Cell Biology' : 'कोशिका विज्ञान',
      language === 'en' ? 'Linear Algebra' : 'रैखिक बीजगणित'
    ];
    
    setTopic(sampleTopics[Math.floor(Math.random() * sampleTopics.length)]);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow border-purple-100 dark:border-purple-900">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
          <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          {t('quizGenerator')}
        </CardTitle>
        <CardDescription>
          {t('quizDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic">
              <BookOpenCheck className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Basic Options' : 'मूल विकल्प'}
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <GraduationCap className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Advanced Options' : 'उन्नत विकल्प'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-1">
                {t('topic')}
              </label>
              <div className="flex gap-2">
                <Input
                  id="topic"
                  placeholder={t('topicPlaceholder')}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={generateSampleQuestions}
                  className="shrink-0"
                  title={language === 'en' ? 'Generate sample topic' : 'नमूना विषय उत्पन्न करें'}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
                {t('difficulty')}
              </label>
              <select
                id="difficulty"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">{t('easy')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="hard">{t('hard')}</option>
              </select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                {language === 'en' ? 'Subject' : 'विषय'}
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quizType" className="block text-sm font-medium mb-1">
                {language === 'en' ? 'Quiz Type' : 'प्रश्नोत्तरी प्रकार'}
              </label>
              <select
                id="quizType"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
              >
                {quizTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="questions" className="block text-sm font-medium mb-1">
                {t('numberOfQuestions')}
              </label>
              <select
                id="questions"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-b-lg pt-4">
        <Button 
          onClick={handleGenerateQuiz} 
          disabled={isLoading || !topic.trim()} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t('generateQuiz')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizGenerator;
