import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../config/products';
import { LIVE_OAUTH_URL } from '../../config/constants';

// ─── Retailer icons ───────────────────────────────────────────────────────────
function AmazonIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#FF9900" />
      <text x="16" y="22" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="Georgia,serif">a</text>
    </svg>
  );
}
function WalmartIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#0071CE" />
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui,sans-serif">★</text>
    </svg>
  );
}
function MacysIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#E31837" />
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="Georgia,serif">★</text>
    </svg>
  );
}
function TargetIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#CC0000" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="white" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="2.5" fill="white" />
    </svg>
  );
}
function DarkCircleIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="flex-shrink-0">
      <circle cx="16" cy="16" r="16" fill="#1a1a1a" />
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Georgia,serif">i</text>
    </svg>
  );
}
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
function GmailIcon() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" className="flex-shrink-0">
      <rect width="32" height="32" rx="6" fill="#fff" />
      <path d="M4 10l12 9 12-9" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round"/>
      <rect x="3" y="9" width="26" height="16" rx="2" fill="none" stroke="#DADADA" strokeWidth="1.5"/>
      <path d="M3 10.5L16 19l13-8.5V23a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z" fill="#fff"/>
      <path d="M3 10.5L16 19l13-8.5" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Badge data ────────────────────────────────────────────────────────────────
const BADGES = [
  { icon: <AmazonIcon />,     label: 'amazon',  points: '+450', top: '8%',  left: '60%' },
  { icon: <WalmartIcon />,    label: 'walmart', points: '+150', top: '34%', left: '44%' },
  { icon: <DarkCircleIcon />, label: '',        points: '+300', top: '16%', left: '4%'  },
  { icon: <MacysIcon />,      label: "macy's",  points: '+450', top: '55%', left: '48%' },
];

