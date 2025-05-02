
import { useState } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';

export const useTextToSpeech = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const { language } = useLanguage();

  // Simple toggle function that shows a toast notification
  const toggleTTS = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    
    if (newState) {
      toast.success(
        language === 'hi' 
          ? 'टेक्स्ट-टू-स्पीच सक्रिय किया गया' 
          : 'Text-to-speech activated'
      );
    } else {
      toast.info(
        language === 'hi' 
          ? 'टेक्स्ट-टू-स्पीच निष्क्रिय किया गया' 
          : 'Text-to-speech deactivated'
      );
    }
  };

  return {
    isTTSEnabled,
    toggleTTS
  };
};

export default useTextToSpeech;
