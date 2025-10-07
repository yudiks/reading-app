import { useMemo } from "react";

export default function SequenceQuestion({ question, value = [], onChange, submitted }) {
  const positions = question.sequence.length;
  const working = [...Array(positions)].map((_, index) => value[index] ?? null);

  const scrambledSteps = useMemo(() => {
    const steps = [...question.sequence];
    for (let i = steps.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [steps[i], steps[j]] = [steps[j], steps[i]];
    }
    return steps;
  }, [question.sequence]);

  const handleSelect = (step, selectedPosition) => {
    if (submitted) {
      return;
    }
    const updated = [...working];
    const existingIndex = updated.findIndex(item => item === step);
    if (existingIndex !== -1) {
      updated[existingIndex] = null;
    }

    if (selectedPosition != null) {
      updated[selectedPosition] = step;
    }

    onChange(updated);
  };

  const isCorrect =
    submitted &&
    working.every((step, index) => step === question.sequence[index]);

  return (
    <fieldset className="question-card">
      <legend>{question.prompt}</legend>
      <div className="sequence-grid">
        {scrambledSteps.map(step => {
          const currentPosition = working.findIndex(item => item === step);
          return (
            <div key={step} className="sequence-row">
              <span>{step}</span>
              <select
                value={currentPosition >= 0 ? String(currentPosition + 1) : ""}
                onChange={event => {
                  const position = event.target.value ? Number(event.target.value) - 1 : null;
                  handleSelect(step, position);
                }}
                disabled={submitted}
              >
                <option value="">Position</option>
                {Array.from({ length: positions }, (_, index) => index + 1).map(number => (
                  <option value={number} key={`${step}-${number}`}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {submitted && (
        <p className={`explanation ${isCorrect ? "explanation--correct" : ""}`}>
          {isCorrect ? "Perfect order!" : `Correct order: ${question.sequence.join(" → ")}`}
        </p>
      )}
    </fieldset>
  );
}
