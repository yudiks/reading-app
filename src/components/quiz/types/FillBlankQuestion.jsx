export default function FillBlankQuestion({ question, value = "", onChange, submitted }) {
  const normalized = value ?? "";
  const isCorrect = submitted && normalized.trim().length && normalized.trim().toLowerCase() === question.answer.trim().toLowerCase();

  return (
    <fieldset className="question-card">
      <legend>{question.prompt}</legend>
      <input
        type="text"
        className="input"
        value={normalized}
        onChange={event => onChange(event.target.value)}
        placeholder={question.placeholder ?? "Type your answer"}
        disabled={submitted}
      />
      {submitted && (
        <p className={`explanation ${isCorrect ? "explanation--correct" : "explanation--incorrect"}`}>
          {isCorrect ? "Great job!" : `Correct answer: ${question.answer}`}
        </p>
      )}
    </fieldset>
  );
}
