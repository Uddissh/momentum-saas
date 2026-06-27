import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Flame, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { Card, Button, Modal, PageHeader, EmptyState, Badge } from '../components/ui';

const ICONS = ['💻','📚','🏋️','🧘','🥋','📝','🎸','🌿','🏃','🧠','🎯','⚙️','🔬','🎨','☕'];
const COLORS = ['#00d4ff','#7d38f5','#21e695','#ff8a1a','#ff4757','#ffd700','#ff6b81','#a29bfe'];
const CATEGORIES = ['coding','study','fitness','mindfulness','creative','health','other'];

const defaultForm = { name: '', category: 'coding', color: '#00d4ff', icon: '💻' };

function HabitHeatmap({ dates }: { dates: string[] }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex gap-1 flex-wrap">
      {days.map(day => {
        const done = dates.includes(day);
        const date = new Date(day);
        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.3 }}
            title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${done ? '✅' : '❌'}`}
            className={`w-5 h-5 rounded-sm cursor-pointer transition-all duration-200 ${
              done ? '' : 'bg-border'
            }`}
            style={done ? { background: 'linear-gradient(135deg, #00d4ff, #7d38f5)' } : {}}
          />
        );
      })}
    </div>
  );
}

export function Habits() {
  const { user } = useAuth();
  const { habits, loading, addHabit, toggleHabitToday, deleteHabit, isCompletedToday, getCompletionDates } = useHabits(user?.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await addHabit(form);
    setSaving(false);
    setModalOpen(false);
    setForm(defaultForm);
  };

  const completedToday = habits.filter(h => isCompletedToday(h.id)).length;
  const totalToday = habits.length;

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Habits"
        subtitle="Build consistent routines and track your streaks"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Habit
          </Button>
        }
      />

      {/* Daily progress bar */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-text-primary font-semibold text-sm">Today's Progress</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {completedToday} of {totalToday} habits complete
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-cyan">
                  {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00d4ff, #7d38f5)' }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={48} />}
          title="No habits yet"
          description="Add daily habits to track and build your best streaks."
          action={<Button onClick={() => setModalOpen(true)}><Plus size={14} /> Add Habit</Button>}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit, i) => {
              const done = isCompletedToday(habit.id);
              const expanded = expandedId === habit.id;
              const dates = getCompletionDates(habit.id);

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Card
                    className={`overflow-hidden transition-all duration-300 ${done ? 'border-green/20' : ''}`}
                  >
                    {/* Main row */}
                    <div className="flex items-center gap-4 p-4">
                      {/* Check button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          done
                            ? 'border-green bg-green/15 shadow-[0_0_12px_rgba(33,230,149,0.3)]'
                            : 'border-border hover:border-white/30'
                        }`}
                      >
                        {done ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                            <CheckSquare size={18} style={{ color: '#21e695' }} />
                          </motion.div>
                        ) : (
                          <div className="w-4 h-4 rounded-sm border border-border" />
                        )}
                      </motion.button>

                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: `${habit.color}18`, border: `1px solid ${habit.color}30` }}
                      >
                        {habit.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge color="default">{habit.category}</Badge>
                          <span className="text-text-muted text-[11px]">Best: {habit.longest_streak}d</span>
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Flame size={16} style={{ color: habit.streak > 0 ? '#ff8a1a' : '#595980' }} />
                        <span className={`font-black text-lg ${habit.streak > 0 ? 'text-orange' : 'text-text-muted'}`}>
                          {habit.streak}
                        </span>
                      </div>

                      {/* Expand / Delete */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedId(expanded ? null : habit.id)}
                          className="text-xs px-2 py-1 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-white/20 transition-all"
                        >
                          {expanded ? '▲' : '▼'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Heatmap expansion */}
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-border pt-4">
                            <p className="text-text-muted text-xs mb-3 font-medium">Last 30 days</p>
                            <HabitHeatmap dates={dates} />
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg, #00d4ff, #7d38f5)' }} />
                                <span className="text-text-muted text-[11px]">Completed</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-border" />
                                <span className="text-text-muted text-[11px]">Missed</span>
                              </div>
                              <span className="text-text-muted text-[11px] ml-auto">
                                {dates.length} / 30 days
                              </span>
                            </div>
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
      )}

      {/* Add Habit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Habit">
        <div className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">Habit Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Daily Coding"
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50"
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-cyan/50"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <motion.button
                  key={icon}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setForm(f => ({ ...f, icon }))}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    form.icon === icon
                      ? 'bg-cyan/15 border-2 border-cyan/50'
                      : 'bg-card border border-border hover:border-white/20'
                  }`}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-7 h-7 rounded-lg transition-all"
                  style={{
                    background: color,
                    boxShadow: form.color === color ? `0 0 12px ${color}80` : 'none',
                    border: form.color === color ? '2px solid white' : '2px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button onClick={handleAdd} loading={saving} disabled={!form.name.trim()} fullWidth>
              Add Habit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
