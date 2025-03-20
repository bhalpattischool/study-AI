
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizGeneratorProps {
  onSendMessage: (message: string) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onSendMessage }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuiz = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for the quiz');
      return;
    }

    setIsLoading(true);
    const prompt = `Generate a ${difficulty} difficulty quiz with ${numberOfQuestions} multiple-choice questions about ${topic}. For each question, provide 4 options, mark the correct answer, and include a brief explanation of why it's correct.`;
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success('Generating quiz...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-600" />
          Quiz Generator
        </CardTitle>
        <CardDescription>
          Create custom quizzes to test your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Topic
          </label>
          <Input
            id="topic"
            placeholder="Enter the topic (e.g., Photosynthesis, World War II)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full px-3 py-2 border rounded-md text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="questions" className="block text-sm font-medium mb-1">
              Number of Questions
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
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizGenerator;
