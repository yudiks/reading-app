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
  notFound.hidden = false;
  article.hidden = true;
  return;
}

const passageCategory = document.getElementById("passageCategory");
const passageTitle = document.getElementById("passageTitle");
const passageMeta = document.getElementById("passageMeta");
const passageImage = document.getElementById("passageImage");
const passageBody = document.getElementById("passageBody");
const journalPrompts = document.getElementById("journalPrompts");
const questionList = document.getElementById("questionList");
const questScore = document.getElementById("questScore");
const readAloudButton = document.getElementById("readAloud");

const wordCount = passage.wordCount ?? countWords(passage.body);
const metaParts = [`${wordCount} words`, passage.readingLevel, `By ${passage.author}`].filter(Boolean);

passageCategory.textContent = passage.categoryLabel;
passageTitle.textContent = passage.title;
passageMeta.textContent = metaParts.join(" • ");
passageImage.src = passage.coverImage;
passageImage.alt = passage.imageAlt;
passageBody.innerHTML = "";

passage.body.forEach(paragraph => {
  const p = document.createElement("p");
  p.textContent = paragraph;
  passageBody.appendChild(p);
});

journalPrompts.innerHTML = "";
passage.prompts.forEach(prompt => {
  const li = document.createElement("li");
  li.textContent = prompt;
  journalPrompts.appendChild(li);
});

questionList.innerHTML = "";

passage.questions.forEach((question, index) => {
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

let activeSpeech = null;

function stopSpeech() {
  if (window.speechSynthesis && activeSpeech) {
    window.speechSynthesis.cancel();
    activeSpeech = null;
    readAloudButton.classList.remove("button--speaking");
  }
}

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

  const utterance = new SpeechSynthesisUtterance(passage.body.join("\n\n"));
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

window.addEventListener("unload", stopSpeech);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSpeech();
  }
});

const form = document.getElementById("questionForm");
form.addEventListener("submit", event => {
  event.preventDefault();
  stopSpeech();

  let correctCount = 0;
  let answeredAll = true;

  passage.questions.forEach((question, index) => {
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

  if (correctCount === passage.questions.length) {
    questScore.textContent = `Outstanding! You answered all ${correctCount} correctly.`;
    questScore.className = "score score--success";
  } else {
    questScore.textContent = `You got ${correctCount} of ${passage.questions.length} correct. Give it another try!`;
    questScore.className = "score score--warning";
  }
});

article.hidden = false;
