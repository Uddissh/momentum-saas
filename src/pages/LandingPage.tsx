import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Target, CheckSquare, BookOpen, Sparkles, ArrowRight, Github } from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    title: 'Goal Tracker',
    description: 'Set SMART goals with progress bars, deadlines, and category filters. Visualize every milestone.',
    color: '#00d4ff',
  },
  {
    icon: CheckSquare,
    title: 'Habit Streaks',
    description: 'Build daily habits with streak tracking and a 30-day completion heatmap.',
    color: '#21e695',
  },
  {
    icon: BookOpen,
    title: 'Dev Journal',
    description: 'Log your daily coding sessions — mood, hours coded, tech stack, and what you built.',
    color: '#7d38f5',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Get weekly digests powered by Claude — personalized to your goals, habits, and progress.',
    color: '#ff8a1a',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-cyber flex items-center justify-center">
            <Zap className="w-4 h-4 text-bg" strokeWidth={2.5} />
          </div>
          <span className="text-text-primary font-bold text-base">Momentum</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth?mode=login" className="text-text-secondary text-sm hover:text-text-primary transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link to="/auth?mode=signup">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-cyber text-bg text-sm font-semibold px-4 py-2 rounded-xl"
            >
              Get started
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        {/* Glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #00d4ff 0%, #7d38f5 40%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-card border border-cyan/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan" />
          <span className="text-cyan text-xs font-medium">Powered by Claude AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-text-primary leading-none tracking-tight mb-6"
        >
          Track your journey.
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #7d38f5 100%)' }}
          >
            Launch your potential.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-lg max-w-xl mb-10 leading-relaxed"
        >
          The personal SaaS for developers. Set goals, build habits, journal your progress,
          and get AI-powered weekly insights — all in one dark-mode dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link to="/auth?mode=signup">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gradient-cyber text-bg font-bold px-8 py-3.5 rounded-xl text-sm"
            >
              Start for free
              <ArrowRight size={16} />
            </motion.button>
          </Link>
          <a
            href="https://github.com/Uddissh/momentum-saas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-text-secondary border border-border hover:border-white/20 hover:text-text-primary px-8 py-3.5 rounded-xl text-sm transition-all bg-card"
            >
              <Github size={16} />
              View on GitHub
            </motion.button>
          </a>
        </motion.div>
      </section>

      {/* Dashboard preview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 max-w-5xl mx-auto px-6 pb-20"
      >
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-orange/60" />
            <div className="w-3 h-3 rounded-full bg-green/60" />
            <span className="ml-3 text-text-muted text-xs font-mono">momentum.app/dashboard</span>
          </div>
          {/* Preview content */}
          <div className="p-6 bg-bg grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Goals', val: '7', color: '#00d4ff' },
              { label: 'Habit Streak', val: '14d', color: '#21e695' },
              { label: 'Hours Coded', val: '128h', color: '#7d38f5' },
              { label: 'AI Insights', val: '12', color: '#ff8a1a' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="bg-card rounded-xl border border-border p-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: s.color }} />
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-text-muted text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-extrabold text-text-primary mb-3">Everything you need</h2>
          <p className="text-text-secondary">Four modules. One focused dashboard.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={item}
              className="bg-card border border-border rounded-2xl p-6 group hover:border-white/10 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="text-text-primary font-semibold text-base mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-cyan/10 rounded-3xl p-12 max-w-2xl mx-auto"
          style={{ boxShadow: '0 0 60px rgba(0,212,255,0.08)' }}
        >
          <h2 className="text-3xl font-black text-text-primary mb-4">Ready to build momentum?</h2>
          <p className="text-text-secondary mb-8">Free to use. No credit card required.</p>
          <Link to="/auth?mode=signup">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-cyber text-bg font-bold px-10 py-3.5 rounded-xl text-sm"
            >
              Start for free →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border text-center py-8 text-text-muted text-sm">
        Built with ⚡ by Uddissh · Momentum SaaS · MIT License
      </footer>
    </div>
  );
}
