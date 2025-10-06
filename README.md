# Ready to Read! – Comprehension Adventures

A lightweight web app that gives 3rd graders five engaging reading passages about science and inspiring biographies. Each passage includes vocabulary support, multiple-choice checks, and talk-it-out prompts to keep young readers curious.

## Features
- Five 3rd grade-friendly passages (three science, two biography) with ~200–260 words each.
- Built-in vocabulary list you can show or hide across all passages.
- Interactive multiple-choice questions with instant feedback.
- Conversation prompts to spark family discussion.
- Optional read-aloud button powered by the browser's Speech Synthesis API.

## Quick Start
1. Download or clone this folder.
2. Open `index.html` in your favorite browser. That's it!

If you prefer running a local server (helpful for Chrome's speech features):
```bash
cd /path/to/Jacob-ReadingComprehension
python3 -m http.server 8000
```
Then visit http://127.0.0.1:8000 in your browser.

## Sharing & Deployment
Because the project is 100% static, you can host it almost anywhere. Two fast options:

### Option 1: Netlify Drop (drag-and-drop hosting)
1. Go to https://app.netlify.com/drop.
2. Drag the entire project folder onto the page.
3. Netlify will build and give you a secure, shareable URL instantly.

### Option 2: GitHub Pages
1. Create a public repository and push the files.
2. In your repository settings, enable **GitHub Pages** with the `main` branch.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

Either option takes only a few minutes and stays free for personal sharing with family.

## Customizing
- To add more passages, edit the `passages` array in `app.js`.
- Colors and fonts live in `styles.css` under the `:root` section.
- Want audio recordings instead of text-to-speech? Add MP3 files and swap the speech button logic.

Have fun exploring new stories together!
