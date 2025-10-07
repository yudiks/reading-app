import { useEffect, useMemo, useState } from "react";
import MultipleChoiceQuestion from "./types/MultipleChoiceQuestion.jsx";
import FillBlankQuestion from "./types/FillBlankQuestion.jsx";
import MatchingQuestion from "./types/MatchingQuestion.jsx";
import SequenceQuestion from "./types/SequenceQuestion.jsx";
import ShortAnswerQuestion from "./types/ShortAnswerQuestion.jsx";
import QuizSummary from "./QuizSummary.jsx";
import { hasQuestionResponse, isQuestionCorrect } from "../../utils/questionEvaluation.js";

const TYPE_COMPONENTS = {
  "multiple-choice": MultipleChoiceQuestion,
  "fill-blank": FillBlankQuestion,
  matching: MatchingQuestion,
  sequence: SequenceQuestion,
  "short-answer": ShortAnswerQuestion
};

export default function QuizSection({ passage, onProgressChange }) {
  const [responses, setResponses] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  const questions = useMemo(() => passage.questions ?? [], [passage.questions]);

  useEffect(() => {
    setResponses({});
    setSubmissions({});
    setActiveIndex(0);
  }, [passage?.id]);

  useEffect(() => {
    if (activeIndex > 0 && activeIndex >= questions.length) {
      setActiveIndex(Math.max(questions.length - 1, 0));
    }
  }, [activeIndex, questions.length]);

  const handleChange = (questionId, value) => {
    setResponses(current => {
      if (submissions[questionId]) {
        return current;
      }
      return { ...current, [questionId]: value };
    });
  };

  const handleSubmit = question => {
    const questionId = question.id;
    if (submissions[questionId]) {
      return;
    }
    const value = responses[questionId];
    if (!hasQuestionResponse(question, value)) {
      return;
    }
    const correct = isQuestionCorrect(question, value);
    setSubmissions(current => ({ ...current, [questionId]: { correct } }));
  };

  const resetQuiz = () => {
    setResponses({});
    setSubmissions({});
    setActiveIndex(0);
  };

  const totalSubmitted = Object.keys(submissions).length;

  useEffect(() => {
    if (typeof onProgressChange !== "function") {
      return;
    }
    const totalQuestions = questions.length;
    const correctCount = Object.values(submissions).filter(entry => entry?.correct).length;
    onProgressChange({
      totalQuestions,
      totalSubmitted,
      correctCount,
      allSubmitted: totalQuestions > 0 && totalSubmitted === totalQuestions,
      allCorrect: totalQuestions > 0 && correctCount === totalQuestions
    });
  }, [onProgressChange, questions, submissions, totalSubmitted]);

  return (
    <section className="quest" aria-labelledby="questHeading">
      <header className="quest__header">
        <div>
          <h3 id="questHeading">Comprehension Quest</h3>
          <p className="subtitle">Work through each challenge to earn full points.</p>
        </div>
      </header>
      {questions.length === 0 ? (
        <p className="empty-state">No questions available for this passage yet. Check back soon!</p>
      ) : (
        <>
          <div className="quiz-tabs" role="tablist" aria-label="Comprehension questions">
            {questions.map((question, index) => {
              const submission = submissions[question.id];
              const isActive = index === activeIndex;
              const tabClass = ["quiz-tab"];
              if (isActive) {
                tabClass.push("quiz-tab--active");
              }
              if (submission) {
                tabClass.push(
                  submission.correct ? "quiz-tab--correct" : "quiz-tab--incorrect"
                );
              }
              return (
                <button
                  type="button"
                  key={question.id}
                  className={tabClass.join(" ")}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`question-panel-${question.id}`}
                  id={`question-tab-${question.id}`}
                  onClick={() => setActiveIndex(index)}
                >
                  Question {index + 1}
                </button>
              );
            })}
          </div>
          <div className="quiz-panels">
            {questions.map((question, index) => {
              const Component = TYPE_COMPONENTS[question.type];
              if (!Component) {
                return null;
              }
              const submission = submissions[question.id];
              const isActive = index === activeIndex;
              const value = responses[question.id];
              const canSubmit = hasQuestionResponse(question, value);

              return (
                <div
                  key={question.id}
                  role="tabpanel"
                  id={`question-panel-${question.id}`}
                  aria-labelledby={`question-tab-${question.id}`}
                  hidden={!isActive}
                  className="quiz-panel"
                >
                  <Component
                    question={question}
                    value={value}
                    onChange={newValue => handleChange(question.id, newValue)}
                    submitted={Boolean(submission)}
                  />
                  <div className="quiz-panel__footer">
                    {submission ? (
                      <p
                        className={`quiz-panel__status ${
                          submission.correct ? "quiz-panel__status--correct" : "quiz-panel__status--incorrect"
                        }`}
                        role="status"
                      >
                        {submission.correct
                          ? "Correct!"
                          : "Not quite. Review the explanation above before moving on."}
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleSubmit(question)}
                        disabled={!canSubmit}
                      >
                        Submit Answer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <QuizSummary
            passage={passage}
            questions={questions}
            submissions={submissions}
          />
          {totalSubmitted > 0 && (
            <div className="quiz-actions">
              <button type="button" className="button button--secondary" onClick={resetQuiz}>
                Reset Quiz
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
