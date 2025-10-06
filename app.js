const passages = [
  {
    id: "water-cycle",
    title: "The Busy Water Cycle",
    category: "science",
    categoryLabel: "Science",
    text: `Plink! A raindrop taps the window and begins a busy trip. When the sun warms puddles and lakes, some of the water changes into a light gas called water vapor. This step is evaporation. The vapor floats up into the cooler sky. There, the tiny pieces of water crowd together around specks of dust and form puffy clouds. This step is condensation.

When the cloud becomes heavy, gravity pulls the water back down. It may fall as rain, snow, or even hail. We call that precipitation. Some water runs along the surface and feeds rivers, while some sinks deep into the ground to water plants. Water that slips underground may take a secret path and slowly move back to lakes or oceans. The cycle keeps circling because the sun keeps shining.

The water you drink today might have been ice on a mountain long ago. It could later become steam from a tea kettle or a bead of dew on the grass. The water cycle never rests. Every drop finds a new job to do!`,
    vocabulary: [
      { word: "evaporation", definition: "water changing into vapor and rising into the air" },
      { word: "condensation", definition: "water vapor cooling and turning into tiny droplets" },
      { word: "precipitation", definition: "water falling from clouds as rain, snow, or hail" }
    ],
    questions: [
      {
        prompt: "What causes water to evaporate at the start of the cycle?",
        options: ["Warmth from the sun", "Cold wind from the clouds", "Fish swimming in the lake"],
        answer: 0,
        explanation: "Heat from the sun changes liquid water into water vapor."
      },
      {
        prompt: "Why do drops in a cloud clump together?",
        options: ["They stick to dust in the sky", "They like to form snowflakes", "They help planes fly"],
        answer: 0,
        explanation: "Water vapor cools and gathers around small pieces of dust."
      },
      {
        prompt: "Which sentence best shows that the water cycle repeats?",
        options: ["Water that slips underground may take a secret path.", "The cycle keeps circling because the sun keeps shining.", "The water you drink today might have been ice on a mountain."],
        answer: 1,
        explanation: "This sentence clearly says the cycle keeps circling."
      }
    ],
    prompts: [
      "Describe a time you saw rain or dew. Which part of the water cycle was it?",
      "Why is the sun an important helper in this story?"
    ]
  },
  {
    id: "soil-superheroes",
    title: "Soil Superheroes",
    category: "science",
    categoryLabel: "Science",
    text: `Put a scoop of soil in your hand. It might look like plain brown dirt, but it is busy with life. Soil is made of tiny pieces of rock, rotting leaves, air, and water. Wiggly earthworms tunnel through it. As they dig, they mix the soil and make spaces for water to flow. One earthworm can move a pile of soil as big as a small apple every day!

Under a microscope, you would see little helpers called bacteria and fungi. These decomposers break down old plant and animal parts. They turn them into nutrients that growing roots can slurp up. Some fungi form thin threads that wrap around plant roots. The threads act like straws. They pull water and minerals from far away.

Good soil also soaks up rain like a sponge. This keeps water near the surface so plants can sip it later. Without strong soil, plants would not grow tall. Trees would not shade playgrounds, and gardens would not feed families. Soil may seem quiet, but it is truly a superhero team working under our feet.`,
    vocabulary: [
      { word: "decomposers", definition: "living things that break down dead plants and animals" },
      { word: "nutrients", definition: "materials in soil and food that help living things grow" },
      { word: "fungi", definition: "tiny living things like molds and mushrooms" }
    ],
    questions: [
      {
        prompt: "How do earthworms help soil?",
        options: ["They keep the soil cold.", "They dig tunnels that mix soil and let water flow.", "They scare away insects."],
        answer: 1,
        explanation: "Earthworms dig tunnels that mix soil and make space for water."
      },
      {
        prompt: "What do decomposers do in the soil?",
        options: ["They fly around plants.", "They break down old leaves into nutrients.", "They shine light on roots."],
        answer: 1,
        explanation: "Decomposers turn old plant parts into nutrients plants can use."
      },
      {
        prompt: "Why does the author call soil a superhero team?",
        options: ["Because soil can fly.", "Because many helpers in soil work together for plants.", "Because soil wears a cape."],
        answer: 1,
        explanation: "Different parts of soil work together like a team of heroes."
      }
    ],
    prompts: [
      "Make a list of soil helpers you learned about. Which one surprised you?",
      "How would plants change if soil stopped soaking up rain?"
    ]
  },
  {
    id: "penguin-scientist",
    title: "Dr. Sylvia the Penguin Scientist",
    category: "biography",
    categoryLabel: "Biography",
    text: `Sylvia Earle grew up on the coast of New Jersey. She spent her days with wet feet and salty hair, exploring tide pools and watching waves. When she was 12, her family moved to Florida. Sylvia met even more sea creatures there. She decided she wanted to learn everything she could about the ocean.

As a young scientist, Sylvia dove beneath the surface again and again. She helped invent new diving suits that let scientists stay underwater longer. In 1970, she led a group of five women living in an underwater lab for two whole weeks. They studied how coral reefs and fish were changing. Sylvia later became the first woman to serve as chief scientist of the U.S. National Oceanic and Atmospheric Administration.

Today Sylvia is still exploring. She gives talks and writes books to celebrate ocean life. She also works to protect sea creatures from pollution and overfishing. Because of her brave dives and careful science, people call her "Her Deepness." Sylvia shows that curiosity and courage can help us care for the blue planet we call home.`,
    vocabulary: [
      { word: "coral reefs", definition: "underwater ridges built by tiny animals called coral" },
      { word: "pollution", definition: "harmful materials that dirty the air, water, or land" },
      { word: "overfishing", definition: "catching too many fish so the population cannot recover" }
    ],
    questions: [
      {
        prompt: "What did Sylvia Earle do in 1970 that was special?",
        options: ["She moved to New Jersey.", "She lived in an underwater lab for two weeks.", "She invented the first boat."],
        answer: 1,
        explanation: "She led a team of women scientists living underwater to study the ocean."
      },
      {
        prompt: "Why do people call Sylvia 'Her Deepness'?",
        options: ["She loves deep-fried food.", "She dives deep in the ocean to explore and learn.", "She only reads deep books."],
        answer: 1,
        explanation: "The nickname celebrates her deep dives and ocean discoveries."
      },
      {
        prompt: "Which idea shows how Sylvia helps the ocean today?",
        options: ["She gives talks and writes books to protect sea life.", "She moves away from the ocean.", "She stops other scientists from diving."],
        answer: 0,
        explanation: "She shares knowledge and works to protect sea creatures."
      }
    ],
    prompts: [
      "If you could ask Sylvia one question about the ocean, what would it be?",
      "How does Sylvia show bravery in her work?"
    ]
  },
  {
    id: "sky-patterns",
    title: "Patterns in the Sky",
    category: "science",
    categoryLabel: "Science",
    text: `Have you ever looked up and guessed the weather from the clouds? Meteorologists do that every day. A meteorologist is a scientist who studies the atmosphere. The sky gives this scientist clues. Big, puffy cumulus clouds can mean a sunny day. But when they grow tall and dark, they may turn into stormy cumulonimbus clouds.

Thin, wispy cirrus clouds look like feathers stretched across the blue. They float high and often show that warmer weather is on the way. Gray, blanket-like stratus clouds cover the sky and can bring a light, steady rain. Meteorologists also use tools like radar, satellites, and weather balloons. These tools measure wind, temperature, and moisture.

By watching cloud patterns and data, meteorologists make forecasts. A forecast is a smart guess about upcoming weather. Their predictions help pilots plan flights, farmers protect crops, and families pack umbrellas. The next time you see clouds, try to name their shapes. You might become a sky detective too!`,
    vocabulary: [
      { word: "meteorologist", definition: "a scientist who studies weather and the atmosphere" },
      { word: "forecast", definition: "a prediction about what the weather will be like" },
      { word: "cumulus", definition: "puffy white clouds that often mean fair weather" }
    ],
    questions: [
      {
        prompt: "What do meteorologists study?",
        options: ["The deepest oceans", "Weather and the atmosphere", "Ancient dinosaurs"],
        answer: 1,
        explanation: "Meteorologists focus on weather and the air around Earth."
      },
      {
        prompt: "Which cloud could mean a storm is coming?",
        options: ["Tall, dark cumulonimbus clouds", "Thin cirrus clouds", "Small cumulus clouds on a sunny day"],
        answer: 0,
        explanation: "Cumulonimbus clouds grow tall and can bring storms."
      },
      {
        prompt: "Why are forecasts helpful?",
        options: ["They make clouds disappear.", "They help people prepare for the weather.", "They change the temperature."],
        answer: 1,
        explanation: "Forecasts let people plan for different types of weather."
      }
    ],
    prompts: [
      "Which cloud names did you already know? Which are new?",
      "How could you practice making a forecast for your family?"
    ]
  },
  {
    id: "george-carver",
    title: "George Washington Carver's Curious Garden",
    category: "biography",
    categoryLabel: "Biography",
    text: `George Washington Carver was born in the 1860s and loved plants from the start. As a small child, he carried a little notebook to sketch flowers and trees. He asked so many questions that neighbors called him the Plant Doctor. George wanted to know how to help farms grow more food.

In college, George studied plants and soils. He learned that cotton crops were using up important nutrients. George suggested that farmers plant peanuts, sweet potatoes, and peas between cotton seasons. These crops returned nutrients to the soil. They also gave families new foods to eat and sell. George even created more than 100 peanut recipes and products, from paints to paper.

George Washington Carver shared his ideas around the country. He traveled in a wagon filled with tools and seeds. He showed farmers how to protect their soil and earn money. George believed that smart, kind science could make life better for everyone. His curious garden of ideas still grows today whenever someone tries a new way to care for the Earth.`,
    vocabulary: [
      { word: "nutrients", definition: "materials in soil that help plants stay healthy" },
      { word: "crops", definition: "plants that farmers grow for food or to sell" },
      { word: "soil", definition: "the top layer of earth where plants grow" }
    ],
    questions: [
      {
        prompt: "Why did George ask farmers to plant peanuts and peas?",
        options: ["They are fun to draw.", "They add nutrients back into the soil.", "They grow faster than cotton."],
        answer: 1,
        explanation: "These crops give nutrients back to the soil that cotton used up."
      },
      {
        prompt: "How did George share his ideas with others?",
        options: ["He kept them secret in a notebook.", "He traveled with tools and seeds to teach farmers.", "He only told his family."],
        answer: 1,
        explanation: "George traveled and taught farmers face to face."
      },
      {
        prompt: "What does the passage call George's science?",
        options: ["Smart and kind", "Fast and loud", "Wild and silly"],
        answer: 0,
        explanation: "The author says George believed smart, kind science could help everyone."
      }
    ],
    prompts: [
      "How did George Washington Carver help both plants and people?",
      "What new plant would you invent a recipe for?"
    ]
  }
];

