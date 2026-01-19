import { useState, useCallback, useRef, useEffect } from 'react';
import { Accent, PronunciationResult } from '@/types/learning';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const accentToLang: Record<Accent, string> = {
  american: 'en-US',
  british: 'en-GB',
  indian: 'en-IN',
  australian: 'en-AU',
};

export const useSpeechRecognition = (accent: Accent) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = accentToLang[accent];

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [accent]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError('Speech recognition not supported');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const checkPronunciation = useCallback((expected: string, spoken: string): PronunciationResult => {
    const normalizedExpected = expected.toLowerCase().trim().replace(/[.,!?]/g, '');
    const normalizedSpoken = spoken.toLowerCase().trim().replace(/[.,!?]/g, '');

    const similarity = calculateSimilarity(normalizedExpected, normalizedSpoken);
    const isCorrect = similarity > 0.8;

    let feedback = '';
    if (isCorrect) {
      if (similarity > 0.95) {
        feedback = 'Perfect! Your pronunciation is excellent! 🎉';
      } else {
        feedback = 'Great job! Almost perfect pronunciation! 👏';
      }
    } else if (similarity > 0.6) {
      feedback = 'Good try! Listen again and pay attention to the sounds. 🎯';
    } else {
      feedback = 'Let\'s practice more. Listen carefully to the correct pronunciation. 💪';
    }

    return {
      isCorrect,
      confidence: similarity,
      feedback,
      correctPronunciation: expected,
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    checkPronunciation,
    isSupported: typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix: number[][] = [];
  
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - matrix[s1.length][s2.length] / maxLen;
}
