import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10.5L7.5 14L16 6" stroke="#1F4F3D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: '#D6EDE5',
    title: 'Find your receipts',
    body: 'We securely scan your inbox for order confirmations from our partner brands.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3L11.5 7.5H16.5L12.5 10.5L14 15L10 12L6 15L7.5 10.5L3.5 7.5H8.5Z" fill="#1F4F3D" opacity="0.85"/>
      </svg>
    ),
    iconBg: '#D6EDE5',
    title: 'Award your points',
    body: 'We automatically add points to your account for every verified purchase.',
  },
];

const DONT_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 5L13 13M13 5L5 13" stroke="#A04030" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: '#F9E8E5',
    title: 'Read personal emails',
    body: "We never read personal messages, social emails, or anything that isn't an order confirmation.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 5L13 13M13 5L5 13" stroke="#A04030" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: '#F9E8E5',
    title: 'Sell your data',
    body: 'Your purchase data is only used to earn you rewards. We never sell your information.',
  },
];

function ListItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.09, duration: 0.32 }}
      className="flex items-start gap-3.5"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: item.iconBg }}
      >
        {item.icon}
      </div>
      <div className="pt-1">
        <div className="font-display font-semibold text-ink-900 text-sm leading-snug mb-0.5">{item.title}</div>
        <div className="text-ink-700/65 text-sm leading-snug">{item.body}</div>
      </div>
    </motion.div>
  );
}

// Google G icon
function GoogleG() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5 flex-shrink-0">
      <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.78h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 3-4.33 3-7.3z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H1.06v2.6A9.99 9.99 0 0 0 10 20z" fill="#34A853"/>
      <path d="M4.41 11.91A6.02 6.02 0 0 1 4.1 10c0-.67.12-1.31.31-1.91V5.49H1.06A9.99 9.99 0 0 0 0 10c0 1.61.38 3.14 1.06 4.51l3.35-2.6z" fill="#FBBC05"/>
      <path d="M10 3.96c1.47 0 2.78.5 3.82 1.5l2.86-2.86A9.94 9.94 0 0 0 10 0 9.99 9.99 0 0 0 1.06 5.49l3.35 2.6C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/>
    </svg>
  );
}

export function Step2Trust() {
  const { login, authState, authError, isAuthenticated, nextStep } = useApp();
  const isLoading = authState === 'loading';

  useEffect(() => {
    if (isAuthenticated && authState === 'success') nextStep();
  }, [isAuthenticated, authState, nextStep]);

  return (
    <div className="flex flex-col h-full">

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          className="font-display text-ink-900 leading-[0.95] tracking-tightest"
          style={{ fontSize: '2.1rem' }}
        >
          <span className="font-medium">Here's exactly</span><br />
          <span className="font-extrabold">what we do.</span>
        </h1>
      </motion.div>

      {/* What we DO */}
      <div className="space-y-4 mb-4">
        {DO_ITEMS.map((item, i) => (
          <ListItem key={item.title} item={item} index={i} />
        ))}
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="my-4"
        style={{ height: 1, background: 'rgba(14,20,16,0.10)', transformOrigin: 'left' }}
      />

      {/* What we WON'T do */}
      <div className="space-y-4 mb-6">
        {DONT_ITEMS.map((item, i) => (
          <ListItem key={item.title} item={item} index={i + 2} />
        ))}
      </div>

      {/* Error */}
      {authError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 rounded-2xl px-4 py-3 text-sm"
          style={{ background: '#F9E8E5', color: '#A04030', border: '1px solid #E8C4BC' }}
        >
          <span className="font-semibold">Connection failed: </span>{authError}
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35 }}
        className="mt-auto space-y-3"
      >
        <button
          onClick={login}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 font-display font-semibold text-sm rounded-pill transition-all active:scale-[0.97] disabled:opacity-50 bg-ink-900 text-cream-100"
          style={{ height: 52 }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" />Connecting…</>
          ) : (
            <><GoogleG />Connect my inbox</>
          )}
        </button>
        <p className="text-center text-ink-700/45 text-xs">
          🔒 Read-only · We never send or modify emails · Revoke anytime
        </p>
      </motion.div>
    </div>
  );
}