const categoryNames = {
  science: "Science",
  biography: "Biography"
};

const categoryFilter = document.getElementById("categoryFilter");
const lengthFilter = document.getElementById("lengthFilter");
const toggleVocabularyButton = document.getElementById("toggleVocabulary");
const passageList = document.getElementById("passageList");
const passageTemplate = document.getElementById("passageTemplate");
const startReading = document.getElementById("startReading");

let showVocabulary = false;
let activeSpeech = null;

function countWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getLengthCategory(wordCount) {
  if (wordCount <= 220) return "short";
  if (wordCount <= 260) return "medium";
  return "long";
}

function populateCategoryFilter() {
  const unique = Array.from(new Set(passages.map(p => p.category)));
  unique.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = categoryNames[cat] ?? cat;
    categoryFilter.appendChild(option);
  });
}

function stopActiveSpeech() {
  if (window.speechSynthesis && activeSpeech) {
    window.speechSynthesis.cancel();
    activeSpeech = null;
  }
}

function handleSpeak(text, button) {
  if (!window.speechSynthesis) {
    button.disabled = true;
    button.title = "Speech not supported in this browser";
    return;
  }

  if (activeSpeech) {
    stopActiveSpeech();
    button.classList.remove("speaking");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.onend = () => {
    activeSpeech = null;
    button.classList.remove("speaking");
  };
  activeSpeech = utterance;
  button.classList.add("speaking");
  window.speechSynthesis.speak(utterance);
}

function renderPassage(passage) {
  const clone = passageTemplate.content.cloneNode(true);
  const article = clone.querySelector("article");
  article.dataset.category = passage.category;

  const wordCount = countWords(passage.text);
  article.dataset.wordCount = wordCount;
  article.dataset.length = getLengthCategory(wordCount);

  clone.querySelector(".pill--category").textContent = passage.categoryLabel;
  clone.querySelector("h2").textContent = passage.title;
  clone.querySelector(".meta").textContent = `${wordCount} words • ${passage.categoryLabel}`;
  const textElement = clone.querySelector(".text");
  textElement.textContent = passage.text;

  const vocabList = clone.querySelector(".vocabulary");
  passage.vocabulary.forEach(entry => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.word}:</strong> ${entry.definition}`;
    vocabList.appendChild(li);
  });
  if (showVocabulary) {
    vocabList.hidden = false;
  }

  const questionsList = clone.querySelector(".questions ol");
  passage.questions.forEach((question, index) => {
    const li = document.createElement("li");
    li.className = "question";

    const questionText = document.createElement("p");
    questionText.textContent = question.prompt;
    li.appendChild(questionText);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    question.options.forEach((optionText, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `${passage.id}-q${index}`;
      input.value = optionIndex;
      input.required = true;

      label.appendChild(input);
      const span = document.createElement("span");
      span.textContent = optionText;
      label.appendChild(span);
      optionsDiv.appendChild(label);
    });

    li.appendChild(optionsDiv);
    questionsList.appendChild(li);
  });

  const discussionList = clone.querySelector(".discussion ul");
  passage.prompts.forEach(prompt => {
    const li = document.createElement("li");
    li.textContent = prompt;
    discussionList.appendChild(li);
  });

  const checkButton = clone.querySelector(".check");
  const score = clone.querySelector(".score");
  checkButton.addEventListener("click", () => {
    const radioGroups = passage.questions.map((_, index) => (
      Array.from(article.querySelectorAll(`input[name="${passage.id}-q${index}"]`))
    ));

    const allAnswered = radioGroups.every(group => group.some(input => input.checked));
    if (!allAnswered) {
      score.textContent = "Answer every question before checking.";
      score.className = "score try-again";
      return;
    }

    let correct = 0;

    passage.questions.forEach((question, qIndex) => {
      const inputs = radioGroups[qIndex];
      inputs.forEach(input => {
        const optionLabel = input.parentElement;
        optionLabel.classList.remove("correct", "incorrect");
        if (Number(input.value) === question.answer && input.checked) {
          correct += 1;
          optionLabel.classList.add("correct");
        } else if (input.checked) {
          optionLabel.classList.add("incorrect");
        }
      });
    });

    if (correct === passage.questions.length) {
      score.textContent = `Great job! You got all ${correct} correct.`;
      score.className = "score correct";
    } else {
      score.textContent = `You got ${correct} of ${passage.questions.length} right. Try again!`;
      score.className = "score try-again";
    }
  });

  const speakButton = clone.querySelector(".speak");
  speakButton.addEventListener("click", () => handleSpeak(passage.text, speakButton));

  return clone;
}

function renderPassages() {
  passageList.innerHTML = "";
  passages.forEach(passage => {
    const node = renderPassage(passage);
    passageList.appendChild(node);
  });
  applyFilters();
}

function applyFilters() {
  const categoryValue = categoryFilter.value;
  const lengthValue = lengthFilter.value;

  const articles = passageList.querySelectorAll(".passage");
  articles.forEach(article => {
    const matchesCategory = categoryValue === "all" || article.dataset.category === categoryValue;
    const matchesLength = lengthValue === "all" || article.dataset.length === lengthValue;
    article.hidden = !(matchesCategory && matchesLength);
  });
}

categoryFilter.addEventListener("change", applyFilters);
lengthFilter.addEventListener("change", applyFilters);

toggleVocabularyButton.addEventListener("click", () => {
  showVocabulary = !showVocabulary;
  toggleVocabularyButton.classList.toggle("active", showVocabulary);
  toggleVocabularyButton.textContent = showVocabulary ? "Hide Vocabulary" : "Show Vocabulary";

  document.querySelectorAll(".vocabulary").forEach(list => {
    list.hidden = !showVocabulary;
  });
});

startReading.addEventListener("click", () => {
  const firstPassage = passageList.querySelector(".passage");
  if (firstPassage) {
    firstPassage.scrollIntoView({ behavior: "smooth" });
    firstPassage.focus({ preventScroll: true });
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopActiveSpeech();
  }
});

window.addEventListener("unload", stopActiveSpeech);

populateCategoryFilter();
renderPassages();
