import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Step3OAuth() {
  const { login, authState, authError, isAuthenticated, nextStep } = useApp();

  // Auto-advance when OAuth succeeds
  useEffect(() => {
    if (isAuthenticated && authState === 'success') {
      const t = setTimeout(nextStep, 800);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, authState, nextStep]);

  const isLoading = authState === 'loading';

  return (
    <div className="flex flex-col h-full">
      {/* Branding connector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mb-7"
      >
        {/* Outpoint badge */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100"
          style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)' }}>
          🎁
        </div>

        {/* Connecting dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-300"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: i * 0.15, duration: 1.2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Google G */}
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-6"
      >
        <h1 className="text-[1.7rem] font-black text-slate-900 leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
          Outpoint wants to access<br />your Google Account
        </h1>
        <p className="text-slate-500 text-sm">
          This will allow Outpoint to find receipts and award you points for your purchases.
        </p>
      </motion.div>

      {/* Permissions card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-4 mb-6 space-y-3"
        style={{ background: '#F1F5F9' }}
      >
        {[
          { icon: '📧', title: 'Read your email messages', sub: 'To find order confirmations' },
          { icon: '👤', title: 'View your basic profile info', sub: 'To create your account' },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm flex-shrink-0">
              {p.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{p.title}</div>
              <div className="text-xs text-slate-500">{p.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Lock note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs text-slate-400 text-center mb-6 leading-relaxed"
      >
        🔒 Read-only access. We never send, delete, or modify emails.
        You can revoke access at any time from your Google account settings.
      </motion.p>

      {/* Error */}
      {authError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Connection failed</div>
            <div className="text-xs mt-0.5 text-red-500">{authError}</div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <div className="mt-auto space-y-3">
        {/* Success state */}
        {isAuthenticated ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full flex items-center justify-center gap-2 font-bold text-base rounded-2xl"
            style={{ background: '#16A34A', color: '#fff', height: 56 }}
          >
            <span>✓</span> Gmail connected!
          </motion.div>
        ) : (
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 font-bold text-base rounded-2xl transition-all active:scale-95 disabled:opacity-60"
            style={{ background: '#2563EB', color: '#fff', height: 56 }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" opacity=".9"/>
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".75"/>
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity=".65"/>
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity=".55"/>
                </svg>
                Allow access
              </>
            )}
          </button>
        )}

        <button
          onClick={nextStep}
          className="w-full text-slate-400 text-sm font-medium py-2 hover:text-slate-600 transition-colors"
        >
          Skip (demo without real data)
        </button>
      </div>
    </div>
  );
}
