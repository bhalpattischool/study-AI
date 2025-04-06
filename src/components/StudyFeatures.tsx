
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
  BookOpenCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  BarChart4,
  Brain,
  Target,
  ListTodo,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    },
    // Added new features
    {
      id: 'flashcards',
      name: 'Flashcards Creator',
      description: 'Create digital flashcards',
      icon: <Zap className="h-5 w-5" />,
      prompt: "Create a set of digital flashcards for studying ",
      color: "from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30"
    },
    {
      id: 'exam-prep',
      name: 'Exam Preparation',
      description: 'Complete exam prep guide',
      icon: <CheckCircle2 className="h-5 w-5" />,
      prompt: "Prepare me for my upcoming exam on ",
      color: "from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30"
    },
    {
      id: 'progress-tracker',
      name: 'Progress Tracker',
      description: 'Track your learning journey',
      icon: <BarChart4 className="h-5 w-5" />,
      prompt: "Help me track my learning progress for ",
      color: "from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/30"
    },
    {
      id: 'brain-exercises',
      name: 'Brain Exercises',
      description: 'Mental workouts to improve focus',
      icon: <Brain className="h-5 w-5" />,
      prompt: "Give me brain exercises to improve my focus for studying ",
      color: "from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30"
    },
    {
      id: 'goal-setting',
      name: 'Study Goals',
      description: 'Set SMART study goals',
      icon: <Target className="h-5 w-5" />,
      prompt: "Help me set SMART study goals for ",
      color: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
    },
    {
      id: 'todo-list',
      name: 'Study To-Do List',
      description: 'Generate prioritized task lists',
      icon: <ListTodo className="h-5 w-5" />,
      prompt: "Create a prioritized study to-do list for ",
      color: "from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30"
    },
    {
      id: 'learning-history',
      name: 'Learning Journal',
      description: 'Document your learning journey',
      icon: <History className="h-5 w-5" />,
      prompt: "Help me create a learning journal for ",
      color: "from-sky-50 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/30"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="px-4 py-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
        <BookOpenCheck className="h-5 w-5" />
        <span>Study Features</span>
        <Sparkles className="h-4 w-4 text-amber-500 ml-1" />
      </h2>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature) => (
          <motion.div key={feature.id} variants={item}>
            <Button
              variant="outline"
              className={`h-auto w-full flex flex-col items-center justify-start p-4 border-purple-100 dark:border-purple-900 
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StudyFeatures;
