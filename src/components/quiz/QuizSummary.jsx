import { useMemo } from "react";

export default function QuizSummary({ passage, questions, submissions }) {
  const { correctCount, totalSubmitted } = useMemo(() => {
    return questions.reduce(
      (accumulator, question) => {
        const submission = submissions[question.id];
        if (!submission) {
          return accumulator;
        }
        accumulator.totalSubmitted += 1;
        if (submission.correct) {
          accumulator.correctCount += 1;
        }
        return accumulator;
      },
      { correctCount: 0, totalSubmitted: 0 }
    );
  }, [questions, submissions]);

  if (totalSubmitted === 0) {
    return null;
  }

  const allCompleted = totalSubmitted === questions.length;
  const allCorrect = allCompleted && correctCount === questions.length;
  const scoreClass = ["score"];

  if (allCorrect) {
    scoreClass.push("score--success");
  } else if (allCompleted) {
    scoreClass.push("score--warning");
  } else {
    scoreClass.push("score--info");
  }

  const remaining = questions.length - totalSubmitted;

  return (
    <div className={scoreClass.join(" ")}>
      {allCompleted ? (
        allCorrect ? (
          <>Outstanding! You mastered every challenge in “{passage.title}”.</>
        ) : (
          <>
            You solved {correctCount} of {questions.length}. Review the feedback above and try again!
          </>
        )
      ) : (
        <>
          Score: {correctCount} of {questions.length}. {remaining}{" "}
          {remaining === 1 ? "question" : "questions"} to go—keep it up!
        </>
      )}
    </div>
  );
}
