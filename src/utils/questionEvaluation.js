export function isQuestionCorrect(question, value) {
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

export function hasQuestionResponse(question, value) {
  switch (question.type) {
    case "multiple-choice":
      return value != null;
    case "fill-blank":
    case "short-answer":
      return typeof value === "string" && value.trim().length > 0;
    case "matching":
      return (
        value != null &&
        Object.keys(question.answer).every(key => {
          const given = value[key];
          return typeof given === "string" && given.trim().length > 0;
        })
      );
    case "sequence":
      return (
        Array.isArray(value) &&
        value.length === question.sequence.length &&
        value.every(step => step != null)
      );
    default:
      return false;
  }
}
