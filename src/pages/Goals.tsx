import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGoals } from '../hooks/useGoals';
import { Card, Button, Badge, Modal, ProgressBar, PageHeader, EmptyState } from '../components/ui';
import type { Goal, GoalCategory, GoalStatus } from '../types';

const CATEGORIES: { value: GoalCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: 'Academic' },
  { value: 'technical', label: 'Technical' },
  { value: 'personal', label: 'Personal' },
  { value: 'fitness', label: 'Fitness' },
];

const CAT_COLORS: Record<GoalCategory, string> = {
  academic: '#ff8a1a',
  technical: '#00d4ff',
  personal: '#7d38f5',
  fitness: '#21e695',
};

const CAT_BADGE_COLOR: Record<GoalCategory, 'orange' | 'cyan' | 'purple' | 'green'> = {
  academic: 'orange', technical: 'cyan', personal: 'purple', fitness: 'green',
};

const STATUS_COLORS: Record<GoalStatus, string> = {
  active: '#00d4ff', completed: '#21e695', paused: '#595980',
};

const defaultForm = { title: '', description: '', category: 'technical' as GoalCategory, target_date: '', progress: 0 };

export function Goals() {
  const { user } = useAuth();
  const { goals, loading, addGoal, updateGoal, deleteGoal, updateProgress } = useGoals(user?.id);
  const [filter, setFilter] = useState<GoalCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const filtered = filter === 'all' ? goals : goals.filter(g => g.category === filter);

  const openAdd = () => { setEditingGoal(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (g: Goal) => {
    setEditingGoal(g);
    setForm({ title: g.title, description: g.description ?? '', category: g.category, target_date: g.target_date ?? '', progress: g.progress });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (editingGoal) {
      await updateGoal(editingGoal.id, form);
    } else {
      await addGoal(form);
    }
    setSaving(false);
    setModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader
        title="Goals"
        subtitle="Define and track your targets"
        action={
          <Button onClick={openAdd} size="md">
            <Plus size={16} /> New Goal
          </Button>
        }
      />

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <motion.button
            key={c.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === c.value
                ? 'border-cyan/40 text-cyan bg-cyan/10'
                : 'border-border text-text-secondary hover:border-white/20 hover:text-text-primary'
            }`}
          >
            {c.label}
            {c.value !== 'all' && (
              <span className="ml-1.5 text-[11px] opacity-60">
                {goals.filter(g => g.category === c.value).length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Target size={48} />}
          title="No goals yet"
          description="Set your first goal and start tracking your progress."
          action={<Button onClick={openAdd}><Plus size={14} /> Add Goal</Button>}
        />
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filtered.map((goal, i) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className="p-5 relative overflow-hidden group h-full flex flex-col" glow={CAT_BADGE_COLOR[goal.category]}>
                  {/* Accent strip */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: CAT_COLORS[goal.category] }} />

                  <div className="flex items-start justify-between mb-3">
                    <Badge color={CAT_BADGE_COLOR[goal.category]}>{goal.category}</Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(goal)}
                        className="p-1.5 text-text-muted hover:text-cyan transition-colors"
                      >
                        <Edit2 size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>

                  <h3 className="text-text-primary font-semibold text-sm mb-1 leading-snug">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-text-muted text-xs mb-3 line-clamp-2">{goal.description}</p>
                  )}

                  <div className="flex-1" />

                  {goal.target_date && (
                    <p className="text-text-muted text-xs mb-3">
                      Due: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[goal.status] }} />
                        <span className="text-[11px] text-text-muted capitalize">{goal.status}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: CAT_COLORS[goal.category] }}>{goal.progress}%</span>
                    </div>
                    <ProgressBar value={goal.progress} color={CAT_COLORS[goal.category]} height={5} />

                    {/* Quick progress buttons */}
                    <div className="flex gap-1 mt-3">
                      {[25, 50, 75, 100].map(pct => (
                        <motion.button
                          key={pct}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateProgress(goal.id, pct)}
                          className={`flex-1 text-[10px] py-1 rounded-lg border transition-all font-medium ${
                            goal.progress >= pct
                              ? 'border-transparent text-bg'
                              : 'border-border text-text-muted hover:border-white/20'
                          }`}
                          style={goal.progress >= pct ? { background: CAT_COLORS[goal.category] } : {}}
                        >
                          {pct === 100 ? <Check size={10} className="mx-auto" /> : `${pct}%`}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'New Goal'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. IELTS Band 6.5+"
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50"
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional details..."
              rows={2}
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as GoalCategory }))}
                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              >
                {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-1.5">Target Date</label>
              <input
                type="date"
                value={form.target_date}
                onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))}
                className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-cyan/50"
              />
            </div>
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Progress: <span className="text-cyan font-bold">{form.progress}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.progress}
              onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))}
              className="w-full accent-cyan"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.title.trim()} fullWidth>
              {editingGoal ? 'Update' : 'Add Goal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
