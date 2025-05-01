
import React from "react";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, Star } from "lucide-react";

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
      "w-full flex flex-col items-center justify-center p-4 my-4",
      className
    )}>
      <div className="relative">
        {/* Enhanced glassmorphism background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/60 to-indigo-200/60 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-l from-pink-200/30 to-purple-200/30 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full blur-lg animate-[pulse_2s_ease-in-out_0.5s_infinite]"></div>
        
        {/* Main circular container with enhanced gradient */}
        <div className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 dark:from-purple-600 dark:via-violet-700 dark:to-indigo-800 rounded-full shadow-xl animate-pulse">
          {/* Multiple rotating rings with different speeds and directions */}
          <div className="absolute inset-0 border-4 border-t-transparent border-purple-300 dark:border-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-b-transparent border-indigo-300 dark:border-indigo-500 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          <div className="absolute inset-4 border-4 border-l-transparent border-violet-300 dark:border-violet-500 rounded-full animate-[spin_5s_linear_infinite]"></div>
          
          {/* Enhanced inner container with shadow and glow effect */}
          <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-inner animate-pulse z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 to-transparent dark:from-purple-500/20 rounded-full animate-spin"></div>
            <Brain className="w-9 h-9 text-purple-600 dark:text-purple-400 animate-pulse drop-shadow-lg" />
          </div>
        </div>
        
        {/* Enhanced orbiting particles with more variety and effects */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-full animate-[spin_5s_linear_infinite]">
          <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 animate-[spin_7s_linear_infinite_reverse]">
          <div className="w-4 h-4 bg-pink-400 dark:bg-pink-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-full animate-[spin_6s_linear_infinite]">
          <div className="w-5 h-5 bg-teal-400 dark:bg-teal-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 animate-[spin_4s_linear_infinite_reverse]">
          <div className="w-3.5 h-3.5 bg-blue-400 dark:bg-blue-300 rounded-full shadow-lg animate-pulse"></div>
        </div>
        
        {/* Additional floating stars for more visual interest */}
        <div className="absolute top-1/4 left-1/4 animate-[float_3s_ease-in-out_infinite_alternate]">
          <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-[float_4s_ease-in-out_infinite_alternate-reverse]">
          <Star className="w-3 h-3 text-purple-300 fill-purple-300 animate-pulse" />
        </div>
      </div>
      
      {/* Enhanced message display with improved styling */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-morphism bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-full shadow-lg border border-white/20 dark:border-white/10">
          <span className="text-purple-700 dark:text-purple-300 font-medium animate-pulse text-sm sm:text-base">{message}</span>
          <Sparkles className="w-4 h-4 text-yellow-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      
      {/* Enhanced loading dots with better spacing and animation */}
      <div className="mt-3 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 animate-[bounce_1s_infinite_150ms]"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 animate-[bounce_1s_infinite_300ms]"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 dark:from-fuchsia-400 dark:to-fuchsia-500 animate-[bounce_1s_infinite_450ms]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