// ─── Gmail connecting bubble ──────────────────────────────────────────────────
function GmailBubble() {
  const phrases = ['Connecting to Gmail…', 'Scanning your inbox…', 'Finding receipts…', 'Counting your points…'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % phrases.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.2 }}
      className="absolute rounded-3xl shadow-2xl"
      style={{
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        zIndex: 20,
        width: 220,
        padding: '18px 20px',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FFF0EE' }}>
          <GmailIcon />
        </div>
        <div>
          <div className="text-xs font-semibold text-ink-900">Gmail</div>
          <div className="text-[10px] text-ink-700/50">demo@gmail.com</div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-semibold text-ink-900 mb-3"
          style={{ lineHeight: 1.3 }}
        >
          {phrases[idx]}
        </motion.p>
      </AnimatePresence>
      <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(14,20,16,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: '#1F4F3D' }}
          animate={{ width: ['15%', '85%'] }}
          transition={{ duration: 5.6, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

// ─── Hook 3: receipt scanner screen ──────────────────────────────────────────
const SCAN_COPY = [
  'Reading your receipts…',
  'Counting your shopping spree 🛍️',
  'Oh wow, you really shop a lot 👀',
  'Tallying up the goods…',
  'Running the numbers…',
  'Found something good…',
  'Almost got it all…',
  'Your wallet is about to smile 💸',
];

const RETAILERS_SCAN = [
  { name: 'Amazon',  pts: '+2,100', icon: <AmazonIcon size={22} /> },
  { name: 'Target',  pts: '+1,200', icon: <TargetIcon size={22} /> },
  { name: "Macy's",  pts: '+1,150', icon: <MacysIcon size={22} /> },
  { name: 'Walmart', pts: '+850',   icon: <WalmartIcon size={22} /> },
];

function Hook3Scanner({ onNext }) {
  const [receipts, setReceipts] = useState(0);
  const [points, setPoints]   = useState(0);
  const [copyIdx, setCopyIdx] = useState(0);
  const [showCatalog, setShowCatalog] = useState(false);
  const TARGET_R = 23, TARGET_P = 5300;

  useEffect(() => {
    const dur = 2600, t0 = Date.now();
    let raf;
    const tick = () => {
      const el = Date.now() - t0;
      const p  = Math.min(el / dur, 1);
      const e  = 1 - Math.pow(1 - p, 3);
      setReceipts(Math.round(TARGET_R * e));
      setPoints(Math.round(TARGET_P * e));
      if (p < 1) { raf = requestAnimationFrame(tick); }
      else { setTimeout(() => setShowCatalog(true), 380); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCopyIdx(i => (i + 1) % SCAN_COPY.length), 1300);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col" style={{ minHeight: 500 }}>

      {/* Scanning top — forest green */}
      <div className="flex-shrink-0 px-5 pt-7 pb-6" style={{ background: '#1F4F3D' }}>
        {/* Rotating copy */}
        <div style={{ height: 22, marginBottom: 20, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={copyIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="text-sm font-medium"
              style={{ color: 'rgba(245,235,221,0.65)' }}
            >
              {SCAN_COPY[copyIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Retailer chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {RETAILERS_SCAN.map(({ name, pts, icon }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.16, type: 'spring', stiffness: 300 }}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              {icon}
              <span className="text-xs font-bold text-white">{pts}</span>
              <span className="text-[9px] font-medium" style={{ color: 'rgba(245,235,221,0.45)' }}>pts</span>
            </motion.div>
          ))}
        </div>

        {/* Counters */}
        <div className="flex items-start gap-6">
          <div>
            <div
              className="font-display font-extrabold"
              style={{ fontSize: '3rem', color: '#F5EBDD', letterSpacing: '-0.05em', lineHeight: 1 }}
            >
              {receipts}
            </div>
            <div className="text-xs mt-1.5 font-medium" style={{ color: 'rgba(245,235,221,0.45)' }}>receipts found</div>
          </div>
          <div className="w-px self-stretch my-1" style={{ background: 'rgba(255,255,255,0.10)' }} />
          <div>
            <div
              className="font-display font-extrabold"
              style={{ fontSize: '3rem', color: '#7ECBA1', letterSpacing: '-0.05em', lineHeight: 1 }}
            >
              {points.toLocaleString()}
            </div>
            <div className="text-xs mt-1.5 font-medium" style={{ color: 'rgba(245,235,221,0.45)' }}>points earned</div>
          </div>
        </div>
      </div>

      {/* Catalog bottom — cream */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6" style={{ background: '#F5EBDD' }}>
        <AnimatePresence>
          {showCatalog && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
            >
              <div className="mb-4">
                <h3 className="font-display font-bold text-ink-900 text-base">Spend your points 🛒</h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(14,20,16,0.45)' }}>
                  Your {TARGET_P.toLocaleString()} pts can unlock these right now
                </p>
              </div>

              <div className="space-y-2.5 mb-5">
                {PRODUCTS.slice(0, 3).map((p, i) => {
                  const ptsCost = Math.round(p.price * 50);
                  const discounted = (p.price * 0.5).toFixed(2);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.07 }}
                      className="flex items-center gap-3 rounded-2xl p-3"
                      style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: p.bg }}
                      >
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-ink-900 text-sm leading-snug truncate">{p.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'rgba(14,20,16,0.4)' }}>{p.size}</div>
                        <div
                          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 mt-1"
                          style={{ background: 'rgba(31,79,61,0.10)' }}
                        >
                          <span className="text-[9px] font-bold" style={{ color: '#1F4F3D' }}>{ptsCost.toLocaleString()} pts</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-ink-700/40 line-through">${p.price.toFixed(2)}</div>
                        <div className="font-display font-bold text-base" style={{ color: '#1F4F3D' }}>${discounted}</div>
                        <div className="text-[9px] font-semibold" style={{ color: '#E2621B' }}>50% off</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button
                onClick={onNext}
                className="w-full font-display font-semibold text-sm rounded-pill bg-ink-900 text-cream-100 transition-all active:scale-[0.97]"
                style={{ height: 52 }}
              >
                Connect Gmail to unlock these
              </button>
              <p className="text-center text-xs mt-2.5" style={{ color: 'rgba(14,20,16,0.35)' }}>
                Takes 30 seconds · Read-only · Revoke anytime
              </p>
            </motion.div>
          )}
          {!showCatalog && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-center py-8 text-sm"
              style={{ color: 'rgba(14,20,16,0.35)' }}
            >
              Loading your catalog…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Phase 1: scanning → found ───────────────────────────────────────────────
const SCAN_RETAILERS = [
  { key: 'amazon',  icon: <AmazonIcon size={20} />,  label: 'Amazon' },
  { key: 'target',  icon: <TargetIcon size={20} />,  label: 'Target' },
  { key: 'walmart', icon: <WalmartIcon size={20} />, label: 'Walmart' },
  { key: 'macys',   icon: <MacysIcon size={20} />,   label: "Macy's" },
];

function Phase1Scanning({ onNext, onClose, onScanComplete }) {
  const [found, setFound] = useState(false);
  const SCAN_DURATION = 500 + SCAN_RETAILERS.length * 520 + 350;

  useEffect(() => {
    const doneTimer = setTimeout(() => {
      setFound(true);
      onScanComplete?.();
    }, SCAN_DURATION);
    return () => clearTimeout(doneTimer);
  }, []);

  return (
    <motion.div
      key="hook2"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.32 }}
      className="flex flex-col h-full"
    >
      <AnimatePresence mode="wait">
        {!found ? (
          /* ── Scanning placeholder ── */
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 items-center justify-center gap-3">
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-sm font-medium text-ink-700/50 text-center"
            >
              Scanning your inbox…
            </motion.p>
          </motion.div>
        ) : (
          /* ── Found state ── */
          <motion.div key="found" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col flex-1 justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-bold text-ink-900 leading-[1.05] tracking-tightest mb-3"
                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 1.9rem)' }}
              >
                It's already in<br />your inbox 📬
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-ink-700/70 leading-relaxed mb-3"
              >
                Those order confirmations from Amazon, Target, and Walmart? Each one holds ORIVA points you've never touched.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(31,79,61,0.08)', border: '1px solid rgba(31,79,61,0.12)' }}
              >
                <span className="text-lg">🧾</span>
                <span className="text-sm font-semibold text-ink-900">23 receipts found and waiting for you</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mt-5"
            >
              <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-pill transition-all active:scale-[0.97]"
                style={{ height: 52, background: '#1F4F3D', color: '#F5EBDD' }}
              >
                Show me my points
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-full text-ink-700/40 text-sm font-medium py-2 hover:text-ink-700 transition-colors text-center"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Google logo ─────────────────────────────────────────────────────────────
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── How it works overlay ─────────────────────────────────────────────────────
const DO_ITEMS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L7.5 14L16 6" stroke="#1F4F3D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    iconBg: '#D6EDE5',
    title: 'Find your receipts',
    body: 'We scan your inbox for order confirmations from retailers like Amazon, Walmart, and Target.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L11.5 7.5H16.5L12.5 10.5L14 15L10 12L6 15L7.5 10.5L3.5 7.5H8.5Z" fill="#1F4F3D" opacity="0.85"/></svg>,
    iconBg: '#D6EDE5',
    title: 'Award your points',
    body: 'Matched purchases are automatically credited to your loyalty account.',
  },
];

const DONT_ITEMS = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5L13 13M13 5L5 13" stroke="#A04030" strokeWidth="2" strokeLinecap="round"/></svg>,
    iconBg: '#F9E8E5',
    title: 'Read personal emails',
    body: "We never read personal messages, social emails, or anything that isn't an order confirmation.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5L13 13M13 5L5 13" stroke="#A04030" strokeWidth="2" strokeLinecap="round"/></svg>,
    iconBg: '#F9E8E5',
    title: 'Store or sell your data',
    body: "We don't store your messages or share your data with advertisers. Ever.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5L13 13M13 5L5 13" stroke="#A04030" strokeWidth="2" strokeLinecap="round"/></svg>,
    iconBg: '#F9E8E5',
    title: 'Give brands inbox access',
    body: "The brand never sees your inbox. Only Claim reads your receipts.",
  },
];

function HowItWorksModal({ onClose, onConnectGoogle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="w-full overflow-y-auto"
        style={{ borderRadius: '20px 20px 0 0', maxHeight: '90%', padding: '24px 24px 32px', background: '#FFFFFF' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(14,20,16,0.12)' }} />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-ink-900 leading-[0.95] tracking-tightest mb-6"
          style={{ fontSize: '1.75rem' }}
        >
          <span className="font-medium">Here's exactly</span><br />
          <span className="font-extrabold">what Claim does.</span>
        </motion.h2>

        {/* Do items */}
        <div className="space-y-4 mb-4">
          {DO_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
              className="flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: item.iconBg }}>
                {item.icon}
              </div>
              <div className="pt-1">
                <div className="font-display font-semibold text-ink-900 text-sm leading-snug mb-0.5">{item.title}</div>
                <div className="text-sm leading-snug" style={{ color: 'rgba(14,20,16,0.55)' }}>{item.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="my-4"
          style={{ height: 1, background: 'rgba(14,20,16,0.10)', transformOrigin: 'left' }}
        />

        {/* Don't items */}
        <div className="space-y-4 mb-5">
          {DONT_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 + i * 0.08 }}
              className="flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: item.iconBg }}>
                {item.icon}
              </div>
              <div className="pt-1">
                <div className="font-display font-semibold text-ink-900 text-sm leading-snug mb-0.5">{item.title}</div>
                <div className="text-sm leading-snug" style={{ color: 'rgba(14,20,16,0.55)' }}>{item.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Control note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="rounded-2xl px-4 py-3 mb-5"
          style={{ background: 'rgba(31,79,61,0.07)', border: '1px solid rgba(31,79,61,0.12)' }}
        >
          <div className="font-display font-semibold text-sm mb-0.5" style={{ color: '#1F4F3D' }}>You're always in control.</div>
          <div className="text-sm" style={{ color: 'rgba(14,20,16,0.55)' }}>Disconnect your inbox any time in one click. Your points stay.</div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="space-y-3"
        >
          <button
            onClick={onConnectGoogle}
            className="w-full flex items-center justify-center gap-2.5 font-display font-semibold text-sm rounded-pill transition-all active:scale-[0.97] bg-ink-900 text-cream-100"
            style={{ height: 52 }}
          >
            <GoogleG />
            Connect my inbox
          </button>
          <p className="text-center text-xs" style={{ color: 'rgba(14,20,16,0.35)' }}>
            🔒 Read-only · We never send or modify emails · Revoke anytime
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Mock Google OAuth overlay ────────────────────────────────────────────────
const DEMO_EMAIL = 'demo@gmail.com';

function MockGoogleOAuth({ onAllow, onDeny }) {
  const [oauthStep, setOauthStep] = useState('account');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 14 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl mx-5 w-full overflow-hidden"
        style={{ maxWidth: 340, fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}
      >
        {oauthStep === 'account' ? (
          <>
            <div className="px-6 pt-8 pb-5 text-center border-b border-gray-100">
              <GoogleLogo />
              <h2 className="text-xl font-normal text-gray-800 mt-4 mb-1">Sign in</h2>
              <p className="text-sm text-gray-500">to continue to <span className="font-medium text-gray-700">Claim</span></p>
            </div>
            <button
              onClick={() => setOauthStep('consent')}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0" style={{ background: '#4285F4' }}>
                D
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">Demo User</div>
                <div className="text-xs text-gray-500">{DEMO_EMAIL}</div>
              </div>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="px-6 py-4 text-center">
              <button onClick={onDeny} className="text-sm text-blue-600 hover:underline">Use a different account</button>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setOauthStep('account')} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <GoogleLogo />
              </div>
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0" style={{ background: '#4285F4' }}>D</div>
                <div>
                  <div className="text-sm font-medium text-gray-800 leading-snug">Claim wants access to your Google Account</div>
                  <div className="text-xs text-blue-600 mt-0.5">{DEMO_EMAIL}</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="px-4 py-2.5 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">This will allow Claim to</div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <div className="text-sm text-gray-700">See your Gmail messages and settings</div>
                    <div className="text-xs text-gray-400 mt-0.5">Read-only · We never send or delete emails</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Make sure you trust Claim. You can always see and remove account access in your{' '}
                <span className="text-blue-500">Google Account</span>.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button
                onClick={onDeny}
                className="px-5 py-2 text-sm font-medium text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onAllow}
                className="px-5 py-2 text-sm font-medium text-white rounded-full transition-colors"
                style={{ background: '#1a73e8' }}
              >
                Allow
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Consent right panel: step 0 (hook) ──────────────────────────────────────
function ConsentHook({ onContinueWithGoogle, onLearnMore, isLoading }) {
  return (
    <motion.div
      key="step-hook"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 flex flex-col"
      style={{ padding: '36px 32px 32px' }}
    >
      <img
        src="/images/claim-logo.png"
        alt="claim"
        className="flex-shrink-0 object-contain object-left"
        style={{ height: 34, width: 'auto', marginBottom: 28 }}
      />

      <h2
        className="font-display font-extrabold text-ink-900 leading-[1.05] tracking-tightest"
        style={{ fontSize: 'clamp(1.5rem, 3.5vw, 1.875rem)', marginBottom: 20 }}
      >
        Never lose your<br />points again
      </h2>

      <p
        className="text-[0.9375rem] leading-relaxed"
        style={{ color: 'rgba(14,20,16,0.58)', marginBottom: 12 }}
      >
        Shop this brand anywhere on Amazon, retail stores, or other sites and still earn rewards.
      </p>
      <p
        className="text-[0.9375rem] leading-relaxed"
        style={{ color: 'rgba(14,20,16,0.58)' }}
      >
        Just connect your Google account and we'll take care of the rest.
      </p>

      <div className="flex-1" />

      <button
        onClick={onContinueWithGoogle}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.9375rem] transition-all active:scale-[0.97] disabled:opacity-60 flex-shrink-0"
        style={{ height: 52, background: '#0f0f0f', color: '#ffffff', marginBottom: 14 }}
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" />Connecting…</>
        ) : (
          <><GoogleG />Continue with Google</>
        )}
      </button>

      <button
        onClick={onLearnMore}
        className="text-center text-sm transition-colors hover:opacity-60 flex-shrink-0"
        style={{ color: 'rgba(14,20,16,0.45)', fontSize: '0.875rem' }}
      >
        Not sure yet?
      </button>
    </motion.div>
  );
}

// ─── Consent right panel: step 1 (confirmation) ───────────────────────────────
function ConsentConfirmation({ onNext, onLearnMore, onViewRewards }) {
  return (
    <motion.div
      key="step-confirm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 flex flex-col"
      style={{ padding: '36px 32px 32px' }}
    >
      <img
        src="/images/claim-logo.png"
        alt="claim"
        className="flex-shrink-0 object-contain object-left"
        style={{ height: 34, width: 'auto', marginBottom: 24 }}
      />

      <h2
        className="font-display font-extrabold text-ink-900 leading-[1.05] tracking-tightest"
        style={{ fontSize: 'clamp(1.5rem, 3.5vw, 1.875rem)', marginBottom: 20 }}
      >
        You're connected, points are confirmed.
      </h2>
      <p
        className="text-[0.9375rem] leading-relaxed"
        style={{ color: 'rgba(14,20,16,0.58)' }}
      >
        We're now scanning for retailer receipts. More points are on the way!
      </p>

      <div className="flex-1" />

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center rounded-full font-semibold text-[0.9375rem] transition-all active:scale-[0.97] flex-shrink-0"
        style={{ height: 52, background: '#0f0f0f', color: '#ffffff', marginBottom: 14 }}
      >
        Continue shopping
      </button>

      <button
        onClick={onViewRewards}
        className="text-center text-sm transition-colors hover:opacity-60 flex-shrink-0"
        style={{ color: 'rgba(14,20,16,0.45)', fontSize: '0.875rem', marginBottom: 8 }}
      >
        View my rewards page
      </button>

      <button
        onClick={onLearnMore}
        className="text-center text-sm transition-colors hover:opacity-60 flex-shrink-0"
        style={{ color: 'rgba(14,20,16,0.45)', fontSize: '0.875rem' }}
      >
        Not sure yet?
      </button>

    </motion.div>
  );
}

// ─── Main Step1Hook ───────────────────────────────────────────────────────────
export function Step1Hook() {
  const [phase, setPhase] = useState(0);
  const [consentStep, setConsentStep] = useState(0); // 0 = hook, 1 = confirmation
  const [showMockOAuth, setShowMockOAuth] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const { nextStep, goToStep, closeFlow, goToRewards, login, authState, isAuthenticated, useLiveOAuth } = useApp();

  useEffect(() => {
    if (isAuthenticated && authState === 'success') {
      if (phase === 0) setConsentStep(1);
      else setPhase(2);
    }
  }, [isAuthenticated, authState, phase]);

  const handleContinueWithGoogle = () => {
    if (useLiveOAuth) {
      window.location.href = LIVE_OAUTH_URL;
    } else if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      login();
    } else {
      setShowMockOAuth(true);
    }
  };

  const handleConfirmationNext = () => {
    setPhase(isAuthenticated ? 2 : 1);
  };

  const isLoading = authState === 'loading';

  if (phase === 2) {
    return <Hook3Scanner onNext={() => goToStep(2)} />;
  }

  // ── Phase 0: Two-panel consent modal ─────────────────────────────────────────
  if (phase === 0) {
    return (
      <div className="relative flex" style={{ height: 520 }}>
        {/* Overlays — cover both panels */}
        <AnimatePresence>
          {showMockOAuth && (
            <MockGoogleOAuth
              onAllow={() => { setShowMockOAuth(false); setConsentStep(1); }}
              onDeny={() => setShowMockOAuth(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showHowItWorks && (
            <HowItWorksModal
              onClose={() => setShowHowItWorks(false)}
              onConnectGoogle={() => { setShowHowItWorks(false); handleContinueWithGoogle(); }}
            />
          )}
        </AnimatePresence>

        {/* Left panel — static, never moves */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: '46%' }}
        >
          <img
            src="/images/consent-left-panel.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right panel — fades between consent steps */}
        <div className="relative flex-1 overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {consentStep === 0 ? (
              <ConsentHook
                key="hook"
                onContinueWithGoogle={handleContinueWithGoogle}
                onLearnMore={() => setShowHowItWorks(true)}
                isLoading={isLoading}
              />
            ) : (
              <ConsentConfirmation
                key="confirmation"
                onNext={closeFlow}
                onLearnMore={() => setShowHowItWorks(true)}
                onViewRewards={() => { closeFlow(); goToRewards(); }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── Phase 1: Gmail connecting / scanning → found ──────────────────────────
  return (
    <div className="relative flex flex-col" style={{ minHeight: 500 }}>
      <AnimatePresence>
        {showMockOAuth && (
          <MockGoogleOAuth
            onAllow={() => { setShowMockOAuth(false); setPhase(1); }}
            onDeny={() => setShowMockOAuth(false)}
          />
        )}
      </AnimatePresence>

      {/* Product photo with Gmail bubble */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ background: '#9AAAE0', height: 240 }}
      >
        <img
          src="/images/product-cleanser.jpg"
          alt="ORIVA product"
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(245,235,221,0.55) 0%, transparent 100%)' }}
        />
        {BADGES.map(({ icon, label, points, top, left }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -7, 0, -4, 0] }}
            transition={{ y: { duration: 2.4 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.45 } }}
            className="absolute flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-lg"
            style={{ top, left, background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.14)', transform: 'translateX(-50%)' }}
          >
            {icon}
            <div className="leading-none">
              <div className="text-[10px] font-bold text-ink-900">{points}</div>
              <div className="text-[8px] text-ink-700/55 uppercase tracking-wider">pts · {label}</div>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {!scanComplete && <GmailBubble key="gmail" />}
        </AnimatePresence>
        <AnimatePresence>
          {scanComplete && (
            <motion.div
              key="total-pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 240 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-5 py-2.5 shadow-xl"
              style={{ background: 'rgba(14,20,16,0.88)', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' }}
            >
              <span className="text-cream-100 font-display font-extrabold text-base">+5,300</span>
              <span className="text-cream-100/70 text-xs font-medium">Points earned</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 px-5 pt-6 pb-6 flex flex-col" style={{ background: '#FFFFFF' }}>
        <Phase1Scanning onNext={() => goToStep(4)} onClose={closeFlow} onScanComplete={() => setScanComplete(true)} />
      </div>
    </div>
  );
}
