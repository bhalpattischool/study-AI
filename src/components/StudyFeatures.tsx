
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, BrainCircuit, FileText, Calculator, Clock } from 'lucide-react';

interface StudyFeatureProps {
  onFeatureSelect: (feature: string) => void;
}

const StudyFeatures: React.FC<StudyFeatureProps> = ({ onFeatureSelect }) => {
  const features = [
    {
      id: 'notes',
      name: 'Smart Notes',
      description: 'Generate study notes on any topic',
      icon: <FileText className="h-5 w-5" />,
      prompt: "Create concise study notes for me on the topic of "
    },
    {
      id: 'study-plan',
      name: 'Study Plans',
      description: 'Get personalized study schedules',
      icon: <Calendar className="h-5 w-5" />,
      prompt: "Create a detailed study plan for me to prepare for "
    },
    {
      id: 'concept-explain',
      name: 'Concept Explainer',
      description: 'Explain complex concepts simply',
      icon: <BrainCircuit className="h-5 w-5" />,
      prompt: "Explain this concept to me like I'm a beginner: "
    },
    {
      id: 'quiz',
      name: 'Quiz Generator',
      description: 'Practice with custom quizzes',
      icon: <BookOpen className="h-5 w-5" />,
      prompt: "Generate a 5-question quiz with answers on the topic of "
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Get step-by-step solutions',
      icon: <Calculator className="h-5 w-5" />,
      prompt: "Solve this problem step by step: "
    },
    {
      id: 'revision',
      name: 'Quick Revision',
      description: 'Last-minute revision summaries',
      icon: <Clock className="h-5 w-5" />,
      prompt: "Create a quick revision summary of the key points for "
    }
  ];

  return (
    <div className="px-4 py-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-300">Study Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="outline"
            className="h-auto flex flex-col items-center justify-start p-4 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
            onClick={() => onFeatureSelect(feature.prompt)}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-2 text-purple-600 dark:text-purple-300">
              {feature.icon}
            </div>
            <span className="font-medium text-sm">{feature.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {feature.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StudyFeatures;
