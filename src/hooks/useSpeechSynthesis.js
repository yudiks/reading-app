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
  const animationFrameRef = useRef(null);

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

      const preferredVoicePatterns = [
        /Google US English/,
        /Microsoft David - English \(United States\)/,
        /Samantha/,
        /Alex/,
        /Google UK English/,
      ];

      const englishVoices = available.filter(v => v.lang.startsWith("en-"));
      const displayVoices = [];
      for (const pattern of preferredVoicePatterns) {
        const found = englishVoices.find(v => pattern.test(v.name));
        if (found && !displayVoices.some(v => v.voiceURI === found.voiceURI)) {
          displayVoices.push(found);
        }
      }

      const storedVoiceURI = safeGetLocalStorageItem(VOICE_KEY);
      const storedVoice = available.find(v => v.voiceURI === storedVoiceURI);

      if (storedVoice && !displayVoices.some(v => v.voiceURI === storedVoice.voiceURI)) {
        if (displayVoices.length >= 5) {
          displayVoices.pop();
        }
        displayVoices.unshift(storedVoice);
      }

      if (displayVoices.length < 5) {
        const otherEnglishVoices = englishVoices.filter(
          v => !displayVoices.some(dv => dv.voiceURI === v.voiceURI)
        );
        displayVoices.push(...otherEnglishVoices);
      }

      setVoices(displayVoices.slice(0, 5));

      const stored = safeGetLocalStorageItem(VOICE_KEY);
      if (stored && available.some(voice => voice.voiceURI === stored)) {
        setSelectedVoiceState(stored);
        return;
      }

      // Auto-select a higher-quality voice if available, prioritizing US English voices.
      let bestVoice = null;

      for (const pattern of preferredVoicePatterns) {
        bestVoice = englishVoices.find(v => pattern.test(v.name));
        if (bestVoice) break;
      }

      if (!bestVoice) {
        bestVoice = englishVoices.find(v => /Google/.test(v.name));
      }

      if (!bestVoice) {
        bestVoice = englishVoices.find(v => v.default);
      }

      if (bestVoice) {
        setSelectedVoiceState(bestVoice.voiceURI);
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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
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

    const voice = voices.find(item => item.voiceURI === selectedVoice);
    if (!voice && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = utterance.onend;
      utterance.onstart = () => setSpeaking(true);
      window.speechSynthesis.speak(utterance);
      return;
    } else if (!voice) {
      return;
    }

    const useManualHighlighting =
      (voice && voice.localService === false) || /Google US English/.test(voice.name);

    const isGoogleVoice = /Google US English/.test(voice.name);
    const sentences =
      isGoogleVoice && text
        ? text.match(/[^.!?]+[.!?]*\s*|[^.!?]+/g)?.filter(s => s.trim().length > 0) ?? []
        : text
        ? [text]
        : [];

    if (sentences.length === 0) {
      return;
    }

    let charIndexOffset = 0;
    let currentAnimationFrame = null;

    const utterances = sentences.map((sentence, i) => {
      const isLast = i === sentences.length - 1;
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 0.95;
      utterance.voice = voice;
      utterance.lang = voice.lang;

      let startTime = null;
      const CHARS_PER_SECOND = 12;
      const sentenceCharOffset = charIndexOffset;

      const manualHighlight = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const charIndexInSentence = Math.floor(elapsedTime * CHARS_PER_SECOND * (rate || 1));

        if (charIndexInSentence < sentence.length) {
          boundaryCallbackRef.current?.({
            charIndex: sentenceCharOffset + charIndexInSentence,
            elapsedTime
          });
          currentAnimationFrame = requestAnimationFrame(manualHighlight);
        } else if (currentAnimationFrame) {
          cancelAnimationFrame(currentAnimationFrame);
          currentAnimationFrame = null;
        }
      };

      utterance.onstart = () => {
        if (i === 0) {
          setSpeaking(true);
        }
        if (useManualHighlighting) {
          startTime = Date.now();
          if (currentAnimationFrame) cancelAnimationFrame(currentAnimationFrame);
          currentAnimationFrame = requestAnimationFrame(manualHighlight);
        }
      };

      utterance.onend = () => {
        if (useManualHighlighting && currentAnimationFrame) {
          cancelAnimationFrame(currentAnimationFrame);
          currentAnimationFrame = null;
        }
        if (isLast) {
          setSpeaking(false);
          utteranceRef.current = null;
        }
      };

      utterance.onerror = utterance.onend;

      utterance.onboundary = event => {
        if (!useManualHighlighting) {
          boundaryCallbackRef.current?.({
            ...event,
            charIndex: sentenceCharOffset + event.charIndex
          });
        }
      };

      charIndexOffset += sentence.length;
      return utterance;
    });

    utteranceRef.current = utterances;
    utterances.forEach(u => window.speechSynthesis.speak(u));
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
