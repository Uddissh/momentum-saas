import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { useHabits } from '../hooks/useHabits';
import { useJournal } from '../hooks/useJournal';
import { Card, PageHeader } from '../components/ui';

const COLORS = ['#00d4ff', '#7d38f5', '#21e695', '#ff8a1a'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs">
        <p className="text-text-secondary mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-bold" style={{ color: COLORS[i % COLORS.length] }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const { user } = useAuth();
  const { goals } = useGoals(user?.id);
  const { habits } = useHabits(user?.id);
  const { entries } = useJournal(user?.id);

  // Goal progress by category
  const goalsByCategory = Object.entries(
    goals.reduce((acc, g) => {
      const cat = g.category;
      if (!acc[cat]) acc[cat] = { name: cat, total: 0, avgProgress: 0, count: 0 };
      acc[cat].count += 1;
      acc[cat].total += g.progress;
      acc[cat].avgProgress = Math.round(acc[cat].total / acc[cat].count);
      return acc;
    }, {} as Record<string, { name: string; total: number; avgProgress: number; count: number }>)
  ).map(([, v]) => v);

  // Hours coded per last 7 journal entries
  const codingTrend = entries.slice(0, 7).reverse().map((e, i) => ({
    day: new Date(e.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    hours: e.hours_coded,
    mood: e.mood,
  }));

  // Habits completion rate
  const habitData = habits.map(h => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '…' : h.name,
    streak: h.streak,
    best: h.longest_streak,
  }));

  // Goal status pie
  const goalStatusData = [
    { name: 'Active', value: goals.filter(g => g.status === 'active').length },
    { name: 'Completed', value: goals.filter(g => g.status === 'completed').length },
    { name: 'Paused', value: goals.filter(g => g.status === 'paused').length },
  ].filter(d => d.value > 0);

  const chartProps = {
    style: { fontFamily: 'Inter' },
  };

  const axisStyle = { fill: '#595980', fontSize: 11 };
  const gridStyle = { stroke: '#232348', strokeDasharray: '4 4' };

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader title="Analytics" subtitle="Visualize your progress over time" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coding Hours Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-1">Coding Hours</h3>
            <p className="text-text-muted text-xs mb-5">Last {codingTrend.length} journal entries</p>
            {codingTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} {...chartProps}>
                <AreaChart data={codingTrend}>
                  <defs>
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="day" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="hours" name="Hours" stroke="#00d4ff"
                    strokeWidth={2} fill="url(#hoursGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-text-muted text-sm">Add journal entries to see trends</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Habit Streaks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-1">Habit Streaks</h3>
            <p className="text-text-muted text-xs mb-5">Current vs. Personal Best</p>
            {habitData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} {...chartProps}>
                <BarChart data={habitData} barGap={4}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="name" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="streak" name="Current" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="best" name="Best" fill="#7d38f5" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-text-muted text-sm">Add habits to see streaks</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Goal Progress by Category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-1">Goal Progress by Category</h3>
            <p className="text-text-muted text-xs mb-5">Average completion %</p>
            {goalsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} {...chartProps}>
                <BarChart data={goalsByCategory} layout="vertical">
                  <CartesianGrid {...gridStyle} />
                  <XAxis type="number" domain={[0, 100]} tick={axisStyle} />
                  <YAxis dataKey="name" type="category" tick={axisStyle} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgProgress" name="Progress %" radius={[0, 4, 4, 0]}>
                    {goalsByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-text-muted text-sm">Add goals to see progress</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Goal Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-1">Goal Status Distribution</h3>
            <p className="text-text-muted text-xs mb-5">{goals.length} total goals</p>
            {goalStatusData.length > 0 ? (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="60%" height={200} {...chartProps}>
                  <PieChart>
                    <Pie
                      data={goalStatusData} cx="50%" cy="50%"
                      innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value"
                    >
                      {goalStatusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {goalStatusData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-text-secondary text-xs capitalize">{d.name}</span>
                      <span className="text-text-primary text-xs font-bold ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-text-muted text-sm">Add goals to see distribution</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-5 flex items-center gap-2">
              <BarChart3 size={18} className="text-cyan" />
              All-Time Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Goals', val: goals.length, color: '#00d4ff' },
                { label: 'Completed', val: goals.filter(g => g.status === 'completed').length, color: '#21e695' },
                { label: 'Total Habits', val: habits.length, color: '#7d38f5' },
                { label: 'Journal Entries', val: entries.length, color: '#ff8a1a' },
                { label: 'Avg Goal %', val: goals.length ? `${Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)}%` : '—', color: '#00d4ff' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-surface border border-border">
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-text-muted text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
