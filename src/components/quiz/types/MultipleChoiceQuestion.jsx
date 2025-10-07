export default function MultipleChoiceQuestion({ question, value, onChange, submitted }) {
  return (
    <fieldset className="question-card">
      <legend>{question.prompt}</legend>
      <div className="question-card__options">
        {question.options.map((option, index) => {
          const isChecked = Number(value) === index;
          const isCorrect = submitted && question.answer === index;
          const isWrongSelection = submitted && isChecked && !isCorrect;

          return (
            <label
              className={`option ${isCorrect ? "option--correct" : ""} ${isWrongSelection ? "option--incorrect" : ""}`.trim()}
              key={option}
            >
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={isChecked}
                onChange={event => onChange(Number(event.target.value))}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {submitted && (
        <p className="explanation">{question.explanation}</p>
      )}
    </fieldset>
  );
}
