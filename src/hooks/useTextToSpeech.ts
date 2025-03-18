
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useTextToSpeech = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTextToSpeech = (content: string) => {
    // If TTS is disabled, don't do anything
    if (!isTTSEnabled) {
      toast.info("Text-to-speech is currently disabled");
      return;
    }
    
    try {
      // Stop any existing speech
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        toast.error("Failed to play speech");
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      toast.success("Playing audio");
    } catch (error) {
      console.error('TTS error:', error);
      toast.error("Text-to-speech is not available on this device");
    }
  };

  const toggleTTS = () => {
    // Cancel any ongoing speech when turning off
    if (isTTSEnabled && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    setIsTTSEnabled(!isTTSEnabled);
    toast.success(isTTSEnabled ? "Text-to-speech disabled" : "Text-to-speech enabled");
  };

  return {
    isTTSEnabled,
    isSpeaking,
    toggleTTS,
    handleTextToSpeech
  };
};
