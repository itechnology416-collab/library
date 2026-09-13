// WKI Multilingual Academic Speech & Pronunciation Utility
export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const speakAcademicTerm = (
  text: string,
  lang: 'en' | 'or' | 'am' | 'ar',
  options: SpeechOptions = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser.');
      resolve(false);
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? (lang === 'ar' ? 0.85 : 0.95);
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Language mapping
    switch (lang) {
      case 'ar':
        utterance.lang = 'ar-SA';
        break;
      case 'am':
        utterance.lang = 'am-ET';
        break;
      case 'or':
        // Afaan Oromoo typically falls back to om-ET or en-US with phonetic cadence
        utterance.lang = 'om-ET';
        break;
      case 'en':
      default:
        utterance.lang = 'en-US';
        break;
    }

    // Try finding best matched voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    window.speechSynthesis.speak(utterance);
  });
};
