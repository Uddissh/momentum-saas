import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Brain, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { useHabits } from '../hooks/useHabits';
import { useJournal } from '../hooks/useJournal';
import { supabase } from '../lib/supabase';
import { Card, Button, PageHeader, Badge } from '../components/ui';
import type { AIInsight } from '../types';
import toast from 'react-hot-toast';

const INSIGHT_ICONS = {
  weekly_digest: Brain,
  goal_suggestion: Target,
  habit_tip: Lightbulb,
};

const INSIGHT_COLORS = {
  weekly_digest: '#00d4ff',
  goal_suggestion: '#ff8a1a',
  habit_tip: '#21e695',
};

const INSIGHT_LABELS = {
  weekly_digest: 'Weekly Digest',
  goal_suggestion: 'Goal Insight',
  habit_tip: 'Habit Tip',
};

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: displayed.length < text.length ? Infinity : 0 }}
        className="inline-block w-0.5 h-4 bg-cyan ml-0.5 align-middle"
      />
    </span>
  );
}

export function Insights() {
  const { user } = useAuth();
  const { goals } = useGoals(user?.id);
  const { habits, isCompletedToday } = useHabits(user?.id);
  const { entries, getTotalHoursCoded, getTopTechs } = useJournal(user?.id);

  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [generating, setGenerating] = useState(false);
  const [latestInsight, setLatestInsight] = useState<AIInsight | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setInsights(data as AIInsight[]);
          if (data.length > 0) setLatestInsight(data[0] as AIInsight);
        }
      });
  }, [user?.id]);

  const generateInsight = async (type: AIInsight['insight_type'] = 'weekly_digest') => {
    if (!user?.id) return;
    setGenerating(true);

    const goalsSummary = goals.slice(0, 8).map(g =>
      `${g.title} (${g.category}, ${g.progress}% complete, status: ${g.status})`
    ).join('; ');

    const habitsSummary = habits.map(h =>
      `${h.name}: ${h.streak}-day streak, best: ${h.longest_streak} days, completed today: ${isCompletedToday(h.id)}`
    ).join('; ');

    const journalSummary = entries.slice(0, 5).map(e =>
      `Entry on ${e.created_at.split('T')[0]}: mood ${e.mood}/5, ${e.hours_coded}h coded, techs: ${e.techs_used?.join(', ') || 'none'}`
    ).join('; ');

    const topTechs = getTopTechs().map(([t, c]) => `${t}(${c}x)`).join(', ');
    const totalHours = getTotalHoursCoded();

    const prompts = {
      weekly_digest: `You are an AI productivity coach for a 17-year-old developer named Uddissh who is moving to Australia for university in September 2026.

User's current data:
- Active Goals: ${goalsSummary || 'none set yet'}
- Habits: ${habitsSummary || 'none tracked yet'}
- Journal entries this month: ${entries.length}, total hours coded: ${totalHours}h
- Top technologies: ${topTechs || 'none logged'}
- Recent sessions: ${journalSummary || 'none'}

Generate a warm, personal, motivating weekly digest (3-4 paragraphs). Reference their specific goals and habits by name. Give 3 concrete action items for next week. Keep it energetic and encouraging. No bullet lists, just flowing paragraphs.`,

      goal_suggestion: `You are an AI coach for Uddissh, a developer with these active goals: ${goalsSummary || 'no goals yet'}.

Analyze their goal portfolio and suggest:
1. Which goal deserves most focus this week and why
2. A missing goal that would complement their current set
3. One goal at risk of stagnation

Be specific, reference actual goal names, and keep advice actionable in 2 paragraphs.`,

      habit_tip: `Developer Uddissh is tracking these habits: ${habitsSummary || 'no habits yet'}.

Give a personalized habit optimization tip: identify their weakest habit, explain why streaks break, and give one science-backed technique to improve it. Also celebrate their strongest streak. Keep it to 2 short paragraphs.`,
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompts[type] }],
        }),
      });

      const data = await response.json();
      const content = data.content?.[0]?.text ?? 'Unable to generate insight at this time.';

      const { data: saved } = await supabase
        .from('ai_insights')
        .insert({
          user_id: user.id,
          insight_type: type,
          content,
          summary: content.slice(0, 120) + '...',
        })
        .select()
        .single();

      if (saved) {
        const newInsight = saved as AIInsight;
        setInsights(prev => [newInsight, ...prev]);
        setLatestInsight(newInsight);
        toast.success('New insight generated!');
      }
    } catch {
      toast.error('Failed to generate insight. Check your connection.');
    }

    setGenerating(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="AI Insights"
        subtitle="Personalized coaching powered by Claude"
        action={
          <Button onClick={() => generateInsight('weekly_digest')} loading={generating}>
            <Sparkles size={16} />
            {generating ? 'Generating...' : 'New Digest'}
          </Button>
        }
      />

      {/* Quick generate buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 mb-6 flex-wrap"
      >
        {(['weekly_digest', 'goal_suggestion', 'habit_tip'] as const).map(type => {
          const Icon = INSIGHT_ICONS[type];
          const color = INSIGHT_COLORS[type];
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => generateInsight(type)}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-all bg-card disabled:opacity-50"
            >
              <Icon size={15} style={{ color }} />
              {INSIGHT_LABELS[type]}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Latest insight — hero */}
      {latestInsight ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6 relative overflow-hidden" glow="cyan">
            {/* Glow top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #00d4ff, #7d38f5)' }} />
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-5 blur-3xl bg-cyan pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-cyber flex items-center justify-center">
                <Sparkles size={18} className="text-bg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-text-primary font-semibold text-sm">{INSIGHT_LABELS[latestInsight.insight_type as AIInsight['insight_type']]}</p>
                  <Badge color="cyan">Latest</Badge>
                </div>
                <p className="text-text-muted text-[11px]">
                  {new Date(latestInsight.generated_at).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                onClick={() => generateInsight(latestInsight.insight_type as AIInsight['insight_type'])}
                disabled={generating}
                className="ml-auto text-text-muted hover:text-cyan transition-colors disabled:opacity-50"
                title="Regenerate"
              >
                <RefreshCw size={16} />
              </motion.button>
            </div>

            <TypingText text={latestInsight.content} />

            <div className="mt-4 flex items-center gap-2 text-[11px] text-text-muted">
              <TrendingUp size={11} className="text-cyan" />
              <span>Generated by Claude · Momentum AI</span>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-cyber flex items-center justify-center mx-auto mb-4 opacity-30">
              <Brain size={32} className="text-bg" />
            </div>
            <h3 className="text-text-primary font-semibold mb-2">No insights yet</h3>
            <p className="text-text-secondary text-sm mb-6">
              Generate your first AI digest — Claude will analyse your goals, habits, and journal to give you personalised coaching.
            </p>
            <Button onClick={() => generateInsight('weekly_digest')} loading={generating}>
              <Sparkles size={16} /> Generate First Insight
            </Button>
          </Card>
        </motion.div>
      )}

      {/* History */}
      {insights.length > 1 && (
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">History</p>
          <div className="space-y-3">
            <AnimatePresence>
              {insights.slice(1).map((insight, i) => {
                const Icon = INSIGHT_ICONS[insight.insight_type as AIInsight['insight_type']] ?? Brain;
                const color = INSIGHT_COLORS[insight.insight_type as AIInsight['insight_type']] ?? '#00d4ff';
                const [expanded, setExpanded] = useState(false);

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                          <Icon size={16} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm font-medium">
                            {INSIGHT_LABELS[insight.insight_type as AIInsight['insight_type']]}
                          </p>
                          <p className="text-text-muted text-[11px] truncate">{insight.summary ?? insight.content.slice(0, 80)}</p>
                        </div>
                        <span className="text-text-muted text-[11px] flex-shrink-0">
                          {new Date(insight.generated_at).toLocaleDateString()}
                        </span>
                        <span className="text-text-muted ml-2">{expanded ? '▲' : '▼'}</span>
                      </button>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-border">
                              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap mt-4">
                                {insight.content}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
