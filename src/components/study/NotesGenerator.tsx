
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotesGeneratorProps {
  onSendMessage: (message: string) => void;
}

const NotesGenerator: React.FC<NotesGeneratorProps> = ({ onSendMessage }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('comprehensive');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleGenerateNotes = () => {
    if (!topic.trim()) {
      toast.error(language === 'en' ? 'Please enter a topic for the notes' : 'कृपया नोट्स के लिए एक विषय दर्ज करें');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (language === 'en') {
      if (format === 'concise') {
        prompt = `Generate concise study notes on ${topic}. Include only the key points, important definitions, and core concepts. Format with bullet points for easy quick review.`;
      } else if (format === 'comprehensive') {
        prompt = `Generate comprehensive study notes on ${topic}. Include detailed explanations, examples, diagrams descriptions, and connections to related concepts. Format with clear headings and subheadings.`;
      } else if (format === 'exam') {
        prompt = `Generate exam-focused study notes on ${topic}. Highlight commonly tested concepts, include practice problems with solutions, and provide memory aids. Format with clear sections for different question types likely to appear.`;
      }
    } else {
      if (format === 'concise') {
        prompt = `${topic} पर संक्षिप्त अध्ययन नोट्स जनरेट करें। केवल मुख्य बिंदु, महत्वपूर्ण परिभाषाएँ और मूल अवधारणाएँ शामिल करें। आसान त्वरित समीक्षा के लिए बुलेट पॉइंट्स के साथ फॉर्मेट करें।`;
      } else if (format === 'comprehensive') {
        prompt = `${topic} पर व्यापक अध्ययन नोट्स जनरेट करें। विस्तृत स्पष्टीकरण, उदाहरण, आरेख विवरण और संबंधित अवधारणाओं के साथ कनेक्शन शामिल करें। स्पष्ट हेडिंग और सबहेडिंग के साथ फॉर्मेट करें।`;
      } else if (format === 'exam') {
        prompt = `${topic} पर परीक्षा-केंद्रित अध्ययन नोट्स जनरेट करें। आमतौर पर परीक्षा में पूछे जाने वाले अवधारणाओं को हाइलाइट करें, समाधान के साथ अभ्यास समस्याएं शामिल करें, और याददाश्त सहायता प्रदान करें। विभिन्न प्रकार के प्रश्नों के लिए स्पष्ट खंडों के साथ फॉर्मेट करें जो दिखाई दे सकते हैं।`;
      }
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(language === 'en' ? 'Generating notes...' : 'नोट्स जनरेट हो रहे हैं...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          {t('notesGenerator')}
        </CardTitle>
        <CardDescription>
          {t('notesDescription')}
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

        <div>
          <label htmlFor="format" className="block text-sm font-medium mb-1">
            {t('noteFormat')}
          </label>
          <select
            id="format"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="concise">{t('concise')}</option>
            <option value="comprehensive">{t('comprehensive')}</option>
            <option value="exam">{t('examFocused')}</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateNotes} 
          disabled={isLoading || !topic.trim()} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('generateNotes')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesGenerator;
