-- ─────────────────────────────────────────────────────────────────────────────
-- Momentum SaaS — Initial Database Migration
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Goals ──────────────────────────────────────────────────────────────────────
create table if not exists public.goals (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  description  text,
  category     text not null check (category in ('academic', 'technical', 'personal', 'fitness')),
  target_date  date,
  status       text not null default 'active' check (status in ('active', 'completed', 'paused')),
  progress     integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists goals_status_idx  on public.goals(status);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger goals_updated_at
  before update on public.goals
  for each row execute procedure public.handle_updated_at();

-- ── Habits ─────────────────────────────────────────────────────────────────────
create table if not exists public.habits (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  name           text not null,
  category       text not null default 'other',
  frequency      text not null default 'daily',
  color          text not null default '#00d4ff',
  icon           text not null default '💻',
  streak         integer not null default 0,
  longest_streak integer not null default 0,
  created_at     timestamptz default now() not null
);

create index if not exists habits_user_id_idx on public.habits(user_id);

-- ── Habit Logs ─────────────────────────────────────────────────────────────────
create table if not exists public.habit_logs (
  id           uuid primary key default uuid_generate_v4(),
  habit_id     uuid references public.habits(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  completed_at date not null,
  notes        text,
  created_at   timestamptz default now() not null,
  unique(habit_id, completed_at)
);

create index if not exists habit_logs_habit_id_idx    on public.habit_logs(habit_id);
create index if not exists habit_logs_user_id_idx     on public.habit_logs(user_id);
create index if not exists habit_logs_completed_at_idx on public.habit_logs(completed_at);

-- ── Journal Entries ────────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  title        text,
  content      text not null,
  mood         integer not null default 3 check (mood >= 1 and mood <= 5),
  hours_coded  numeric(4,1) not null default 0,
  techs_used   text[] not null default '{}',
  created_at   timestamptz default now() not null
);

create index if not exists journal_user_id_idx   on public.journal_entries(user_id);
create index if not exists journal_created_at_idx on public.journal_entries(created_at desc);

-- ── AI Insights ───────────────────────────────────────────────────────────────
create table if not exists public.ai_insights (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  insight_type text not null check (insight_type in ('weekly_digest', 'goal_suggestion', 'habit_tip')),
  content      text not null,
  summary      text,
  generated_at timestamptz default now() not null
);

create index if not exists ai_insights_user_id_idx on public.ai_insights(user_id);

-- ── Row Level Security (RLS) ───────────────────────────────────────────────────
alter table public.goals           enable row level security;
alter table public.habits          enable row level security;
alter table public.habit_logs      enable row level security;
alter table public.journal_entries enable row level security;
alter table public.ai_insights     enable row level security;

-- Goals policies
create policy "Users can view own goals"   on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

-- Habits policies
create policy "Users can view own habits"   on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

-- Habit logs policies
create policy "Users can view own habit logs"   on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own habit logs" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can delete own habit logs" on public.habit_logs for delete using (auth.uid() = user_id);

-- Journal policies
create policy "Users can view own entries"   on public.journal_entries for select using (auth.uid() = user_id);
create policy "Users can insert own entries" on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete own entries" on public.journal_entries for delete using (auth.uid() = user_id);

-- AI Insights policies
create policy "Users can view own insights"   on public.ai_insights for select using (auth.uid() = user_id);
create policy "Users can insert own insights" on public.ai_insights for insert with check (auth.uid() = user_id);
