
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizGeneratorProps {
  onSendMessage: (message: string) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onSendMessage }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleGenerateQuiz = () => {
    if (!topic.trim()) {
      toast.error(language === 'en' ? 'Please enter a topic for the quiz' : 'कृपया क्विज के लिए एक विषय दर्ज करें');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (language === 'en') {
      prompt = `Generate a ${difficulty} difficulty quiz with ${numberOfQuestions} multiple-choice questions about ${topic}. For each question, provide 4 options, mark the correct answer, and include a brief explanation of why it's correct.`;
    } else {
      prompt = `${topic} के बारे में ${numberOfQuestions} बहुविकल्पीय प्रश्नों के साथ ${
        difficulty === 'easy' ? 'आसान' : (difficulty === 'medium' ? 'मध्यम' : 'कठिन')
      } कठिनाई वाली एक क्विज जनरेट करें। प्रत्येक प्रश्न के लिए, 4 विकल्प प्रदान करें, सही उत्तर को चिह्नित करें, और संक्षेप में बताएं कि यह सही क्यों है।`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(language === 'en' ? 'Generating quiz...' : 'क्विज जनरेट हो रही है...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-600" />
          {t('quizGenerator')}
        </CardTitle>
        <CardDescription>
          {t('quizDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            {t('topic')}
          </label>
          <Input
            id="topic"
            placeholder={t('topicPlaceholder')}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateQuiz} 
          disabled={isLoading || !topic.trim()} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('generateQuiz')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizGenerator;
