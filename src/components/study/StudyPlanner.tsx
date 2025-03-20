
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface StudyPlannerProps {
  onSendMessage: (message: string) => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ onSendMessage }) => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('');
  const [dailyHours, setDailyHours] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleGeneratePlan = () => {
    if (!examName.trim() || !examDate.trim() || !subjects.trim()) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);
    const subjectList = subjects.split(',').map(s => s.trim()).join(', ');
    
    let prompt = '';
    
    if (language === 'en') {
      prompt = `Create a detailed study plan for my ${examName} exam on ${examDate}. I need to study these subjects: ${subjectList}. I can dedicate ${dailyHours} hours daily for studying. Please include:
1. Daily schedule with specific topics
2. Weekly milestones
3. Recommended study techniques for each subject
4. When to schedule revision sessions
5. Short breaks and self-care recommendations`;
    } else {
      prompt = `मेरी ${examName} परीक्षा के लिए ${examDate} को एक विस्तृत अध्ययन योजना बनाएं। मुझे इन विषयों का अध्ययन करने की आवश्यकता है: ${subjectList}। मैं अध्ययन के लिए दैनिक ${dailyHours} घंटे समर्पित कर सकता हूँ। कृपया शामिल करें:
1. विशिष्ट विषयों के साथ दैनिक कार्यक्रम
2. साप्ताहिक लक्ष्य
3. प्रत्येक विषय के लिए अनुशंसित अध्ययन तकनीकें
4. पुनरीक्षण सत्रों को कब निर्धारित करना है
5. छोटे ब्रेक और स्व-देखभाल की सिफारिशें`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(language === 'en' ? 'Generating study plan...' : 'अध्ययन योजना जनरेट हो रही है...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          {t('studyPlanner')}
        </CardTitle>
        <CardDescription>
          {t('plannerDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="examName" className="block text-sm font-medium mb-1">
            {t('examName')}
          </label>
          <Input
            id="examName"
            placeholder={t('examNamePlaceholder')}
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="examDate" className="block text-sm font-medium mb-1">
            {t('examDate')}
          </label>
          <Input
            id="examDate"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="subjects" className="block text-sm font-medium mb-1">
            {t('subjects')}
          </label>
          <Input
            id="subjects"
            placeholder={t('subjectsPlaceholder')}
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dailyHours" className="block text-sm font-medium mb-1">
            {t('hoursAvailable')}
          </label>
          <select
            id="dailyHours"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
          >
            <option value="1">1 {t('hour')}</option>
            <option value="2">2 {t('hours')}</option>
            <option value="3">3 {t('hours')}</option>
            <option value="4">4 {t('hours')}</option>
            <option value="5">{t('plusHours')}</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGeneratePlan} 
          disabled={isLoading || !examName.trim() || !examDate || !subjects.trim()} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('generatePlan')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyPlanner;
