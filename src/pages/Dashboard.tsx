import { motion } from 'framer-motion';
import { Target, CheckSquare, BookOpen, Sparkles, TrendingUp, Code2, Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { useHabits } from '../hooks/useHabits';
import { useJournal } from '../hooks/useJournal';
import { StatCard, Card, ProgressBar, Badge } from '../components/ui';

const GOAL_COLORS: Record<string, string> = {
  academic: '#ff8a1a',
  technical: '#00d4ff',
  personal: '#7d38f5',
  fitness: '#21e695',
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function Dashboard() {
  const { user } = useAuth();
  const { goals } = useGoals(user?.id);
  const { habits, isCompletedToday } = useHabits(user?.id);
  const { entries, getTotalHoursCoded } = useJournal(user?.id);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Developer';
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const longestStreak = Math.max(0, ...habits.map(h => h.streak));
  const habitsCompletedToday = habits.filter(h => isCompletedToday(h.id)).length;
  const totalHours = getTotalHoursCoded();
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            {greeting}, {firstName} ⚡
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {goals.length > 0 && (
          <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
            <TrendingUp size={14} className="text-cyan" />
            <span className="text-text-secondary text-sm">Avg progress:</span>
            <span className="text-cyan font-bold text-sm">{avgGoalProgress}%</span>
          </div>
        )}
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={fadeUp}>
          <StatCard label="Active Goals" value={activeGoals} sub={`${completedGoals} completed`} color="#00d4ff" icon={<Target size={20} />} delay={0} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard label="Best Streak" value={`${longestStreak}d`} sub={`${habitsCompletedToday}/${habits.length} today`} color="#21e695" icon={<Flame size={20} />} delay={0.08} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard label="Hours Coded" value={`${totalHours}h`} sub={`${entries.length} journal entries`} color="#7d38f5" icon={<Code2 size={20} />} delay={0.16} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard label="Habits Tracked" value={habits.length} sub="Active habits" color="#ff8a1a" icon={<CheckSquare size={20} />} delay={0.24} />
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-cyan" />
                <h2 className="text-text-primary font-semibold text-base">Goals</h2>
              </div>
              <Link to="/goals">
                <motion.div
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-1 text-cyan text-xs hover:underline"
                >
                  View all <ChevronRight size={12} />
                </motion.div>
              </Link>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-muted text-sm">No goals yet.</p>
                <Link to="/goals" className="text-cyan text-sm hover:underline mt-2 block">
                  Add your first goal →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 5).map((goal, i) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Badge color={
                          goal.category === 'academic' ? 'orange' :
                          goal.category === 'technical' ? 'cyan' :
                          goal.category === 'fitness' ? 'green' : 'purple'
                        }>
                          {goal.category}
                        </Badge>
                        <span className="text-text-primary text-sm font-medium truncate max-w-[220px]">
                          {goal.title}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold ml-2 flex-shrink-0"
                        style={{ color: GOAL_COLORS[goal.category] }}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                    <ProgressBar value={goal.progress} color={GOAL_COLORS[goal.category]} height={5} />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Habits Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-green" />
                <h2 className="text-text-primary font-semibold text-base">Today's Habits</h2>
              </div>
              <Link to="/habits">
                <motion.div whileHover={{ x: 2 }} className="flex items-center gap-1 text-cyan text-xs hover:underline">
                  All <ChevronRight size={12} />
                </motion.div>
              </Link>
            </div>

            {habits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-muted text-sm">No habits yet.</p>
                <Link to="/habits" className="text-cyan text-sm hover:underline mt-2 block">
                  Add a habit →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.slice(0, 6).map((habit, i) => {
                  const done = isCompletedToday(habit.id);
                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${habit.color}18`, border: `1px solid ${habit.color}30` }}
                      >
                        {habit.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {habit.name}
                        </p>
                        <p className="text-text-muted text-[11px]">{habit.streak}d streak</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 transition-all ${
                          done
                            ? 'border-green bg-green/20'
                            : 'border-border'
                        }`}
                      >
                        {done && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-green rounded-sm" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Journal Entry */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="p-6" glow="purple">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-purple" />
                  <h2 className="text-text-primary font-semibold text-base">Latest Entry</h2>
                </div>
                <Link to="/journal">
                  <motion.div whileHover={{ x: 2 }} className="flex items-center gap-1 text-cyan text-xs hover:underline">
                    Journal <ChevronRight size={12} />
                  </motion.div>
                </Link>
              </div>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`text-lg ${n <= entries[0].mood ? '' : 'opacity-20'}`}>
                    {n <= entries[0].mood ? '⭐' : '☆'}
                  </div>
                ))}
              </div>
              <p className="text-text-secondary text-sm line-clamp-3 mb-3">{entries[0].content}</p>
              <div className="flex flex-wrap gap-1.5">
                {entries[0].techs_used?.slice(0, 4).map(tech => (
                  <Badge key={tech} color="purple">{tech}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className={entries.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}
        >
          <Card className="p-6">
            <h2 className="text-text-primary font-semibold text-base mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-orange" />
              Quick Access
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: '/goals', label: 'Add Goal', icon: Target, color: '#00d4ff' },
                { to: '/habits', label: 'Log Habit', icon: CheckSquare, color: '#21e695' },
                { to: '/journal', label: 'New Entry', icon: BookOpen, color: '#7d38f5' },
                { to: '/insights', label: 'AI Insights', icon: Sparkles, color: '#ff8a1a' },
              ].map(({ to, label, icon: Icon, color }) => (
                <Link key={to} to={to}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-surface border border-border rounded-xl p-4 text-center hover:border-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <p className="text-text-secondary text-xs font-medium">{label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
