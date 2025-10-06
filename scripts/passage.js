import { passages } from "../config/passages.js";
import { populateProfile, countWords } from "./shared.js";

populateProfile({
  nameId: "learnerNameDetail",
  badgeListId: "badgeListDetail",
  pointsId: "pointsDetail",
  navId: "navLinksDetail"
});

const params = new URLSearchParams(window.location.search);
const passageId = params.get("id");

const article = document.getElementById("passageArticle");
const notFound = document.getElementById("notFound");
const passage = passages.find(item => item.id === passageId);

if (!passage) {
  if (notFound) {
    notFound.hidden = false;
  }
  if (article) {
    article.hidden = true;
  }
} else {
  const passageCategory = document.getElementById("passageCategory");
  const passageTitle = document.getElementById("passageTitle");
  const passageMeta = document.getElementById("passageMeta");
  const passageImage = document.getElementById("passageImage");
  const passageBody = document.getElementById("passageBody");
  const journalPrompts = document.getElementById("journalPrompts");
  const questionList = document.getElementById("questionList");
  const questScore = document.getElementById("questScore");
  const readAloudButton = document.getElementById("readAloud");
  const form = document.getElementById("questionForm");

  const bodyParagraphs = Array.isArray(passage.body)
    ? passage.body
    : typeof passage.body === "string" && passage.body.trim().length
      ? [passage.body]
      : [];
  const prompts = Array.isArray(passage.prompts) ? passage.prompts : [];
  const questions = Array.isArray(passage.questions) ? passage.questions : [];

  const wordCount = passage.wordCount ?? countWords(bodyParagraphs);
  const metaParts = [`${wordCount} words`, passage.readingLevel, `By ${passage.author}`].filter(Boolean);

  if (passageCategory) passageCategory.textContent = passage.categoryLabel ?? "";
  if (passageTitle) passageTitle.textContent = passage.title ?? "";
  if (passageMeta) passageMeta.textContent = metaParts.join(" • ");
  if (passageImage) {
    passageImage.src = passage.coverImage ?? "";
    passageImage.alt = passage.imageAlt ?? "";
  }
  if (passageBody) {
    passageBody.innerHTML = "";
  }

  if (passageBody) {
    if (bodyParagraphs.length) {
      bodyParagraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        passageBody.appendChild(p);
      });
    } else {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "This passage doesn't have any text yet. Check back soon for the full story.";
      passageBody.appendChild(empty);
    }
  }

  if (journalPrompts) {
    journalPrompts.innerHTML = "";
    prompts.forEach(prompt => {
      const li = document.createElement("li");
      li.textContent = prompt;
      journalPrompts.appendChild(li);
    });
  }

  if (questionList) {
    questionList.innerHTML = "";

    questions.forEach((question, index) => {
      const wrapper = document.createElement("fieldset");
      wrapper.className = "question-card";
      wrapper.innerHTML = `<legend>Question ${index + 1}</legend>`;

      const prompt = document.createElement("p");
      prompt.className = "question-card__prompt";
      prompt.textContent = question.prompt;
      wrapper.appendChild(prompt);

      const options = document.createElement("div");
      options.className = "question-card__options";

      question.options.forEach((optionText, optionIndex) => {
        const optionId = `${passage.id}-q${index}-o${optionIndex}`;
        const label = document.createElement("label");
        label.className = "option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `${passage.id}-q${index}`;
        input.value = optionIndex;
        input.id = optionId;

        label.appendChild(input);
        const span = document.createElement("span");
        span.textContent = optionText;
        label.appendChild(span);

        options.appendChild(label);
      });

      wrapper.appendChild(options);

      const explanation = document.createElement("p");
      explanation.className = "explanation";
      explanation.hidden = true;
      wrapper.appendChild(explanation);

      questionList.appendChild(wrapper);
    });
  }

  let activeSpeech = null;

  function stopSpeech() {
    if (window.speechSynthesis && activeSpeech) {
      window.speechSynthesis.cancel();
      activeSpeech = null;
      if (readAloudButton) {
        readAloudButton.classList.remove("button--speaking");
      }
    }
  }

  if (readAloudButton) {
    readAloudButton.addEventListener("click", () => {
      if (!window.speechSynthesis) {
        readAloudButton.disabled = true;
        readAloudButton.textContent = "Speech not supported";
        return;
      }

      if (activeSpeech) {
        stopSpeech();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(bodyParagraphs.join("\n\n"));
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        activeSpeech = null;
        readAloudButton.classList.remove("button--speaking");
      };
      activeSpeech = utterance;
      readAloudButton.classList.add("button--speaking");
      window.speechSynthesis.speak(utterance);
    });
  }

  window.addEventListener("unload", stopSpeech);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSpeech();
    }
  });

  if (form && questScore) {
    if (!questions.length) {
      form.hidden = true;
      questScore.textContent = "Questions for this passage are coming soon.";
      questScore.className = "score score--warning";
    } else {
      form.hidden = false;
      questScore.textContent = "";
      questScore.className = "score";
      form.addEventListener("submit", event => {
        event.preventDefault();
        stopSpeech();

        if (!questionList) {
          return;
        }

        let correctCount = 0;
        let answeredAll = true;

        questions.forEach((question, index) => {
          const inputs = Array.from(document.querySelectorAll(`input[name="${passage.id}-q${index}"]`));
          const selection = inputs.find(input => input.checked);
          const explanation = questionList.children[index].querySelector(".explanation");
          explanation.hidden = true;

          inputs.forEach(input => {
            const optionLabel = input.parentElement;
            optionLabel.classList.remove("option--correct", "option--incorrect");
          });

          if (!selection) {
            answeredAll = false;
            return;
          }

          if (Number(selection.value) === question.answer) {
            correctCount += 1;
            selection.parentElement.classList.add("option--correct");
          } else {
            selection.parentElement.classList.add("option--incorrect");
            const correctInput = inputs[question.answer];
            if (correctInput) {
              correctInput.parentElement.classList.add("option--correct");
            }
          }

          explanation.textContent = question.explanation;
          explanation.hidden = false;
        });

        if (!answeredAll) {
          questScore.textContent = "Answer every question before submitting.";
          questScore.className = "score score--warning";
          return;
        }

        if (correctCount === questions.length) {
          questScore.textContent = `Outstanding! You answered all ${correctCount} correctly.`;
          questScore.className = "score score--success";
        } else {
          questScore.textContent = `You got ${correctCount} of ${questions.length} correct. Give it another try!`;
          questScore.className = "score score--warning";
        }
      });
    }
  }

  if (article) {
    article.hidden = false;
  }
}
