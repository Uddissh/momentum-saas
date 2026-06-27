import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, CheckSquare, BookOpen,
  Sparkles, BarChart3, LogOut, Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/habits', icon: CheckSquare, label: 'Habits' },
  { to: '/journal', icon: BookOpen, label: 'Dev Journal' },
  { to: '/insights', icon: Sparkles, label: 'AI Insights' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-cyber flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-bg" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-text-primary font-bold text-base tracking-tight">Momentum</span>
          <p className="text-text-muted text-[10px] font-mono">Track. Build. Launch.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(125,56,245,0.15) 100%)',
                      border: '1px solid rgba(0,212,255,0.2)',
                    }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-cyan" />
                )}
                <Icon
                  className={`w-4.5 h-4.5 relative z-10 transition-colors ${
                    isActive ? 'text-cyan' : 'group-hover:text-text-primary'
                  }`}
                  size={18}
                />
                <span className="relative z-10">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card border border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center text-bg font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate">
              {user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Developer'}
            </p>
            <p className="text-text-muted text-[10px] truncate">{user?.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSignOut}
            className="text-text-muted hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
