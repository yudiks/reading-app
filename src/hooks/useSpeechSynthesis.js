import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VOICE_KEY = "quest.readAloud.voice";
const RATE_KEY = "quest.readAloud.rate";

function safeGetLocalStorageItem(key) {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeSetLocalStorageItem(key, value) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // ignore
  }
}

export default function useSpeechSynthesis(text, keywords = []) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoiceState] = useState(null);
  const [rate, setRateState] = useState(() => {
    const stored = safeGetLocalStorageItem(RATE_KEY);
    return stored ? Number.parseFloat(stored) || 0.95 : 0.95;
  });
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const boundaryCallbackRef = useRef(null);

  const keywordPatterns = useMemo(() => {
    return (keywords || []).map((word, index) => ({
      word,
      className: `read-aloud-sentence keyword-${index}`
    }));
  }, [keywords]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const populate = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const stored = safeGetLocalStorageItem(VOICE_KEY);
      if (stored && available.some(voice => voice.voiceURI === stored)) {
        setSelectedVoiceState(stored);
      }
    };

    populate();

    if (!voices.length) {
      window.speechSynthesis.addEventListener("voiceschanged", populate, { once: true });
    }

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", populate);
    };
  }, []);

  useEffect(() => {
    safeSetLocalStorageItem(RATE_KEY, String(rate));
  }, [rate]);

  const setSelectedVoice = useCallback(value => {
    setSelectedVoiceState(value);
    if (value) {
      safeSetLocalStorageItem(VOICE_KEY, value);
    }
  }, []);

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 0.95;

    const voice = voices.find(item => item.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onend = () => {
      setSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onboundary = event => {
      boundaryCallbackRef.current?.(event);
    };

    utterance.onstart = () => setSpeaking(true);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [rate, selectedVoice, voices, stop, text]);

  useEffect(() => () => stop(), [stop]);

  const setBoundaryCallback = useCallback(callback => {
    boundaryCallbackRef.current = callback;
  }, []);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate: setRateState,
    speaking,
    speak,
    stop,
    setBoundaryCallback,
    keywordPatterns
  };
}
