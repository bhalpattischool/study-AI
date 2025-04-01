
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeworkAssistantProps {
  onSendMessage: (message: string) => void;
}

const HomeworkAssistant: React.FC<HomeworkAssistantProps> = ({ onSendMessage }) => {
  const [problem, setProblem] = useState('');
  const [subject, setSubject] = useState('math');
  const [assistMode, setAssistMode] = useState('stepByStep');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleGetHelp = () => {
    if (!problem.trim()) {
      toast.error(language === 'en' ? 'Please enter your homework problem' : 'कृपया अपनी होमवर्क समस्या दर्ज करें');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (language === 'en') {
      if (assistMode === 'stepByStep') {
        prompt = `I need help with this ${subject} problem: "${problem}". Please explain the solution step by step, showing all work and explaining the reasoning at each stage. Don't just give me the final answer.`;
      } else if (assistMode === 'hint') {
        prompt = `I'm working on this ${subject} problem: "${problem}". Please give me a hint or starting point without solving it completely. I want to try solving it myself.`;
      } else if (assistMode === 'check') {
        prompt = `I solved this ${subject} problem: "${problem}". Can you check if my approach and solution are correct? If there are any errors, please explain what went wrong and how to fix it.`;
      }
    } else {
      if (assistMode === 'stepByStep') {
        prompt = `मुझे इस ${getHindiSubjectName(subject)} की समस्या में मदद चाहिए: "${problem}". कृपया समाधान को चरण-दर-चरण समझाएं, सभी कार्य दिखाएं और प्रत्येक चरण पर तर्क की व्याख्या करें। मुझे केवल अंतिम उत्तर ही न दें।`;
      } else if (assistMode === 'hint') {
        prompt = `मैं इस ${getHindiSubjectName(subject)} की समस्या पर काम कर रहा हूँ: "${problem}". कृपया मुझे इसे पूरी तरह से हल किए बिना एक संकेत या शुरुआती बिंदु दें। मैं इसे खुद हल करने की कोशिश करना चाहता हूँ।`;
      } else if (assistMode === 'check') {
        prompt = `मैंने इस ${getHindiSubjectName(subject)} की समस्या को हल किया: "${problem}". क्या आप जांच कर सकते हैं कि मेरा दृष्टिकोण और समाधान सही है? यदि कोई त्रुटियां हैं, तो कृपया बताएं कि क्या गलत हुआ और इसे कैसे ठीक किया जाए।`;
      }
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(language === 'en' ? 'Getting homework help...' : 'होमवर्क सहायता प्राप्त कर रहे हैं...');
  };

  const getHindiSubjectName = (englishSubject: string): string => {
    const subjectMap: {[key: string]: string} = {
      'math': 'गणित',
      'physics': 'भौतिकी',
      'chemistry': 'रसायन विज्ञान',
      'biology': 'जीव विज्ञान',
      'english': 'अंग्रेज़ी',
      'history': 'इतिहास',
      'geography': 'भूगोल',
      'computer science': 'कंप्यूटर विज्ञान',
      'literature': 'साहित्य',
      'economics': 'अर्थशास्त्र',
      'psychology': 'मनोविज्ञान',
      'sociology': 'समाजशास्त्र'
    };
    return subjectMap[englishSubject] || englishSubject;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          {t('homeworkAssistant')}
        </CardTitle>
        <CardDescription>
          {t('homeworkDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            {t('subject')}
          </label>
          <select
            id="subject"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="math">{t('mathematics')}</option>
            <option value="physics">{t('physics')}</option>
            <option value="chemistry">{t('chemistry')}</option>
            <option value="biology">{t('biology')}</option>
            <option value="english">{t('english')}</option>
            <option value="history">{t('history')}</option>
            <option value="geography">{t('geography')}</option>
            <option value="computer science">{t('computerScience')}</option>
            <option value="literature">{t('literature')}</option>
            <option value="economics">{t('economics')}</option>
            <option value="psychology">{t('psychology')}</option>
            <option value="sociology">{t('sociology')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium mb-1">
            {t('yourProblem')}
          </label>
          <Textarea
            id="problem"
            placeholder={t('problemPlaceholder')}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <label htmlFor="assistMode" className="block text-sm font-medium mb-1">
            {t('helpType')}
          </label>
          <select
            id="assistMode"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={assistMode}
            onChange={(e) => setAssistMode(e.target.value)}
          >
            <option value="stepByStep">{t('stepByStep')}</option>
            <option value="hint">{t('justHint')}</option>
            <option value="check">{t('checkWork')}</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGetHelp} 
          disabled={isLoading || !problem.trim()} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('getHelp')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HomeworkAssistant;
