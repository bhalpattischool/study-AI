
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useTextToSpeech = () => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(() => {
    // Get saved preference from localStorage, default to true if not set
    const savedPreference = localStorage.getItem('tts-enabled');
    return savedPreference === null ? true : savedPreference === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Try to get a saved voice preference
        const savedVoice = localStorage.getItem('tts-voice');
        if (savedVoice) {
          setSelectedVoice(savedVoice);
        } else {
          // Set a default voice - prefer a female English voice if available
          const defaultVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
          ) || voices[0];
          
          setSelectedVoice(defaultVoice.name);
          localStorage.setItem('tts-voice', defaultVoice.name);
        }
      }
    };

    // Load voices when they're available
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('tts-enabled', isTTSEnabled.toString());
  }, [isTTSEnabled]);

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
      
      // Clean up content - remove code blocks and markdown
      let cleanContent = content
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      
      // Set voice if selected
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
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

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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

  const setVoice = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem('tts-voice', voiceName);
  };

  return {
    isTTSEnabled,
    isSpeaking,
    toggleTTS,
    handleTextToSpeech,
    stopSpeaking,
    availableVoices,
    selectedVoice,
    setVoice
  };
};
