
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trophy, Star, Flame, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface MotivationSystemProps {
  onSendMessage: (message: string) => void;
}

const MotivationSystem: React.FC<MotivationSystemProps> = ({ onSendMessage }) => {
  const motivationalPrompts = [
    {
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      title: "Study Motivation",
      description: "Get personalized motivation for your studies",
      prompt: "I'm feeling unmotivated to study. Can you give me personalized motivation and strategies to stay focused and productive? Include some inspirational quotes and practical tips."
    },
    {
      icon: <Target className="h-5 w-5 text-red-500" />,
      title: "Exam Preparation",
      description: "Mental preparation for upcoming exams",
      prompt: "I have an important exam coming up and I'm feeling anxious. Can you provide me with mental preparation strategies, anxiety management techniques, and a last-minute study plan to boost my confidence?"
    },
    {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      title: "Overcome Procrastination",
      description: "Tips to beat procrastination",
      prompt: "I keep procrastinating on my studies. Can you help me understand why I might be procrastinating and suggest effective techniques to overcome it?"
    },
    {
      icon: <Star className="h-5 w-5 text-purple-500" />,
      title: "Daily Affirmations",
      description: "Positive affirmations for success",
      prompt: "Can you create a set of daily positive affirmations specifically for students to boost confidence and maintain focus on academic goals?"
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Study Energy Boost",
      description: "Quick tips to regain energy",
      prompt: "I'm feeling mentally exhausted from studying. Can you suggest some quick mental and physical exercises to regain energy and focus without taking a long break?"
    }
  ];

  const handleSendMotivation = (prompt: string) => {
    onSendMessage(prompt);
    toast.success('Getting motivation tips...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Motivation System
        </CardTitle>
        <CardDescription>
          Get personalized motivation and study strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {motivationalPrompts.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-center justify-start p-4 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              onClick={() => handleSendMotivation(item.prompt)}
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {item.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationSystem;
