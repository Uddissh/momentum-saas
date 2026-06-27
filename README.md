# ⚡ Momentum — Personal Dev Goals & Progress Tracker

> Track your journey. Build your habits. Launch your potential.

A self-hosted SaaS for developers to set goals, track daily habits, journal coding sessions, and get AI-powered weekly insights — built with React, TypeScript, Supabase, and Framer Motion.

![Momentum Dashboard](https://placehold.co/1200x630/050510/00d4ff?text=Momentum+Dashboard)

---

## 🚀 Features

| Module | What it does |
|--------|-------------|
| **Dashboard** | Animated overview: stats, goals preview, today's habits, quick actions |
| **Goals** | CRUD goal tracker with categories, progress bars, and quick-update buttons |
| **Habits** | Daily habit check-in with 30-day heatmap and streak tracking |
| **Dev Journal** | Log sessions — mood, hours coded, tech stack, notes |
| **AI Insights** | Claude-powered weekly digests, goal suggestions, habit tips |
| **Analytics** | Recharts visualizations — coding trends, habit streaks, goal distributions |

---

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 (custom dark theme)
- **Animations**: Framer Motion
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Anthropic Claude API (`claude-sonnet-4-6`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toasts**: React Hot Toast
- **Routing**: React Router v6

---

## 📦 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Uddissh/momentum-saas.git
cd momentum-saas
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and paste the contents of `supabase/migrations/001_initial.sql`
3. Run the migration — this creates all tables with RLS policies

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ **Security note**: The Anthropic key is used client-side for the AI Insights page. For production, proxy the API through a backend (Supabase Edge Functions or Express) to keep the key secret.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 🗂 Project Structure

```
momentum-saas/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/         # Sidebar, Layout wrapper
│   │   └── ui/             # Card, Button, Badge, Modal, StatCard, ProgressBar, etc.
│   ├── hooks/
│   │   ├── useAuth.ts       # Supabase auth hook
│   │   ├── useGoals.ts      # Goals CRUD
│   │   ├── useHabits.ts     # Habits + daily logging
│   │   └── useJournal.ts    # Journal CRUD
│   ├── lib/
│   │   └── supabase.ts      # Supabase client + DB types
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Goals.tsx
│   │   ├── Habits.tsx
│   │   ├── Journal.tsx
│   │   ├── Insights.tsx
│   │   └── Analytics.tsx
│   ├── types/
│   │   └── index.ts         # All TypeScript interfaces
│   ├── App.tsx              # Router with protected routes
│   ├── main.tsx
│   └── index.css            # Global styles + Tailwind
├── supabase/
│   └── migrations/
│       └── 001_initial.sql  # Full DB schema + RLS policies
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#050510` | Page background |
| `surface` | `#0f0f1f` | Sidebar, modals |
| `card` | `#141428` | Content cards |
| `border` | `#232348` | All borders |
| `cyan` | `#00d4ff` | Primary accent |
| `purple` | `#7d38f5` | Secondary accent |
| `green` | `#21e695` | Success / streaks |
| `orange` | `#ff8a1a` | Warnings / academic |

---

## 🗄 Database Schema

Five tables with Row Level Security:

```
goals          — Title, category, progress, deadline, status
habits         — Name, icon, color, streak, longest_streak
habit_logs     — Daily completion records (unique per habit+date)
journal_entries — Content, mood (1-5), hours coded, tech stack array
ai_insights    — Claude-generated digests and tips
```

All data is user-scoped via RLS policies — users can only read/write their own rows.

---

## 🤖 AI Insights

The Insights page calls `claude-sonnet-4-6` with a context-aware prompt built from your:
- Active goals (titles + progress)
- Habit streaks (current + personal best)
- Journal entries (last 5 sessions)
- Top technologies used

Three prompt types:
- **Weekly Digest** — Personal coaching paragraph
- **Goal Suggestion** — Focus area + missing goals
- **Habit Tip** — Science-backed streak improvement

---

## 📋 Roadmap

- [ ] Supabase Edge Function proxy for Anthropic API (security)
- [ ] Push notifications for habit reminders (PWA)
- [ ] GitHub activity integration (auto-log coding hours)
- [ ] Goal sharing / accountability partners
- [ ] Export journal to markdown
- [ ] Mobile app (React Native)

---

## 📄 License

MIT — free to use, modify, and deploy.

---

Built by [Uddissh Verma](https://github.com/Uddissh) · Powered by [Supabase](https://supabase.com) + [Anthropic](https://anthropic.com)
