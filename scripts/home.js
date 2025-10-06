import { passages } from "../config/passages.js";
import { populateProfile, countWords, getLengthCategory, createExcerpt } from "./shared.js";

const categoryFilter = document.getElementById("categoryFilter");
const lengthFilter = document.getElementById("lengthFilter");
const passageGrid = document.getElementById("passageGrid");

populateProfile({
  nameId: "learnerName",
  badgeListId: "badgeList",
  pointsId: "points",
  navId: "navLinks"
});

const uniqueCategories = Array.from(new Set(passages.map(p => p.category)));
uniqueCategories.forEach(category => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = passages.find(p => p.category === category)?.categoryLabel ?? category;
  categoryFilter.appendChild(option);
});

function renderGrid() {
  passageGrid.innerHTML = "";

  const categoryValue = categoryFilter.value;
  const lengthValue = lengthFilter.value;

  passages.forEach(passage => {
    const wordCount = passage.wordCount ?? countWords(passage.body);
    const lengthCategory = getLengthCategory(wordCount);

    const matchesCategory = categoryValue === "all" || passage.category === categoryValue;
    const matchesLength = lengthValue === "all" || lengthCategory === lengthValue;

    if (!matchesCategory || !matchesLength) {
      return;
    }

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.category = passage.category;
    card.dataset.length = lengthCategory;

    card.innerHTML = `
      <a class="card__link" href="passage.html?id=${encodeURIComponent(passage.id)}">
        <figure class="card__figure">
          <img src="${passage.coverImage}" alt="${passage.imageAlt}" loading="lazy" />
          <figcaption class="pill">${passage.categoryLabel}</figcaption>
        </figure>
        <div class="card__body">
          <h3>${passage.title}</h3>
          <p class="card__summary">${createExcerpt(passage.summary)}</p>
          <p class="card__meta">${wordCount} words • ${passage.readingLevel}</p>
        </div>
      </a>
    `;

    passageGrid.appendChild(card);
  });

  if (!passageGrid.children.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No adventures match those filters yet.";
    passageGrid.appendChild(empty);
  }
}

categoryFilter.addEventListener("change", renderGrid);
lengthFilter.addEventListener("change", renderGrid);

renderGrid();
