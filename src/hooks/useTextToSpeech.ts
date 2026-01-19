import { useCallback, useState } from 'react';
import { Accent } from '@/types/learning';

const accentToVoice: Record<Accent, { lang: string; name?: string }> = {
  american: { lang: 'en-US', name: 'Google US English' },
  british: { lang: 'en-GB', name: 'Google UK English Female' },
  indian: { lang: 'en-IN', name: 'Google हिन्दी' },
  australian: { lang: 'en-AU', name: 'Google UK English Male' },
};

export const useTextToSpeech = (accent: Accent) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voiceConfig = accentToVoice[accent];
      
      utterance.lang = voiceConfig.lang;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (voice) => voice.lang.startsWith(voiceConfig.lang.split('-')[0])
      );
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [accent]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
};
