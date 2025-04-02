
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  BrainCircuit, 
  FileText, 
  Calculator, 
  Clock, 
  Lightbulb, 
  GraduationCap, 
  BookOpenCheck
} from 'lucide-react';

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
      prompt: "Create concise study notes for me on the topic of ",
      color: "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
    },
    {
      id: 'study-plan',
      name: 'Study Plans',
      description: 'Get personalized study schedules',
      icon: <Calendar className="h-5 w-5" />,
      prompt: "Create a detailed study plan for me to prepare for ",
      color: "from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
    },
    {
      id: 'concept-explain',
      name: 'Concept Explainer',
      description: 'Explain complex concepts simply',
      icon: <BrainCircuit className="h-5 w-5" />,
      prompt: "Explain this concept to me like I'm a beginner: ",
      color: "from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30"
    },
    {
      id: 'quiz',
      name: 'Quiz Generator',
      description: 'Practice with custom quizzes',
      icon: <BookOpen className="h-5 w-5" />,
      prompt: "Generate a 5-question quiz with answers on the topic of ",
      color: "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30"
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Get step-by-step solutions',
      icon: <Calculator className="h-5 w-5" />,
      prompt: "Solve this problem step by step: ",
      color: "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30"
    },
    {
      id: 'revision',
      name: 'Quick Revision',
      description: 'Last-minute revision summaries',
      icon: <Clock className="h-5 w-5" />,
      prompt: "Create a quick revision summary of the key points for ",
      color: "from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/30"
    },
    {
      id: 'mindmap',
      name: 'Mind Maps',
      description: 'Visual concept organization',
      icon: <Lightbulb className="h-5 w-5" />,
      prompt: "Create a detailed mind map of the key concepts in ",
      color: "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
    },
    {
      id: 'teacher-explain',
      name: 'Teacher Mode',
      description: 'Get explained by a teacher',
      icon: <GraduationCap className="h-5 w-5" />,
      prompt: "Explain this to me as if you're my teacher: ",
      color: "from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30"
    },
    {
      id: 'memorization',
      name: 'Memorization Tips',
      description: 'Techniques to remember better',
      icon: <BookOpenCheck className="h-5 w-5" />,
      prompt: "Give me memorization techniques for studying ",
      color: "from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/30 dark:to-purple-900/30"
    }
  ];

  return (
    <div className="px-4 py-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
        <BookOpenCheck className="h-5 w-5" />
        Study Features
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="outline"
            className={`h-auto flex flex-col items-center justify-start p-4 border-purple-100 dark:border-purple-900 
            hover:border-purple-300 dark:hover:border-purple-700 transition-all bg-gradient-to-r ${feature.color} 
            hover:shadow-md group`}
            onClick={() => onFeatureSelect(feature.prompt)}
          >
            <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-2 
            text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform">
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
