import { learnerProfile } from "../config/site.js";

export function populateProfile({ nameId, badgeListId, pointsId, navId }) {
  const nameEl = document.getElementById(nameId);
  const badgeEl = document.getElementById(badgeListId);
  const pointsEl = document.getElementById(pointsId);
  const navEl = document.getElementById(navId);

  if (nameEl) {
    nameEl.textContent = learnerProfile.name;
  }

  if (badgeEl) {
    badgeEl.innerHTML = "";
    learnerProfile.badges.forEach(badge => {
      const li = document.createElement("li");
      li.className = "badge";
      li.innerHTML = `<span class="badge__icon">${badge.icon}</span><span>${badge.label}</span>`;
      badgeEl.appendChild(li);
    });
  }

  if (pointsEl) {
    pointsEl.textContent = `${formatNumber(learnerProfile.points.gems)} 💎 • ${formatNumber(learnerProfile.points.stars)} ⭐️`;
  }

  if (navEl) {
    navEl.innerHTML = "";
    learnerProfile.navigation.forEach(link => {
      const li = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.innerHTML = `<span class="icon">${link.icon}</span><span>${link.label}</span>`;
      li.appendChild(anchor);
      navEl.appendChild(li);
    });
  }
}

export function formatNumber(value) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function countWords(body) {
  const text = Array.isArray(body)
    ? body.join(" ")
    : typeof body === "string"
      ? body
      : "";

  return text
    .replace(/[^\w\s']/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function getLengthCategory(wordCount) {
  if (wordCount <= 220) return "short";
  if (wordCount <= 260) return "medium";
  return "long";
}

export function createExcerpt(text, limit = 160) {
  if (text.length <= limit) return text;
  const trimmed = text.slice(0, limit);
  return `${trimmed.slice(0, trimmed.lastIndexOf(" "))}…`;
}
