import { useMemo } from "react";

export default function MatchingQuestion({ question, value = {}, onChange, submitted }) {
  const options = useMemo(() => {
    return Object.values(question.answer).sort((a, b) => a.localeCompare(b));
  }, [question.answer]);

  const handleChange = (leftId, selectedRight) => {
    if (submitted) {
      return;
    }
    onChange({ ...value, [leftId]: selectedRight });
  };

  const computeClass = leftId => {
    if (!submitted) return "option";
    const expected = question.answer[leftId];
    const given = value[leftId];
    if (expected === given) return "option option--correct";
    if (given) return "option option--incorrect";
    return "option";
  };

  return (
    <fieldset className="question-card">
      <legend>{question.prompt}</legend>
      <div className="matching-grid">
        {question.pairs.map(pair => (
          <div className="matching-row" key={pair.id}>
            <span className="matching-left">{pair.left}</span>
            <select
              className={computeClass(pair.id)}
              value={value[pair.id] ?? ""}
              onChange={event => handleChange(pair.id, event.target.value)}
              disabled={submitted}
            >
              <option value="" disabled>
                Select match
              </option>
              {options.map(option => (
                <option value={option} key={`${pair.id}-${option}`}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {submitted && (
        <p className="explanation">{question.explanation}</p>
      )}
    </fieldset>
  );
}
