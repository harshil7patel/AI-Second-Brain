# 🧠 AI Second Brain

A premium AI-powered note-taking app where you store notes and ask AI questions from your own knowledge base.

---

## ⚡ Quick Start (3 steps)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up environment variables
Copy `.env.local` and fill in your keys:
```
NEXT_PUBLIC_SUPABASE_URL=        ← from supabase.com project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=   ← from supabase.com project settings
ANTHROPIC_API_KEY=               ← from console.anthropic.com
```

### Step 3 — Run
```bash
npm run dev
```
Open http://localhost:3000

---

## 🗄️ Supabase Setup

1. Go to https://supabase.com → create new project
2. Go to **SQL Editor** → paste contents of `supabase-schema.sql` → Run
3. Go to **Authentication** → enable **Email** provider
4. Copy **Project URL** and **anon key** from Settings → API

---

## 🤖 AI Setup

### Option A — Anthropic Claude API (recommended)
1. Go to https://console.anthropic.com
2. Create API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Option B — Local Ollama (free, no API key)
1. Install Ollama: https://ollama.ai
2. Run: `ollama pull llama3`
3. In `.env.local` set: `OLLAMA_BASE_URL=http://localhost:11434`
4. In `lib/ai.ts` change the function calls to use `askOllama()` instead

---

## 📁 Project Structure

```
ai-second-brain/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx       ← Login page
│   │   └── signup/page.tsx      ← Signup page
│   ├── api/
│   │   ├── notes/               ← CRUD API routes
│   │   │   ├── route.ts         ← GET all, POST create
│   │   │   └── [id]/route.ts    ← GET, PATCH, DELETE by id
│   │   └── ai/
│   │       ├── summarize/route.ts ← AI summary endpoint
│   │       └── ask/route.ts       ← AI Q&A endpoint
│   ├── dashboard/page.tsx       ← Main dashboard
│   ├── notes/[id]/page.tsx      ← Note editor page
│   └── layout.tsx               ← Root layout
│
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx          ← Navigation sidebar
│   ├── notes/
│   │   └── NoteEditor.tsx       ← Rich note editor with auto-save
│   └── ai/
│       ├── AskAI.tsx            ← Chat interface for Q&A
│       └── SummaryPanel.tsx     ← 2/5/10-mark summary panel
│
├── hooks/
│   └── useNotes.ts              ← Notes CRUD hook
│
├── lib/
│   ├── ai.ts                    ← Anthropic + Ollama integration
│   ├── utils.ts                 ← Helper functions
│   └── supabase/
│       ├── client.ts            ← Browser Supabase client
│       ├── server.ts            ← Server Supabase client
│       └── middleware.ts        ← Auth redirect middleware
│
├── types/index.ts               ← TypeScript interfaces
├── styles/globals.css           ← Global styles + CSS variables
├── middleware.ts                ← Route protection
├── supabase-schema.sql          ← Database schema (run once)
└── .env.local                   ← Your secret keys (never commit!)
```

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard → Settings → Environment Variables.

---

## ✨ Features

- ✅ Email auth (login / signup)
- ✅ Create, edit, delete, pin notes
- ✅ Auto-save (1.5s debounce)  
- ✅ Tags system
- ✅ Search notes
- ✅ AI Q&A from your notes only
- ✅ 2-mark / 5-mark / 10-mark summaries
- ✅ Dark theme, premium UI
- ✅ Collapsible sidebar
- ✅ Word count, timestamps
- ✅ Responsive layout
- ✅ Beautiful glassmorphism UI

---

## 📦 All Dependencies Installed

| Package | Purpose |
|---------|---------|
| `next` | Framework |
| `react`, `react-dom` | UI library |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `@supabase/supabase-js` | Database + Auth |
| `@supabase/ssr` | SSR auth helpers |
| `@anthropic-ai/sdk` | Claude AI |
| `react-hot-toast` | Notifications |
| `react-markdown` + `remark-gfm` | Markdown rendering |
| `react-textarea-autosize` | Auto-growing textarea |
| `zustand` | State management (ready to use) |
| `date-fns` | Date formatting |
| `uuid` | ID generation |
| `clsx` + `tailwind-merge` | Class utilities |
| `pdf-parse` | PDF text extraction (advanced) |
| `tailwindcss` | CSS framework |
| `typescript` | Type safety |
