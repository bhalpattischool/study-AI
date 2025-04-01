
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface StudentQuestionProps {
  isListening: boolean;
  toggleListening: () => void;
  sendStudentQuestion: () => void;
}

const StudentQuestion: React.FC<StudentQuestionProps> = ({ 
  isListening, 
  toggleListening, 
  sendStudentQuestion 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="mt-6 border-t border-purple-100 dark:border-purple-800 pt-4">
      <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
        {language === 'hi' ? 'छात्र प्रश्नोत्तरी' : 'Student Questions'}
      </h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        {language === 'hi' ? 'अपना प्रश्न पूछें जैसे आप कक्षा में हैं' : 'Ask your question as if you are in class'}
      </p>
      
      <div className="flex gap-2">
        <Input
          id="student-question"
          placeholder={language === 'hi' ? "आपका प्रश्न यहां टाइप करें या बोलें..." : "Type or speak your question here..."}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={toggleListening}
          className={`${isListening ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 animate-pulse' : ''}`}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        <Button
          type="button"
          onClick={sendStudentQuestion}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <MessageSquare size={16} />
        </Button>
      </div>
    </div>
  );
};

export default StudentQuestion;
