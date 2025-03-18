
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useTextToSpeech = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleTextToSpeech = (content: string) => {
    // If TTS is disabled, don't do anything
    if (!isTTSEnabled) {
      toast.info("Text-to-speech is currently disabled");
      return;
    }
    
    // Stop any existing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    toast.success("Playing audio");
  };

  const toggleTTS = () => {
    // Cancel any ongoing speech when turning off
    if (isTTSEnabled && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    setIsTTSEnabled(!isTTSEnabled);
    toast.success(isTTSEnabled ? "Text-to-speech disabled" : "Text-to-speech enabled");
  };

  return {
    isTTSEnabled,
    toggleTTS,
    handleTextToSpeech
  };
};
