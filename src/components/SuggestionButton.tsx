
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface SuggestionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({
  icon,
  label,
  onClick,
  className
}) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-gray-600">{label}</span>
    </button>
  );
};

export default SuggestionButton;
