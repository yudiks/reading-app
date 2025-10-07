import { useEffect, useMemo, useRef, useState } from "react";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis.js";

export default function ReadAloud({ passage, onBoundary, onSpeakingChange }) {
  const text = useMemo(() => passage.body.join("\n\n"), [passage.body]);
  const {
    voices,
    speak,
    stop,
    speaking,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    setBoundaryCallback
  } = useSpeechSynthesis(text, passage.keywords);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const rateRef = useRef(null);

  useEffect(() => {
    setSupportsSpeech("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    setBoundaryCallback(onBoundary ?? null);
    return () => setBoundaryCallback(null);
  }, [onBoundary, setBoundaryCallback]);

  useEffect(() => {
    onSpeakingChange?.(speaking);
  }, [speaking, onSpeakingChange]);

  const handleToggle = () => {
    if (speaking) {
      stop();
    } else {
      speak();
    }
  };

  if (!supportsSpeech) {
    return (
      <button className="button button--light" disabled>
        Speech not supported
      </button>
    );
  }

  return (
    <div className="read-aloud-controls" aria-label="Read aloud controls">
      <button
        onClick={handleToggle}
        className={`button button--light ${speaking ? "button--speaking" : ""}`}
      >
        {speaking ? "⏹ Stop" : "🔊 Read Aloud"}
      </button>
      <div className="read-aloud-settings" role="group" aria-label="Voice options">
        <label className="read-aloud-field">
          <span>Voice</span>
          <select
            value={selectedVoice ?? ""}
            onChange={event => setSelectedVoice(event.target.value || null)}
            disabled={!voices.length}
          >
            {voices.length ? (
              voices.map(voice => (
                <option value={voice.voiceURI} key={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            ) : (
              <option value="">Loading voices…</option>
            )}
          </select>
        </label>
        <label className="read-aloud-field">
          <span>Speed</span>
          <div className="read-aloud-slider">
            <input
              ref={rateRef}
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={rate}
              onChange={event => setRate(Number(event.target.value))}
            />
            <span className="read-aloud-value">{rate.toFixed(2)}×</span>
          </div>
        </label>
      </div>
    </div>
  );
}
