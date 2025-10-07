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
  const readAloudVoiceSelect = document.getElementById("readAloudVoice");
  const readAloudRateInput = document.getElementById("readAloudRate");
  const readAloudRateValue = document.getElementById("readAloudRateValue");
  const form = document.getElementById("questionForm");

  const bodyParagraphs = Array.isArray(passage.body)
    ? passage.body
    : typeof passage.body === "string" && passage.body.trim().length
      ? [passage.body]
      : [];
  const prompts = Array.isArray(passage.prompts) ? passage.prompts : [];
  const questions = Array.isArray(passage.questions) ? passage.questions : [];
  const keywords = Array.isArray(passage.keywords) ? passage.keywords : [];

  const underlineClasses = [
    "vocab-highlight vocab-highlight--1",
    "vocab-highlight vocab-highlight--2",
    "vocab-highlight vocab-highlight--3",
    "vocab-highlight vocab-highlight--4"
  ];

  const keywordPatterns = keywords
    .map((word, index) => ({
      word,
      className: underlineClasses[index % underlineClasses.length]
    }))
    .sort((a, b) => b.word.length - a.word.length)
    .map(entry => ({
      regex: new RegExp(`\\b${escapeRegExp(entry.word)}\\b`, "gi"),
      className: entry.className
    }));

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightText(text) {
    return keywordPatterns.reduce((current, pattern) => (
      current.replace(pattern.regex, match => `<span class="${pattern.className}">${match}</span>`)
    ), text);
  }

  const wordCount = passage.wordCount ?? countWords(bodyParagraphs);
  const metaParts = [`${wordCount} words`, passage.readingLevel, `By ${passage.author}`].filter(Boolean);

  const preferredVoiceNames = [
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Google UK English Female",
    "Google US English",
    "Samantha"
  ];

  const VOICE_STORAGE_KEY = "quest.readAloud.voice";
  const RATE_STORAGE_KEY = "quest.readAloud.rate";

  let availableVoices = [];
  const sentenceMetadata = [];
  const highlightWindowSize = 1;
  const highlightClass = "read-aloud-active";
  let activeSpeech = null;

  function loadVoices() {
    if (!("speechSynthesis" in window)) {
      populateVoiceSelect();
      return;
    }

    const updateVoices = () => {
      availableVoices = window.speechSynthesis.getVoices();
      populateVoiceSelect();
    };

    updateVoices();

    if (!availableVoices.length) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        updateVoices();
      }, { once: true });
    }
  }

  function splitIntoSentences(paragraph) {
    const trimmed = paragraph?.trim();
    if (!trimmed) {
      return [];
    }
    const matches = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g);
    return matches ? matches.map(sentence => sentence.trim()) : [trimmed];
  }

  function clearHighlights() {
    sentenceMetadata.forEach(entry => {
      entry.element.classList.remove(highlightClass);
    });
  }

  function applyHighlights(startIndex) {
    sentenceMetadata.forEach((entry, index) => {
      const withinWindow = index >= startIndex && index < startIndex + highlightWindowSize;
      entry.element.classList.toggle(highlightClass, withinWindow);
    });
  }

  function getStoredValue(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(key, value) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      // Ignore storage failures, e.g., private browsing.
    }
  }

  function formatRate(value) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      return "1";
    }
    return numberValue.toFixed(2).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
  }

  function updateRateDisplay(value) {
    if (readAloudRateValue) {
      readAloudRateValue.textContent = `${formatRate(value)}×`;
    }
  }

  function selectDefaultVoiceId() {
    const stored = getStoredValue(VOICE_STORAGE_KEY);
    if (stored && availableVoices.some(voice => voice.voiceURI === stored)) {
      return stored;
    }
    const preferred = availableVoices.find(voice => preferredVoiceNames.includes(voice.name));
    if (preferred) {
      return preferred.voiceURI;
    }
    const englishVoice = availableVoices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en"));
    if (englishVoice) {
      return englishVoice.voiceURI;
    }
    return availableVoices[0]?.voiceURI ?? "";
  }

  function populateVoiceSelect() {
    if (!readAloudVoiceSelect) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      readAloudVoiceSelect.innerHTML = "<option value=\"\">Speech unavailable</option>";
      readAloudVoiceSelect.disabled = true;
      return;
    }

    if (!availableVoices.length) {
      readAloudVoiceSelect.innerHTML = "<option value=\"\">Loading voices…</option>";
      readAloudVoiceSelect.disabled = true;
      return;
    }

    const filteredVoices = availableVoices.filter(voice => voice.lang && voice.lang.toLowerCase().startsWith("en"));
    const voicesToUse = filteredVoices.length ? filteredVoices : availableVoices;

    const selectedId = selectDefaultVoiceId();

    readAloudVoiceSelect.innerHTML = "";
    voicesToUse.forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = voice.lang ? `${voice.name} (${voice.lang})` : voice.name;
      if (voice.voiceURI === selectedId) {
        option.selected = true;
      }
      readAloudVoiceSelect.appendChild(option);
    });

    readAloudVoiceSelect.disabled = voicesToUse.length <= 1;

    if (!readAloudVoiceSelect.disabled && !readAloudVoiceSelect.value) {
      readAloudVoiceSelect.value = voicesToUse[0].voiceURI;
    }

    if (readAloudVoiceSelect.value) {
      setStoredValue(VOICE_STORAGE_KEY, readAloudVoiceSelect.value);
    }
  }

  function chooseVoice() {
    if (!availableVoices.length) {
      return null;
    }
    const selectedId = readAloudVoiceSelect?.value || selectDefaultVoiceId();
    return availableVoices.find(voice => voice.voiceURI === selectedId) || null;
  }

  loadVoices();

  if (readAloudRateInput) {
    if (!("speechSynthesis" in window)) {
      readAloudRateInput.disabled = true;
    }
    const storedRate = parseFloat(getStoredValue(RATE_STORAGE_KEY));
    const initialRate = Number.isFinite(storedRate) ? storedRate : Number.parseFloat(readAloudRateInput.value) || 0.95;
    readAloudRateInput.value = initialRate;
    updateRateDisplay(initialRate);

    readAloudRateInput.addEventListener("input", () => {
      updateRateDisplay(readAloudRateInput.value);
    });

    readAloudRateInput.addEventListener("change", () => {
      setStoredValue(RATE_STORAGE_KEY, readAloudRateInput.value);
    });
  } else {
    updateRateDisplay(1);
  }

  if (readAloudVoiceSelect) {
    readAloudVoiceSelect.addEventListener("change", () => {
      setStoredValue(VOICE_STORAGE_KEY, readAloudVoiceSelect.value);
      if (activeSpeech) {
        stopSpeech();
      }
    });
  }

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
        const sentences = splitIntoSentences(paragraph);
        if (!sentences.length) {
          p.textContent = paragraph;
          passageBody.appendChild(p);
          return;
        }

        sentences.forEach((sentenceText, sentenceIndex) => {
          if (!sentenceText) {
            return;
          }

          const span = document.createElement("span");
          span.className = "read-aloud-sentence";
          span.innerHTML = keywordPatterns.length ? highlightText(sentenceText) : sentenceText;

          sentenceMetadata.push({
            text: sentenceText,
            element: span,
            start: 0,
            end: 0
          });

          p.appendChild(span);

          if (sentenceIndex < sentences.length - 1) {
            p.appendChild(document.createTextNode(" "));
          }
        });

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

  const speechText = sentenceMetadata.map(entry => entry.text).join(" ");

  sentenceMetadata.forEach((entry, index) => {
    const previous = sentenceMetadata[index - 1];
    const startFrom = previous ? previous.end + 1 : 0;
    entry.start = startFrom;
    entry.end = startFrom + entry.text.length;
  });

  function stopSpeech() {
    if (window.speechSynthesis && activeSpeech) {
      window.speechSynthesis.cancel();
      activeSpeech = null;
      if (readAloudButton) {
        readAloudButton.classList.remove("button--speaking");
      }
      clearHighlights();
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

      if (!sentenceMetadata.length) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      const selectedVoice = chooseVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || utterance.lang;
      }
      const chosenRate = readAloudRateInput ? Number.parseFloat(readAloudRateInput.value) : 0.95;
      utterance.rate = Number.isFinite(chosenRate) ? chosenRate : 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 0.95;
      applyHighlights(0);
      utterance.onend = () => {
        activeSpeech = null;
        readAloudButton.classList.remove("button--speaking");
        clearHighlights();
      };
      utterance.onerror = () => {
        clearHighlights();
        activeSpeech = null;
        readAloudButton.classList.remove("button--speaking");
      };
      utterance.onboundary = event => {
        if (typeof event.charIndex !== "number") {
          return;
        }

        const index = sentenceMetadata.findIndex(entry => event.charIndex >= entry.start && event.charIndex < entry.end);
        if (index >= 0) {
          applyHighlights(index);
        }
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
