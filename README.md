# 🎬 ScriptForge — AI YouTube Script Writer

> A production-ready, full-stack AI chatbot application that generates professional YouTube content across 5 specialized modes — powered by Claude AI with real-time streaming.

![ScriptForge Banner](https://img.shields.io/badge/Powered%20by-Claude%20AI-6c63ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)

---

## ✨ Features

- **5 Specialized Content Modes** — Horror, Educational, Shorts, Hooks & Titles, SEO Descriptions
- **Real-time Streaming** — Watch your script generate token by token via Server-Sent Events
- **Smart Prompt Engineering** — Each mode has a deeply tuned system prompt crafted for YouTube creators
- **Advanced Options** — Custom keywords, target audience, tone selection, length control
- **Copy & Download** — One-click clipboard copy or .txt file download
- **Dark UI** — Cinematic dark interface with mode-specific accent colors
- **Production-ready** — Rate limiting, CORS, input validation, error handling, Helmet security headers

---

## 📋 Content Generation Modes

### 👁️ Horror Story
Generates atmospheric, narrative-driven horror scripts with:
- Cinematic structure: Hook → Setup → Rising Tension → Climax → Twist
- Second-person immersive narration ("you walk into the room...")
- Director's notes and pacing cues in `[brackets]`
- Psychological depth and vivid imagery
- Target lengths: 5 min / 10 min / 15-20 min scripts

### 🎓 Educational Script
Produces clear, structured educational content with:
- Pedagogical framework: Hook → Objectives → Content → Examples → Summary → CTA
- Numbered sections for easy navigation
- Memorable analogies and concrete examples
- Timestamp suggestions for video chapters
- Subscriber call-to-action at the end

### ⚡ Shorts Script
Creates concise, viral-optimized content for:
- YouTube Shorts, TikTok, Instagram Reels (15-60 seconds)
- Every-second-counts structure with strong 3-second hooks
- Visual direction notes alongside spoken script
- Satisfying loops, reveals, and pattern-interrupt formats

### 🎣 Hooks & Titles
Generates attention-maximizing video starters:
- 3-5 hook variations per request (curiosity, shock, story, promise, question)
- Multiple title formula variations
- Psychological reasoning for why each approach works
- Power words, CTR optimization tips, and A/B testing guidance

### 🔍 SEO Description
Creates algorithm-optimized YouTube descriptions with:
- Strong first 2-3 visible lines (pre "Show More")
- Keyword-rich natural language for search ranking
- Timestamps section template
- Hashtags (3-5 targeted ones)
- Call-to-subscribe, social links placeholders
- 200-500 word range for optimal indexing

---

## 🗂️ Project Structure

```
scriptforge/
├── backend/                    # Node.js / Express API
│   ├── server.js               # Main server with all endpoints
│   └── package.json
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Root component & UI layout
│   │   ├── App.css             # Complete design system styles
│   │   ├── index.css           # Global CSS variables & resets
│   │   ├── main.jsx            # React entry point
│   │   ├── hooks/
│   │   │   └── useGenerate.js  # Streaming state management hook
│   │   └── utils/
│   │       ├── api.js          # API client (fetch + SSE streaming)
│   │       └── modes.js        # Mode config (colors, prompts, options)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .env.example                # Root env template (copy → .env)
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- An [Anthropic API key](https://console.anthropic.com/) (Claude access)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/scriptforge-yt-writer.git
cd scriptforge-yt-writer
```

### 2. Install dependencies
```bash
# Install all at once (from root)
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure API keys
```bash
# Copy the template
cp .env.example backend/.env

# Edit backend/.env and add your Anthropic API key:
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Run the application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

Then open **http://localhost:5173** in your browser. 🎉

---

## 🔑 API Key Setup

1. Go to [https://openrouter.ai/workspaces/default/keys)
2. Create an account or sign in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-`)
5. Paste it into `backend/.env` as `ANTHROPIC_API_KEY`

> ⚠️ Never commit your `.env` file or share your API key publicly.

---

## 🔌 API Endpoints

### `GET /api/health`
Returns server status. Use to verify the backend is running.

### `POST /api/generate`
Generates content (non-streaming, full response at once).

**Request body:**
```json
{
  "mode": "horror",
  "topic": "A haunted lighthouse keeper",
  "tone": "Psychological",
  "length": "Medium (10 min)",
  "keywords": "isolation, sea, fog",
  "targetAudience": "horror fans 18-35",
  "additionalContext": "Focus on the slow descent into madness"
}
```

**Response:**
```json
{
  "success": true,
  "mode": "horror",
  "topic": "A haunted lighthouse keeper",
  "content": "..generated script...",
  "usage": { "inputTokens": 234, "outputTokens": 1102 },
  "generatedAt": "2025-05-10T12:00:00.000Z"
}
```

### `POST /api/generate/stream`
Same params as above, but streams response via Server-Sent Events.

**SSE events:**
```
data: {"text": "The light had been"}
data: {"text": " flickering for three"}
data: {"done": true, "usage": {...}}
```

---

## ⚙️ Configuration Options

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | **Required.** Your Claude API key |
| `PORT` | `3001` | Backend server port |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |

---

## 🛡️ Production Deployment

### Backend (e.g. Railway, Render, Fly.io)
1. Set environment variables on your hosting platform
2. Change `FRONTEND_URL` to your production frontend URL
3. `npm start` is the production command

### Frontend (e.g. Vercel, Netlify)
1. Build: `npm run build` in `/frontend`
2. Set `VITE_API_URL` to your production backend URL
3. Deploy the `dist/` folder

### Security Checklist
- [x] Helmet security headers on all responses
- [x] Rate limiting (30 req / 15 min per IP)
- [x] CORS restricted to frontend origin
- [x] Input length validation (500 char max)
- [x] No API keys in frontend code
- [x] `.env` excluded from git

---

## 🧠 Prompt Engineering Details

Each mode uses a carefully crafted **system prompt** + **user prompt** combination:

| Mode | System Persona | Key Instructions |
|---|---|---|
| Horror | Master horror scriptwriter | Atmosphere, tension pacing, second-person POV, scene breaks |
| Educational | Expert educational creator | Learning objectives, analogies, chapter timestamps, CTA |
| Shorts | Viral short-form specialist | First-3-seconds hook, visual notes, 15-60s constraint |
| Hooks | YouTube optimization specialist | 5 hook variations, psychology justification, formulas |
| SEO | YouTube SEO expert | Keyword density, description structure, hashtag strategy |

All prompts request **structured output** with clear section labels like `[HOOK]`, `[SETUP]`, etc. for consistent, usable scripts.

---

## 🔮 Future Enhancements

- [ ] **Chat History** — Save and revisit previously generated scripts
- [ ] **Script Templates** — Pre-built templates for popular video formats (review, vlog, tutorial)
- [ ] **Export Options** — Export as .docx, PDF, or Google Doc
- [ ] **Multi-language Support** — Generate scripts in Spanish, French, Hindi, etc.
- [ ] **Voice Preview** — Text-to-speech preview of the generated script
- [ ] **Thumbnail Generator** — AI image generation for video thumbnails
- [ ] **Analytics Mode** — Analyze existing video descriptions and suggest improvements
- [ ] **User Accounts** — Save, organize, and share scripts with a team
- [ ] **Batch Generation** — Generate multiple variations simultaneously
- [ ] **Custom Personas** — Save your own prompt preferences per content type

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for the Claude AI API
- [Vite](https://vitejs.dev) for the blazing fast frontend tooling
- [Express](https://expressjs.com) for the robust Node.js framework
