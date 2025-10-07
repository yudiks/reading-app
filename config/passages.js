const passageFiles = [
  "marie-curie.json",
  "photosynthesis.json",
  "tortoise-hare.json",
  "leonardo.json",
  "water-cycle.json",
  "great-wall.json",
  "river-guardians.json",
  "clockwork-club.json",
  "mesa-skywatchers.json"
];

async function loadPassage(file) {
  const url = new URL(`./passages/${file}`, import.meta.url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load passage file: ${file}`);
  }
  return response.json();
}

export const passages = await Promise.all(passageFiles.map(loadPassage));
