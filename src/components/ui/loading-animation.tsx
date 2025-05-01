
import React from "react";
import { cn } from "@/lib/utils";
import { Brain, Sparkles } from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
  className?: string;
}

const LoadingAnimation = ({
  message = "Study AI सोच रहा है...",
  className,
}: LoadingAnimationProps) => {
  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center p-6 my-4",
      className
    )}>
      <div className="relative">
        {/* Glassmorphism container */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/70 to-indigo-100/70 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Main circular container */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-full shadow-lg animate-pulse">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 border-4 border-t-transparent border-purple-300 dark:border-purple-600 rounded-full animate-spin"></div>
          
          {/* Rotating middle ring - opposite direction */}
          <div className="absolute inset-2 border-4 border-b-transparent border-indigo-300 dark:border-indigo-600 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Pulsing inner container */}
          <div className="flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-inner animate-pulse z-10">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
        </div>
        
        {/* Orbiting particles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]">
          <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-[spin_5s_linear_infinite_reverse]">
          <div className="w-4 h-4 bg-teal-400 dark:bg-teal-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite]">
          <div className="w-3 h-3 bg-pink-400 dark:bg-pink-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 animate-[spin_4.5s_linear_infinite_reverse]">
          <div className="w-4 h-4 bg-blue-400 dark:bg-blue-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Message with sparkle effect */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full shadow-md">
          <span className="text-purple-700 dark:text-purple-300 font-medium animate-pulse">{message}</span>
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
        </div>
      </div>
      
      {/* Loading dots */}
      <div className="mt-2 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-2 h-2 rounded-full bg-violet-500 dark:bg-violet-400 animate-[bounce_1s_infinite_400ms]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
