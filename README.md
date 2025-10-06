# Quest Comprehend – Reading Adventures

A dark-mode reading dashboard for 3rd graders. Learners can browse passage cards, jump into detailed reading quests, listen with text-to-speech, and answer comprehension questions. All content lives in editable config files so family members or teachers can add new adventures without touching the layout code.

## Project Structure
```
.
├── index.html        # Dashboard with passage cards and filters
├── passage.html      # Detail view with full passage and quiz
├── styles.css        # Shared styling for both pages
├── config/
│   ├── passages.js   # Passage text, quiz questions, journal prompts
│   └── site.js       # Learner name, badges, navigation links
├── scripts/
│   ├── home.js       # Renders the dashboard grid
│   ├── passage.js    # Loads detail page content and quiz logic
│   └── shared.js     # Helper utilities and sidebar population
└── assets/
    └── avatar.svg    # Placeholder learner avatar
```

## Editing Content
1. Open `config/site.js` to change the learner name, point totals, badges, or navigation labels/icons.
2. Open `config/passages.js` to edit passages. Each entry contains:
   - `id`: short slug used in URLs (must stay unique).
   - `title`, `summary`, `category`, and `coverImage` (any public image URL works).
   - `body`: array of paragraphs – add or remove strings to adjust text.
   - `questions`: multiple-choice items with `options`, `answer` index, and `explanation`.
   - `prompts`: discussion or journal prompts shown at the bottom of the detail page.
   - Optional `wordCount` value; if omitted it will be calculated from the paragraphs.

After saving changes, refresh the browser to see updates instantly. No build step required.

## Local Preview
```
python3 -m http.server 8000
```
Visit http://127.0.0.1:8000 and explore `index.html`.

## Deployment
The site is static, so any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages, Render). When you pushed to GitHub, enable **GitHub Pages** on the repository and share the resulting URL with family.

## Accessibility & Browser Notes
- Designed with keyboard navigation and visible focus indicators.
- Uses the browser's Speech Synthesis API for the "Read Aloud" button; Chrome, Edge, and Safari support this without extra libraries.
- Animated effects respect the user’s `prefers-reduced-motion` setting.

Enjoy crafting new adventures!
