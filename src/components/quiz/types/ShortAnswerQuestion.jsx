export default function ShortAnswerQuestion({ question, value = "", onChange, submitted }) {
  const normalized = value ?? "";
  const acceptable = question.acceptableAnswers.map(answer => answer.trim().toLowerCase());
  const isCorrect = submitted && acceptable.includes(normalized.trim().toLowerCase());

  return (
    <fieldset className="question-card">
      <legend>{question.prompt}</legend>
      <textarea
        className="textarea"
        rows={question.rows ?? 3}
        value={normalized}
        onChange={event => onChange(event.target.value)}
        placeholder={question.placeholder ?? "Write your response"}
      />
      {submitted && (
        <p className={`explanation ${isCorrect ? "explanation--correct" : "explanation--incorrect"}`}>
          {isCorrect ? "Wonderful reasoning!" : `Suggested answer: ${question.acceptableAnswers[0]}`}
        </p>
      )}
    </fieldset>
  );
}
