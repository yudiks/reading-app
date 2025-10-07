const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const POINTS_PER_QUESTION = 10;
const SCHEDULE_STORAGE_KEY = "quest:schedule";
const PROGRESS_STORAGE_KEY = "quest:progress";
const COMPLETED_STORAGE_KEY = "quest:completed";

const isBrowser = () => typeof window !== "undefined";

function readStorage(key, fallback) {
  if (!isBrowser()) {
    return fallback;
  }
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Failed to read storage for ${key}`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  if (!isBrowser()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to persist storage for ${key}`, error);
  }
}

function getRandomPassageId(allPassages, excluded = []) {
  const exclusionSet = new Set(excluded.filter(Boolean));
  const pool = allPassages.filter(entry => !exclusionSet.has(entry.id));
  const source = pool.length ? pool : allPassages;
  if (!source.length) {
    return null;
  }
  const index = Math.floor(Math.random() * source.length);
  return source[index].id;
}

function normalizeSchedule(allPassages, stored) {
  const validIds = new Set(allPassages.map(entry => entry.id));
  const map = new Map(Array.isArray(stored) ? stored.map(entry => [entry.day, entry]) : []);
  const assigned = [];

  return DAYS.map(day => {
    const candidate = map.get(day);
    let passageId = candidate && validIds.has(candidate.passageId) ? candidate.passageId : null;
    if (!passageId || assigned.includes(passageId)) {
      passageId = getRandomPassageId(allPassages, assigned);
    }
    if (passageId) {
      assigned.push(passageId);
    }
    return { day, passageId };
  });
}

function normalizeProgress(allPassages, stored) {
  if (!stored || typeof stored !== "object") {
    return {};
  }
  const validIds = new Set(allPassages.map(entry => entry.id));
  return Object.entries(stored).reduce((accumulator, [passageId, value]) => {
    if (!validIds.has(passageId)) {
      return accumulator;
    }
    accumulator[passageId] = value;
    return accumulator;
  }, {});
}

function normalizeCompleted(allPassages, stored) {
  if (!Array.isArray(stored)) {
    return [];
  }
  const validIds = new Set(allPassages.map(entry => entry.id));
  return stored
    .filter(entry => entry && validIds.has(entry.passageId))
    .map(entry => ({ ...entry }));
}

function loadSchedule(allPassages) {
  const schedule = normalizeSchedule(allPassages, readStorage(SCHEDULE_STORAGE_KEY, null));
  writeStorage(SCHEDULE_STORAGE_KEY, schedule);
  return schedule;
}

function loadProgress(allPassages) {
  return normalizeProgress(allPassages, readStorage(PROGRESS_STORAGE_KEY, {}));
}

function loadCompleted(allPassages) {
  return normalizeCompleted(allPassages, readStorage(COMPLETED_STORAGE_KEY, []));
}

function saveSchedule(schedule) {
  writeStorage(SCHEDULE_STORAGE_KEY, schedule);
}

function saveCompleted(list) {
  writeStorage(COMPLETED_STORAGE_KEY, list);
}

function savePassageProgress(passageId, stats) {
  if (!passageId) {
    return;
  }
  const current = readStorage(PROGRESS_STORAGE_KEY, {});
  const normalized = {
    ...stats,
    points: stats.points ?? stats.correctCount * POINTS_PER_QUESTION,
    updatedAt: new Date().toISOString()
  };
  writeStorage(PROGRESS_STORAGE_KEY, {
    ...current,
    [passageId]: normalized
  });
  return normalized;
}

export {
  DAYS,
  POINTS_PER_QUESTION,
  loadSchedule,
  loadProgress,
  loadCompleted,
  saveSchedule,
  saveCompleted,
  savePassageProgress,
  getRandomPassageId
};
