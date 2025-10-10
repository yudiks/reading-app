# Quest Comprehend – React Edition

Quest Comprehend is now a modular React app powered by Vite. It offers a reading hub for 3rd-grade learners, complete with longer passages, enriched question types, sentence-level read-aloud highlighting, and illustrator-style cover art served from local SVG assets.

## Getting Started
```bash
npm install
npm run dev
```
The development server opens automatically. Use `npm run build` to create a production bundle and `npm run preview` to test the static build locally.

## Project Structure
```
.
├── index.html            # Vite entry point
├── package.json          # Scripts and dependencies
├── src/
│   ├── App.jsx           # Route shell
│   ├── main.jsx          # React entry with router + global styles
│   ├── assets/           # Local SVG covers and avatar
│   ├── components/       # Layout, read-aloud controls, quiz widgets
│   ├── data/             # Passage data (per-file JSON + aggregator)
│   ├── hooks/            # Speech synthesis hook with voice + rate controls
│   ├── pages/            # List and detail screens
│   ├── styles/global.css # Adapted dark theme + new quiz/read-aloud styles
│   └── utils/            # Filtering helpers and data hooks
└── vite.config.js        # Vite + React plugin configuration
```

### Passage Data
Passages live in `src/data/passages/*.json`. Each file includes:
- `coverImage`: points to a local SVG (e.g., `assets/covers/marie-curie.svg`).
- `body`: array of paragraphs (supports inline keyword highlighting).
- `questions`: now about ten per passage with mixed formats:
  - `multiple-choice`
  - `fill-blank`
  - `matching`
  - `sequence`
  - `short-answer`
- `prompts` (optional): reserved for future journaling features.

Update or add files, then import them through `src/data/passages.js` if you create new adventures.

## Feature Highlights
- **React Router** for seamless navigation between the passage grid and detail pages.
- **Enhanced Read Aloud** with voice selection, adjustable speech rate, and live sentence highlighting.
- **Dynamic Quiz Engine** supporting five question types with instant feedback and score summary.
- **Reusable SVG Covers** stored locally for fast, consistent theming.
- **Accessibility**: keyboard-friendly navigation, readable focus states, and motion respecting `prefers-reduced-motion`.
- **Expanded Biographies** featuring Harriet Tubman and Katherine Johnson for cross-curricular reading.
- **Tech Journeys** exploring smartphones, augmented reality, computer history, and Python coding projects.
- **Hyrule Field Labs**: five science adventures inspired by Tears of the Kingdom covering wind, energy, engineering, weather, and glowing ecosystems.

## Commands
| Command            | Purpose                                   |
|--------------------|-------------------------------------------|
| `npm run dev`      | Start the dev server with hot reloading   |
| `npm run build`    | Build production assets into `dist/`      |
| `npm run preview`  | Preview the production build locally      |

## Next Steps
- Hook the new quiz data to persistence (badges, scores) if desired.
- Extend the read-aloud hook with pause/resume controls.
- Add authoring tools to generate question templates from new passages.

Happy exploring and expanding Quest Comprehend!
