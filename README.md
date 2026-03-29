# Vaarta — वार्ता
### Vernacular Business News Engine

> Real-time, culturally-adapted translation of English business news into Hindi, Tamil, Telugu, and Bengali — powered by Puter.js AI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

---

## 📦 Build & Deploy

### Build for production
```bash
npm run build
```

### Deploy to Vercel (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts — framework will auto-detect as Vite
```

### Deploy to Netlify
```bash
# Build first
npm run build

# Drag the /dist folder into Netlify's dashboard
# OR use Netlify CLI:
npx netlify-cli deploy --prod --dir=dist
```

---

## 🧠 How It Works

Vaarta uses **Puter.js** — a free, client-side AI runtime — to call GPT-4o directly from the browser. No API keys, no backend, no cost.

The AI is given a culturally-engineered prompt that instructs it to act as a regional business journalist rather than a literal translator. Each language has its own regional economic context baked into the prompt.

### Output Structure (JSON from AI)
```json
{
  "headline": "Translated headline in target language",
  "translation": "Full article translated naturally",
  "culturalContext": ["Point 1", "Point 2", "Point 3"],
  "whyItMatters": "Local economic relevance paragraph",
  "keyTerms": [
    { "english": "repo rate", "vernacular": "रेपो दर", "explanation": "..." }
  ]
}
```

---

## 🗂 Project Structure

```
vaarta/
├── index.html              # Entry point — loads Puter.js + Google Fonts
├── vite.config.js
├── tailwind.config.js
├── vercel.json             # SPA routing fix for Vercel
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Router
│   ├── index.css           # Global styles — newspaper aesthetic
│   ├── pages/
│   │   ├── Landing.jsx     # Homepage — editorial newspaper layout
│   │   └── Translate.jsx   # Engine page — input/output split view
│   ├── components/
│   │   ├── Navbar.jsx      # Masthead + news ticker
│   │   ├── Footer.jsx
│   │   ├── TranslationResult.jsx   # Renders AI output
│   │   └── LoadingSkeleton.jsx     # Loading state
│   ├── hooks/
│   │   └── usePuterAI.js   # Puter.js AI hook
│   └── utils/
│       └── languages.js    # Language config + AI prompt builder
└── public/
    └── favicon.svg
```

---

## 🌐 Supported Languages

| Language | Script     | Region                    | Speakers |
|----------|------------|---------------------------|----------|
| Hindi    | Devanagari | North India               | 600M+    |
| Tamil    | Tamil      | Tamil Nadu                | 80M+     |
| Telugu   | Telugu     | Andhra Pradesh, Telangana | 90M+     |
| Bengali  | Bengali    | West Bengal, Bangladesh   | 230M+    |

---

## ⚙️ Tech Stack

- **React 18** + **Vite 5** — fast dev & build
- **Tailwind CSS 3** — utility-first styling
- **React Router v6** — client-side routing
- **Puter.js v2** — free AI inference (GPT-4o), no backend needed
- **Lucide React** — icon set
- **Google Fonts** — Playfair Display, Source Serif 4, DM Sans

---

## 🎨 Design Philosophy

Editorial newspaper aesthetic — inspired by broadsheet layout:
- **Playfair Display** for headlines and display type
- **Source Serif 4** for body reading
- **DM Sans** for UI labels and metadata
- Newsprint paper (`#f5f0e8`) background with ink (`#1a1108`) type
- Saffron (`#e8630a`) as the primary accent — nods to Indian press heritage
- Live news ticker, masthead layout, column rules, drop caps

---

## 🔧 Customisation

### Add a new language
In `src/utils/languages.js`, add to the `LANGUAGES` array:
```js
{
  code: 'mr',
  name: 'Marathi',
  nativeName: 'मराठी',
  script: 'Devanagari',
  region: 'Maharashtra',
  regionDetail: 'Maharashtra, Goa',
  speakers: '83M+',
  color: '#8e44ad',
  economyNote: 'Mumbai financial capital, auto & pharma, strong cooperative sector',
}
```

### Swap AI provider
In `src/hooks/usePuterAI.js`, replace the Puter.js call with any API:
```js
// Example: Use Anthropic API via a backend proxy
const response = await fetch('/api/translate', {
  method: 'POST',
  body: JSON.stringify({ prompt, model: 'claude-sonnet-4-20250514' })
})
```

---

## 📄 License
Prototype build. Not affiliated with Economic Times or Bennett Coleman & Co.
