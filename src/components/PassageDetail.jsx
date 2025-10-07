import { Link } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import ReadAloud from "./ReadAloud.jsx";
import QuizSection from "./quiz/QuizSection.jsx";
import { savePassageProgress } from "../utils/journal.js";

export default function PassageDetail({ passage }) {
  const [activeSentenceId, setActiveSentenceId] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const fallback = useMemo(
    () => (
      <div className="passage-not-found">
        <p className="empty-state">
          We couldn't find that passage. <Link to="/">Head back to your adventures.</Link>
        </p>
      </div>
    ),
    []
  );

  if (!passage) {
    return fallback;
  }

  const passageId = passage.id;

  const sentenceData = useMemo(() => {
    const regex = /[^.!?]+(?:[.!?]+|$)/g;
    let globalOffset = 0;
    const allSentences = [];
    const paragraphSentences = passage.body.map((paragraph, paragraphIndex) => {
      const matches = Array.from(paragraph.matchAll(regex));
      const sentencesInParagraph = matches
        .map((match, index) => {
          const raw = match[0];
          const trimmed = raw.trim();
          if (!trimmed) {
            return null;
          }
          const leadingSpaces = raw.indexOf(trimmed);
          const start = globalOffset + match.index + leadingSpaces;
          const end = start + trimmed.length;
          const id = `${paragraphIndex}-${index}`;
          const entry = { id, text: trimmed, start, end, paragraphIndex };
          allSentences.push(entry);
          return entry;
        })
        .filter(Boolean);
      globalOffset += paragraph.length;
      if (paragraphIndex < passage.body.length - 1) {
        globalOffset += 2; // account for \n\n between paragraphs
      }
      return sentencesInParagraph;
    });

    return { allSentences, paragraphSentences };
  }, [passage.body]);

  const highlightKeywords = useMemo(() => {
    if (!passage.keywords?.length) {
      return text => text;
    }

    const paletteSize = 4;
    const colorLookup = new Map();
    passage.keywords.forEach((keyword, index) => {
      colorLookup.set(keyword.toLowerCase(), ((index % paletteSize) + 1).toString());
    });

    const sorted = [...passage.keywords].sort((a, b) => b.length - a.length);

    return text =>
      sorted.reduce((current, keyword) => {
        const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "gi");
        const colorId = colorLookup.get(keyword.toLowerCase()) ?? "1";
        return current.replace(
          pattern,
          match => `<span class="vocab-highlight vocab-highlight--${colorId}">${match}</span>`
        );
      }, text);
  }, [passage.keywords]);

  const handleBoundary = useCallback(
    event => {
      if (typeof event.charIndex !== "number") {
        return;
      }
      const sentence = sentenceData.allSentences.find(
        entry => event.charIndex >= entry.start && event.charIndex < entry.end
      );
      if (sentence) {
        setActiveSentenceId(sentence.id);
      }
    },
    [sentenceData.allSentences]
  );

  const handleSpeakingChange = useCallback(value => {
    setSpeaking(value);
    if (!value) {
      setActiveSentenceId(null);
    }
  }, []);

  const handleQuizProgress = useCallback(
    stats => {
      if (!passageId) {
        return;
      }
      savePassageProgress(passageId, stats);
    },
    [passageId]
  );

  return (
    <article className="passage-article">
      <header className="passage-hero">
        <div className="passage-hero__text">
          <p className="eyebrow">{passage.categoryLabel}</p>
          <h2>{passage.title}</h2>
          <p className="meta">{`${passage.wordCount} words • ${passage.readingLevel} • By ${passage.author}`}</p>
        </div>
        <ReadAloud passage={passage} onBoundary={handleBoundary} onSpeakingChange={handleSpeakingChange} />
      </header>
      <img src={passage.coverImage} alt={passage.imageAlt} className="passage-hero__image" />
      <section className="passage-body">
        {sentenceData.paragraphSentences.map((sentences, index) => (
          <p key={index}>
            {sentences.map((sentence, sentenceIndex) => (
              <span key={sentence.id} className="sentence-wrapper">
                <span
                  className={`read-aloud-sentence ${
                    speaking && activeSentenceId === sentence.id ? "read-aloud-active" : ""
                  }`.trim()}
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(sentence.text) }}
                />
                {sentenceIndex < sentences.length - 1 ? " " : null}
              </span>
            ))}
          </p>
        ))}
      </section>
      <QuizSection passage={passage} onProgressChange={handleQuizProgress} />
    </article>
  );
}
