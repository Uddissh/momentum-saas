import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, Clock, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useJournal } from '../hooks/useJournal';
import { Card, Button, Modal, PageHeader, EmptyState, Badge } from '../components/ui';

const MOODS = [
  { val: 1, emoji: '😫', label: 'Rough' },
  { val: 2, emoji: '😕', label: 'Meh' },
  { val: 3, emoji: '😊', label: 'Good' },
  { val: 4, emoji: '😄', label: 'Great' },
  { val: 5, emoji: '🔥', label: 'Epic' },
];

const COMMON_TECHS = ['React','TypeScript','Python','Rust','Go','Node.js','Supabase','Docker','ESP32','Arduino','Linux','Tailwind','Figma','Three.js','FastAPI'];

const defaultForm = { title: '', content: '', mood: 3, hours_coded: 0, techs_used: [] as string[], techInput: '' };

export function Journal() {
  const { user } = useAuth();
  const { entries, loading, addEntry, deleteEntry, getTotalHoursCoded, getTopTechs } = useJournal(user?.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.content.trim()) return;
    setSaving(true);
    await addEntry({
      title: form.title,
      content: form.content,
      mood: form.mood,
      hours_coded: form.hours_coded,
      techs_used: form.techs_used,
    });
    setSaving(false);
    setModalOpen(false);
    setForm(defaultForm);
  };

  const addTech = (tech: string) => {
    if (!tech.trim() || form.techs_used.includes(tech)) return;
    setForm(f => ({ ...f, techs_used: [...f.techs_used, tech], techInput: '' }));
  };

  const removeTech = (tech: string) =>
    setForm(f => ({ ...f, techs_used: f.techs_used.filter(t => t !== tech) }));

  const topTechs = getTopTechs();
  const totalHours = getTotalHoursCoded();

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Dev Journal"
        subtitle="Document your journey, one session at a time"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Entry
          </Button>
        }
      />

      {/* Stats row */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-purple">{entries.length}</p>
            <p className="text-text-muted text-xs mt-1">Total Entries</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-cyan">{totalHours}h</p>
            <p className="text-text-muted text-xs mt-1">Hours Coded</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-orange">{topTechs[0]?.[0] ?? '—'}</p>
            <p className="text-text-muted text-xs mt-1">Top Tech</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-green">
              {entries.length > 0 ? (MOODS[Math.round(entries.reduce((s,e) => s + e.mood, 0) / entries.length) - 1]?.emoji ?? '—') : '—'}
            </p>
            <p className="text-text-muted text-xs mt-1">Avg Mood</p>
          </Card>
        </motion.div>
      )}

      {/* Top Techs */}
      {topTechs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-4">
            <p className="text-text-secondary text-xs font-medium mb-3">Most-Used Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {topTechs.map(([tech, count]) => (
                <motion.div key={tech} whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1">
                  <span className="text-text-primary text-xs font-medium">{tech}</span>
                  <span className="text-cyan text-[10px] font-bold">{count}×</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="No journal entries yet"
          description="Start logging your daily dev sessions — what you built, how you felt, what you learned."
          action={<Button onClick={() => setModalOpen(true)}><Plus size={14} /> Write first entry</Button>}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {entries.map((entry, i) => {
              const mood = MOODS.find(m => m.val === entry.mood);
              const date = new Date(entry.created_at);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-5 group" glow="purple">
                    <div className="flex items-start gap-4">
                      {/* Mood */}
                      <div className="text-2xl flex-shrink-0 mt-0.5" title={mood?.label}>
                        {mood?.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            {entry.title && (
                              <h3 className="text-text-primary font-semibold text-sm">{entry.title}</h3>
                            )}
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-text-muted text-[11px]">
                                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                              {entry.hours_coded > 0 && (
                                <span className="flex items-center gap-1 text-[11px] text-cyan">
                                  <Clock size={10} />
                                  {entry.hours_coded}h coded
                                </span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>

                        {/* Content */}
                        <p className="text-text-secondary text-sm mt-2 leading-relaxed line-clamp-3">
                          {entry.content}
                        </p>

                        {/* Tech Tags */}
                        {entry.techs_used?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {entry.techs_used.map(tech => (
                              <Badge key={tech} color="purple">{tech}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* New Entry Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Journal Entry" size="lg">
        <div className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Finally fixed the Supabase RLS issue"
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-purple/50"
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">What did you build / learn today? *</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write about your session..."
              rows={4}
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-purple/50 resize-none"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-2">Today's Mood</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <motion.button
                  key={m.val}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setForm(f => ({ ...f, mood: m.val }))}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all ${
                    form.mood === m.val
                      ? 'border-purple/50 bg-purple/10'
                      : 'border-border hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-[10px] text-text-muted">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Hours Coded: <span className="text-cyan font-bold">{form.hours_coded}h</span>
            </label>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={form.hours_coded}
              onChange={e => setForm(f => ({ ...f, hours_coded: Number(e.target.value) }))}
              className="w-full accent-purple"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-2">Tech Stack Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={form.techInput}
                onChange={e => setForm(f => ({ ...f, techInput: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addTech(form.techInput)}
                placeholder="Type and press Enter"
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-purple/50"
              />
              <Button variant="secondary" size="sm" onClick={() => addTech(form.techInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TECHS.map(tech => (
                <motion.button
                  key={tech}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => addTech(tech)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    form.techs_used.includes(tech)
                      ? 'border-purple/40 text-purple bg-purple/10'
                      : 'border-border text-text-muted hover:border-white/20'
                  }`}
                >
                  {tech}
                </motion.button>
              ))}
            </div>
            {form.techs_used.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.techs_used.map(tech => (
                  <span key={tech} className="flex items-center gap-1 px-2.5 py-1 bg-purple/10 border border-purple/20 rounded-full text-purple text-[11px]">
                    {tech}
                    <button onClick={() => removeTech(tech)} className="hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.content.trim()} fullWidth>
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
