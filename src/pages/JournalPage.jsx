import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import passages from "../data/passages.js";
import {
  POINTS_PER_QUESTION,
  loadSchedule,
  loadProgress,
  loadCompleted,
  saveSchedule,
  saveCompleted,
  getRandomPassageId
} from "../utils/journal.js";

const isBrowser = () => typeof window !== "undefined";

export default function JournalPage() {
  const allPassages = useMemo(() => passages, []);
  const passageLookup = useMemo(() => {
    const map = new Map();
    allPassages.forEach(entry => {
      map.set(entry.id, entry);
    });
    return map;
  }, [allPassages]);

  const [schedule, setSchedule] = useState(() => loadSchedule(allPassages));
  const [progressMap, setProgressMap] = useState(() => loadProgress(allPassages));
  const [completedPassages, setCompletedPassages] = useState(() => loadCompleted(allPassages));

  useEffect(() => {
    saveSchedule(schedule);
  }, [schedule]);

  useEffect(() => {
    saveCompleted(completedPassages);
  }, [completedPassages]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    const handleStorage = event => {
      if (event.key === "quest:progress") {
        setProgressMap(loadProgress(allPassages));
      }
      if (event.key === "quest:schedule") {
        setSchedule(loadSchedule(allPassages));
      }
      if (event.key === "quest:completed") {
        setCompletedPassages(loadCompleted(allPassages));
      }
    };

    const handleFocus = () => {
      setProgressMap(loadProgress(allPassages));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [allPassages]);

  const activeSlot = useMemo(() => schedule.find(entry => entry.passageId), [schedule]);
  const activePassage = activeSlot ? passageLookup.get(activeSlot.passageId) : null;

  const refreshProgress = useCallback(() => {
    setProgressMap(loadProgress(allPassages));
  }, [allPassages]);

  const handleMarkDone = useCallback(
    slot => {
      const slotProgress = progressMap[slot.passageId];
      const slotPassage = passageLookup.get(slot.passageId);
      if (!slotProgress?.allSubmitted || !slotPassage) {
        return;
      }

      const points =
        slotProgress.points ?? (slotProgress.correctCount ?? 0) * POINTS_PER_QUESTION;
      const completionRecord = {
        passageId: slot.passageId,
        title: slotPassage.title,
        points,
        day: slot.day,
        completedAt: new Date().toISOString()
      };

      setCompletedPassages(current => [completionRecord, ...current].slice(0, 20));

      setSchedule(current => {
        const otherIds = current
          .filter(entry => entry.day !== slot.day)
          .map(entry => entry.passageId)
          .filter(Boolean);
        const futureCompletedIds = completedPassages
          .map(entry => entry.passageId)
          .concat(slot.passageId);
        const replacementId = getRandomPassageId(allPassages, [
          ...otherIds,
          ...futureCompletedIds
        ]);

        return current.map(entry => {
          if (entry.day !== slot.day) {
            return entry;
          }
          if (!replacementId) {
            return entry;
          }
          return { day: slot.day, passageId: replacementId };
        });
      });

      refreshProgress();
    },
    [allPassages, completedPassages, passageLookup, progressMap, refreshProgress]
  );

  return (
    <div className="page journal-page">
      <header className="hero hero--board">
        <div>
          <p className="eyebrow">Explorer's Log</p>
          <h2>Weekly Journal Planner</h2>
          <p className="subtitle">Track your reading quests and mark passages as complete.</p>
        </div>
      </header>
      <section className="journal" aria-labelledby="journalHeading">
        <h3 id="journalHeading">My Explorer's Journal</h3>
        <div className="journal-panels">
          <div className="journal-panel journal-panel--plan">
            <h4 className="journal-subheading">Weekly Reading Plan</h4>
            <div className="journal-schedule" role="list">
              {schedule.map(slot => {
                const slotPassage = passageLookup.get(slot.passageId);
                const slotProgress = progressMap[slot.passageId];
                const totalQuestions =
                  slotProgress?.totalQuestions ?? slotPassage?.questions?.length ?? 0;
                const answered = slotProgress?.totalSubmitted ?? 0;
                const points =
                  slotProgress?.points ??
                  (slotProgress?.correctCount ?? 0) * POINTS_PER_QUESTION;
                const canMarkDone = Boolean(slotProgress?.allSubmitted);
                const statusText = canMarkDone
                  ? slotProgress.allCorrect
                    ? "All answers correct!"
                    : "Quiz submitted"
                  : "Complete the quiz to unlock";
                const slotClass = ["journal-slot"];
                if (canMarkDone) {
                  slotClass.push("journal-slot--ready");
                }

                return (
                  <div key={slot.day} className={slotClass.join(" ")} role="listitem">
                    <header className="journal-slot__header">
                      <span className="journal-slot__day">{slot.day}</span>
                      <span className="journal-slot__points">{points} pts</span>
                    </header>
                    <p className="journal-slot__title">
                      {slotPassage ? slotPassage.title : "Passage coming soon"}
                    </p>
                    <p className="journal-slot__meta">
                      {answered}/{totalQuestions} questions answered
                    </p>
                    <p
                      className={`journal-slot__status ${
                        canMarkDone ? "journal-slot__status--ready" : "journal-slot__status--locked"
                      }`}
                    >
                      {statusText}
                    </p>
                    <div className="journal-slot__actions">
                      <Link
                        to={slotPassage ? `/passages/${slotPassage.id}` : "/"}
                        className="button button--light journal-slot__button"
                      >
                        Read
                      </Link>
                      <button
                        type="button"
                        className="button journal-slot__button"
                        onClick={() => handleMarkDone(slot)}
                        disabled={!canMarkDone}
                      >
                        Mark as done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="journal-panel journal-panel--completed">
            <h4 className="journal-subheading">Completed Passages</h4>
            {completedPassages.length === 0 ? (
              <p className="empty-state">No passages completed yet. Ready when you are!</p>
            ) : (
              <ul className="journal-completed__list">
                {completedPassages.map(entry => (
                  <li key={`${entry.passageId}-${entry.completedAt}`}>
                    <span className="journal-completed__title">{entry.title}</span>
                    <span className="journal-completed__meta">
                      {entry.points} pts • {entry.day}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
