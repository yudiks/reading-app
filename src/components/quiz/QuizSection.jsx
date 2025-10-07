import { useMemo, useState } from "react";
import MultipleChoiceQuestion from "./types/MultipleChoiceQuestion.jsx";
import FillBlankQuestion from "./types/FillBlankQuestion.jsx";
import MatchingQuestion from "./types/MatchingQuestion.jsx";
import SequenceQuestion from "./types/SequenceQuestion.jsx";
import ShortAnswerQuestion from "./types/ShortAnswerQuestion.jsx";
import QuizSummary from "./QuizSummary.jsx";

const TYPE_COMPONENTS = {
  "multiple-choice": MultipleChoiceQuestion,
  "fill-blank": FillBlankQuestion,
  matching: MatchingQuestion,
  sequence: SequenceQuestion,
  "short-answer": ShortAnswerQuestion
};

export default function QuizSection({ passage }) {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => passage.questions ?? [], [passage.questions]);

  const handleChange = (questionId, value) => {
    setResponses(current => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setResponses({});
    setSubmitted(false);
  };

  return (
    <section className="quest" aria-labelledby="questHeading">
      <header className="quest__header">
        <div>
          <h3 id="questHeading">Comprehension Quest</h3>
          <p className="subtitle">Work through each challenge to earn full points.</p>
        </div>
      </header>
      <form className="quiz-form" onSubmit={handleSubmit}>
        {questions.map(question => {
          const Component = TYPE_COMPONENTS[question.type];
          if (!Component) {
            return null;
          }
          return (
            <Component
              key={question.id}
              question={question}
              value={responses[question.id]}
              onChange={value => handleChange(question.id, value)}
              submitted={submitted}
            />
          );
        })}
        <div className="quiz-actions">
          <button type="submit" className="button">
            {submitted ? "Retally Answers" : "Check My Answers"}
          </button>
          {submitted && (
            <button type="button" className="button button--secondary" onClick={resetQuiz}>
              Reset Quiz
            </button>
          )}
        </div>
      </form>
      <QuizSummary passage={passage} questions={questions} responses={responses} submitted={submitted} />
    </section>
  );
}
