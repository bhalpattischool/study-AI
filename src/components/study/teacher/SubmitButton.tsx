
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubmitButtonProps {
  isProcessing: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isProcessing }) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          {t('processing')}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          {t('generateTeaching')}
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
