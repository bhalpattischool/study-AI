
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
      {/* Main animated container */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Enhanced background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-fuchsia-300/30 to-indigo-400/30 dark:from-purple-600/20 dark:via-fuchsia-500/20 dark:to-indigo-600/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-tr from-violet-300/20 to-purple-400/20 dark:from-violet-500/10 dark:to-purple-600/10 rounded-full blur-xl animate-[pulse_3s_ease-in-out_0.5s_infinite]"></div>
        
        {/* Multiple colorful orbiting planets */}
        <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-400 dark:bg-pink-300 rounded-full shadow-lg shadow-pink-400/50 dark:shadow-pink-300/50 animate-pulse"></div>
        </div>
        <div className="absolute w-full h-full animate-[spin_15s_linear_infinite_reverse]">
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-5 h-5 bg-yellow-400 dark:bg-yellow-300 rounded-full shadow-lg shadow-yellow-400/50 dark:shadow-yellow-300/50 animate-pulse"></div>
        </div>
        <div className="absolute w-full h-full animate-[spin_12s_linear_infinite]">
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-teal-400 dark:bg-teal-300 rounded-full shadow-lg shadow-teal-400/50 dark:shadow-teal-300/50 animate-pulse"></div>
        </div>
        <div className="absolute w-full h-full animate-[spin_8s_linear_infinite_reverse]">
          <div className="absolute top-1/2 -left-5 -translate-y-1/2 w-4 h-4 bg-blue-400 dark:bg-blue-300 rounded-full shadow-lg shadow-blue-400/50 dark:shadow-blue-300/50 animate-pulse"></div>
        </div>
        
        {/* Floating stars with shimmer effects */}
        <div className="absolute top-0 left-1/4 animate-[float_4s_ease-in-out_infinite]">
          <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]" />
        </div>
        <div className="absolute bottom-2 right-1/4 animate-[float_3s_ease-in-out_0.5s_infinite_alternate]">
          <Star className="w-4 h-4 text-purple-300 fill-purple-300 animate-pulse drop-shadow-[0_0_8px_rgba(216,180,254,0.7)]" />
        </div>
        
        {/* Main circular container with enhanced depth and lighting */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.5)]">
          {/* Multiple rotating rings with glassmorphism effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/90 via-violet-500/90 to-indigo-500/90 dark:from-purple-600/90 dark:via-violet-600/90 dark:to-indigo-600/90 backdrop-blur-sm border border-white/20 dark:border-white/10 animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-t-transparent border-purple-300/80 dark:border-purple-500/80 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-2 border-4 border-r-transparent border-indigo-300/80 dark:border-indigo-500/80 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
          <div className="absolute inset-4 border-4 border-b-transparent border-violet-300/80 dark:border-violet-500/80 rounded-full animate-[spin_5s_linear_infinite]"></div>
          
          {/* Inner container with enhanced shadow and glow */}
          <div className="relative flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-inner animate-pulse z-10 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-indigo-100/20 dark:from-purple-500/20 dark:via-transparent dark:to-indigo-500/10 rounded-full"></div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-transparent dark:from-white/10 dark:to-transparent rounded-full animate-[spin_3s_linear_infinite] opacity-70"></div>
            
            {/* Central brain icon */}
            <Brain className="w-10 h-10 text-purple-600 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.5)] animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Enhanced message display with glassmorphism effect */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-full shadow-lg border border-white/20 dark:border-white/10 backdrop-blur-sm">
          <span className="text-purple-700 dark:text-purple-300 font-medium animate-pulse text-base">{message}</span>
          <Sparkles className="w-5 h-5 text-yellow-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      
      {/* Enhanced loading dots with better spacing and animation */}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.5)] animate-[bounce_0.8s_infinite_0ms]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-[bounce_0.8s_infinite_100ms]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-[bounce_0.8s_infinite_200ms]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 dark:from-fuchsia-400 dark:to-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)] animate-[bounce_0.8s_infinite_300ms]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
