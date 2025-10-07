import { useMemo } from "react";

function isCorrect(question, value) {
  if (value == null) {
    return false;
  }

  switch (question.type) {
    case "multiple-choice":
      return Number(value) === Number(question.answer);
    case "fill-blank":
      return value.trim().toLowerCase() === question.answer.trim().toLowerCase();
    case "matching":
      return Object.keys(question.answer).every(key => {
        const expected = question.answer[key];
        return value?.[key] === expected;
      });
    case "sequence":
      return (
        Array.isArray(value) &&
        value.length === question.sequence.length &&
        value.every((step, index) => step === question.sequence[index])
      );
    case "short-answer":
      return question.acceptableAnswers
        .map(answer => answer.trim().toLowerCase())
        .includes(value.trim().toLowerCase());
    default:
      return false;
  }
}

export default function QuizSummary({ passage, questions, responses, submitted }) {
  const { correctCount, totalAnswered } = useMemo(() => {
    const counts = questions.reduce(
      (acc, question) => {
        const value = responses[question.id];
        if (value == null || (Array.isArray(value) && !value.length)) {
          return acc;
        }
        acc.totalAnswered += 1;
        if (isCorrect(question, value)) {
          acc.correctCount += 1;
        }
        return acc;
      },
      { correctCount: 0, totalAnswered: 0 }
    );

    return counts;
  }, [questions, responses]);

  if (!submitted) {
    return null;
  }

  const allCorrect = correctCount === questions.length;

  return (
    <div className={`score ${allCorrect ? "score--success" : "score--warning"}`}>
      {allCorrect ? (
        <>Outstanding! You mastered every challenge in “{passage.title}”.</>
      ) : (
        <>You solved {correctCount} of {questions.length}. Review the feedback above and try again!</>
      )}
    </div>
  );
}
