
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Headphones, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AudioControlsProps {
  isTTSEnabled: boolean;
  useVoiceResponse: boolean;
  toggleTTS: () => void;
  setUseVoiceResponse: (value: boolean) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ 
  isTTSEnabled, 
  useVoiceResponse, 
  toggleTTS, 
  setUseVoiceResponse 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleTTS}
          className={`${isTTSEnabled ? 'bg-purple-100 dark:bg-purple-900' : ''}`}
        >
          {isTTSEnabled ? (
            <><Volume2 size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ चालू' : 'Voice On'}</>
          ) : (
            <><VolumeX size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ बंद' : 'Voice Off'}</>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setUseVoiceResponse(!useVoiceResponse)}
          className={`${useVoiceResponse ? 'bg-purple-100 dark:bg-purple-900' : ''}`}
        >
          {useVoiceResponse ? (
            <><Headphones size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ जवाब चालू' : 'Voice Response On'}</>
          ) : (
            <><BookOpen size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ जवाब बंद' : 'Voice Response Off'}</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AudioControls;
