import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function AuthPage() {
  const [params] = useSearchParams();
  const mode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!fullName.trim()) { toast.error('Full name is required'); setLoading(false); return; }
        const { error } = await signUp(email, password, fullName);
        if (error) { toast.error(error.message); }
        else { toast.success('Account created! Check your email to confirm.'); }
      } else {
        const { error } = await signIn(email, password);
        if (error) { toast.error(error.message); }
        else { navigate('/dashboard'); }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 opacity-10 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, #7d38f5 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back link */}
        <Link to="/">
          <motion.div
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-cyber flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              <Zap className="w-6 h-6 text-bg" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-text-primary">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {isSignup ? 'Start building momentum today' : 'Sign in to your dashboard'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isSignup ? 'signup' : 'login'}
                initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {isSignup && (
                  <div>
                    <label className="text-text-secondary text-xs font-medium block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Uddissh Verma"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-text-secondary text-xs font-medium block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-text-secondary text-xs font-medium block mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 pr-11 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(0,212,255,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-cyber text-bg font-bold py-3 rounded-xl text-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />}
                  {isSignup ? 'Create account' : 'Sign in'}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <span className="text-text-muted text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </span>
              {' '}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-cyan text-sm font-medium hover:underline"
              >
                {isSignup ? 'Sign in' : 'Sign up free'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
