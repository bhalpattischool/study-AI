
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface StudyPlannerProps {
  onSendMessage: (message: string) => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ onSendMessage }) => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('');
  const [dailyHours, setDailyHours] = useState('2');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = () => {
    if (!examName.trim() || !examDate.trim() || !subjects.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    const subjectList = subjects.split(',').map(s => s.trim()).join(', ');
    
    const prompt = `Create a detailed study plan for my ${examName} exam on ${examDate}. I need to study these subjects: ${subjectList}. I can dedicate ${dailyHours} hours daily for studying. Please include:
1. Daily schedule with specific topics
2. Weekly milestones
3. Recommended study techniques for each subject
4. When to schedule revision sessions
5. Short breaks and self-care recommendations`;
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success('Generating study plan...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Study Planner
        </CardTitle>
        <CardDescription>
          Get a personalized study schedule for your exams
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="examName" className="block text-sm font-medium mb-1">
            Exam Name
          </label>
          <Input
            id="examName"
            placeholder="E.g., Final Exams, NEET, JEE, etc."
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="examDate" className="block text-sm font-medium mb-1">
            Exam Date
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
            Subjects (comma separated)
          </label>
          <Input
            id="subjects"
            placeholder="E.g., Math, Physics, Chemistry"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="dailyHours" className="block text-sm font-medium mb-1">
            Hours Available Daily
          </label>
          <select
            id="dailyHours"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="5">5+ hours</option>
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
              Generating...
            </>
          ) : (
            'Generate Study Plan'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyPlanner;
