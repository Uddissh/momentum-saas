import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

// ─── Card ──────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'green' | 'orange' | null;
  onClick?: () => void;
}

export function Card({ children, className = '', glow = null, onClick }: CardProps) {
  const glowColors: Record<string, string> = {
    cyan: 'hover:shadow-[0_0_24px_rgba(0,212,255,0.2)] hover:border-cyan/30',
    purple: 'hover:shadow-[0_0_24px_rgba(125,56,245,0.2)] hover:border-purple/30',
    green: 'hover:shadow-[0_0_24px_rgba(33,230,149,0.2)] hover:border-green/30',
    orange: 'hover:shadow-[0_0_24px_rgba(255,138,26,0.2)] hover:border-orange/30',
  };

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      onClick={onClick}
      className={`bg-card rounded-2xl border border-border transition-all duration-300 ${
        glow ? glowColors[glow] : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, className = '', type = 'button', fullWidth = false,
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-cyber text-bg font-semibold hover:opacity-90 shadow-lg',
    secondary: 'bg-card border border-border text-text-primary hover:border-cyan/40 hover:text-cyan',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-sm rounded-xl',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}

// ─── Badge ──────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  color?: 'cyan' | 'purple' | 'green' | 'orange' | 'default';
}

export function Badge({ children, color = 'default' }: BadgeProps) {
  const colors = {
    cyan: 'bg-cyan/10 text-cyan border-cyan/20',
    purple: 'bg-purple/10 text-purple border-purple/20',
    green: 'bg-green/10 text-green border-green/20',
    orange: 'bg-orange/10 text-orange border-orange/20',
    default: 'bg-white/5 text-text-secondary border-border',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ value, color = '#00d4ff', height = 6, animated = true }: ProgressBarProps) {
  return (
    <div className="w-full rounded-full bg-border overflow-hidden" style={{ height }}>
      <motion.div
        initial={animated ? { width: 0 } : { width: `${value}%` }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon?: ReactNode;
  delay?: number;
}

export function StatCard({ label, value, sub, color, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="bg-card rounded-2xl border border-border p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
    >
      {/* Top accent strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: color }} />

      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-3xl font-extrabold"
            style={{ color }}
          >
            {value}
          </motion.p>
          {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative bg-surface border border-border rounded-2xl shadow-2xl w-full ${sizeClasses[size]}`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-text-primary font-semibold text-base">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── PageHeader ──────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="text-text-muted mb-4 opacity-50">{icon}</div>
      <h3 className="text-text-primary font-semibold text-base mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
