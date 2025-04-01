
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language } = useLanguage();

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
          // Set a default voice based on current language
          const defaultVoice = voices.find(voice => 
            voice.lang.includes(language === 'hi' ? 'hi' : 'en')
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
  }, [language]);

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
      toast.info(language === 'hi' ? "टेक्स्ट-टू-स्पीच वर्तमान में अक्षम है" : "Text-to-speech is currently disabled");
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
        .replace(/```[\s\S]*?```/g, language === 'hi' ? 'कोड ब्लॉक हटा दिया गया।' : 'Code block omitted.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      
      // Set appropriate language
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      // Set voice if selected
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      // Adjust speed based on language
      utterance.rate = language === 'hi' ? 0.9 : 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        toast.error(language === 'hi' ? "वाणी चलाने में विफल" : "Failed to play speech");
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      toast.success(language === 'hi' ? "ऑडियो चल रहा है" : "Playing audio");
    } catch (error) {
      console.error('TTS error:', error);
      toast.error(language === 'hi' ? "इस डिवाइस पर टेक्स्ट-टू-स्पीच उपलब्ध नहीं है" : "Text-to-speech is not available on this device");
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
    toast.success(isTTSEnabled 
      ? (language === 'hi' ? "टेक्स्ट-टू-स्पीच अक्षम किया गया" : "Text-to-speech disabled") 
      : (language === 'hi' ? "टेक्स्ट-टू-स्पीच सक्षम किया गया" : "Text-to-speech enabled")
    );
  };

  const setVoice = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem('tts-voice', voiceName);
  };

  // Find and suggest appropriate voice for current language
  const getRecommendedVoice = () => {
    const langCode = language === 'hi' ? 'hi' : 'en';
    return availableVoices.find(voice => voice.lang.includes(langCode))?.name || selectedVoice;
  };

  return {
    isTTSEnabled,
    isSpeaking,
    toggleTTS,
    handleTextToSpeech,
    stopSpeaking,
    availableVoices,
    selectedVoice,
    setVoice,
    getRecommendedVoice
  };
};
