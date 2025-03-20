
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface HomeworkAssistantProps {
  onSendMessage: (message: string) => void;
}

const HomeworkAssistant: React.FC<HomeworkAssistantProps> = ({ onSendMessage }) => {
  const [problem, setProblem] = useState('');
  const [subject, setSubject] = useState('math');
  const [assistMode, setAssistMode] = useState('stepByStep');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetHelp = () => {
    if (!problem.trim()) {
      toast.error('Please enter your homework problem');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (assistMode === 'stepByStep') {
      prompt = `I need help with this ${subject} problem: "${problem}". Please explain the solution step by step, showing all work and explaining the reasoning at each stage. Don't just give me the final answer.`;
    } else if (assistMode === 'hint') {
      prompt = `I'm working on this ${subject} problem: "${problem}". Please give me a hint or starting point without solving it completely. I want to try solving it myself.`;
    } else if (assistMode === 'check') {
      prompt = `I solved this ${subject} problem: "${problem}". Can you check if my approach and solution are correct? If there are any errors, please explain what went wrong and how to fix it.`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success('Getting homework help...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Homework Assistant
        </CardTitle>
        <CardDescription>
          Get help with your homework problems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject
          </label>
          <select
            id="subject"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="english">English</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="computer science">Computer Science</option>
          </select>
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium mb-1">
            Your Problem
          </label>
          <Textarea
            id="problem"
            placeholder="Type or paste your homework problem here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <label htmlFor="assistMode" className="block text-sm font-medium mb-1">
            Help Type
          </label>
          <select
            id="assistMode"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={assistMode}
            onChange={(e) => setAssistMode(e.target.value)}
          >
            <option value="stepByStep">Step-by-Step Solution</option>
            <option value="hint">Just a Hint</option>
            <option value="check">Check My Work</option>
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
              Processing...
            </>
          ) : (
            'Get Help'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HomeworkAssistant;
