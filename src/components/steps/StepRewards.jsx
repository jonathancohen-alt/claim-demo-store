import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

// ─── CountUp ─────────────────────────────────────────────────────────────────
function CountUp({ target, duration = 1400, prefix = '', suffix = '', className, style }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  const t0  = useRef(null);
  useEffect(() => {
    t0.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);
    if (!target) { setVal(0); return; }
    const tick = (ts) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * e));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return (
    <span className={className} style={style}>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Retailer icon chips ──────────────────────────────────────────────────────
function RetailerDot({ name, color }) {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{ background: color }}
    />
  );
}

// ─── Ring progress ────────────────────────────────────────────────────────────
function PointsRing({ points }) {
  const r = 52, circ = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="124" height="124" viewBox="0 0 124 124">
        <circle cx="62" cy="62" r={r} fill="none" stroke="rgba(14,20,16,0.08)" strokeWidth="7" />
        <motion.circle
          cx="62" cy="62" r={r}
          fill="none" stroke="#1F4F3D"
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * 0.07 }}
          transition={{ duration: 1.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '62px 62px' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp
          target={points}
          duration={1600}
          className="font-display font-extrabold"
          style={{ fontSize: '1.85rem', color: '#1F4F3D', letterSpacing: '-0.04em', lineHeight: 1 }}
        />
        <span className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(14,20,16,0.4)', letterSpacing: '0.08em' }}>
          POINTS
        </span>
      </div>
    </div>
  );
}

// ─── Demo activity data ────────────────────────────────────────────────────────
const DEMO_ACTIVITY = [
  { retailer: 'Amazon',  item: 'Vitamin C Cleanser × 2',  pts: 450, date: 'Nov 12', color: '#FF9900', bg: '#FFF4E0' },
  { retailer: 'Target',  item: 'Repair Cream Bundle',      pts: 280, date: 'Nov 8',  color: '#CC0000', bg: '#FFE8E8' },
  { retailer: 'Walmart', item: 'Hydrating Gel 2-Pack',     pts: 340, date: 'Oct 30', color: '#0071CE', bg: '#E5F0FF' },
  { retailer: "Macy's",  item: 'Skincare Gift Set',        pts: 520, date: 'Oct 22', color: '#E31837', bg: '#FFE5EA' },
  { retailer: 'Amazon',  item: 'Calming Cleanser',         pts: 180, date: 'Oct 15', color: '#FF9900', bg: '#FFF4E0' },
  { retailer: 'Target',  item: 'Hydrating Serum',          pts: 260, date: 'Oct 10', color: '#CC0000', bg: '#FFE8E8' },
];

const BREAKDOWN = [
  { label: 'Amazon',  pts: 2100, pct: 40, color: '#FF9900' },
  { label: 'Target',  pts: 1200, pct: 23, color: '#CC0000' },
  { label: "Macy's",  pts: 1150, pct: 22, color: '#E31837' },
  { label: 'Walmart', pts: 850,  pct: 15, color: '#0071CE' },
];

// ─── Main component ───────────────────────────────────────────────────────────
export function StepRewards() {
  const { completeFlow } = useApp();

  const totalPoints   = 5300;
  const receiptsFound = 23;
  const brandsMatched = 4;
  const totalSpend    = 347;
  const dollarsValue  = (totalPoints / 100).toFixed(2);

  const recentActivity = DEMO_ACTIVITY;

  return (
    <div className="flex flex-col overflow-y-auto pb-2" style={{ minHeight: '100%' }}>

      {/* ── Hero: ring + headline ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center pt-4 pb-5"
      >
        <PointsRing points={totalPoints} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-4"
        >
          <h2
            className="font-display font-extrabold text-ink-900 tracking-tightest"
            style={{ fontSize: '1.55rem', lineHeight: 1.1 }}
          >
            You're officially<br />rewarded 🎉
          </h2>
          <p className="text-ink-700/55 text-sm mt-1.5">
            Your points are ready to spend
          </p>
        </motion.div>
      </motion.div>

      {/* ── Stats grid ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {[
          { icon: '🧾', val: receiptsFound,  label: 'Receipts'  },
          { icon: '🏪', val: brandsMatched,   label: 'Retailers' },
          { icon: '💳', val: `$${totalSpend}`, label: 'Spent'    },
        ].map(({ icon, val, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="rounded-2xl p-3 text-center"
            style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
          >
            <div className="text-xl mb-1">{icon}</div>
            <div className="font-display font-bold text-ink-900 text-lg leading-none">{val}</div>
            <div className="text-[10px] text-ink-700/45 font-semibold uppercase tracking-wide mt-1">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Points breakdown ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-ink-900 text-sm">Where your points came from</h3>
        </div>
        <div className="space-y-2.5">
          {BREAKDOWN.map(({ label, pts, pct, color }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-14 text-right flex-shrink-0">
                <span className="text-xs font-semibold" style={{ color: 'rgba(14,20,16,0.5)' }}>{label}</span>
              </div>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(14,20,16,0.08)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.45 + i * 0.09, duration: 0.65, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <div className="text-xs font-bold text-ink-900 w-16 flex-shrink-0 text-right">
                {pts.toLocaleString()} <span className="font-normal text-ink-700/40">pts</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Recent activity ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-ink-900 text-sm">Recent activity</h3>
          <span className="text-xs" style={{ color: 'rgba(14,20,16,0.4)' }}>Most recent purchases</span>
        </div>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.055 }}
              className="flex items-center gap-3 rounded-2xl px-3 py-3"
              style={{ background: 'rgba(14,20,16,0.03)', border: '1px solid rgba(14,20,16,0.06)' }}
            >
              {/* Retailer dot badge */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold"
                style={{ background: item.bg, color: item.color, fontFamily: 'system-ui,sans-serif' }}
              >
                {item.retailer.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink-900 text-sm leading-snug truncate">{item.item}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(14,20,16,0.4)' }}>
                  {item.retailer} · {item.date}
                </div>
              </div>
              <div
                className="font-display font-bold text-sm flex-shrink-0"
                style={{ color: '#1F4F3D' }}
              >
                +{item.pts.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── What's next banner ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl px-4 py-3.5 mb-5 flex items-center gap-3"
        style={{ background: 'rgba(31,79,61,0.07)', border: '1px solid rgba(31,79,61,0.12)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: '#D6EDE5' }}
        >
          💡
        </div>
        <div>
          <div className="font-display font-semibold text-ink-900 text-sm">Auto-scan is on</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(14,20,16,0.5)' }}>
            Future receipts are detected automatically — no action needed.
          </div>
        </div>
      </motion.div>

      {/* ── CTAs ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mt-auto space-y-3 pt-1 pb-1"
      >
        <button
          onClick={completeFlow}
          className="w-full font-display font-semibold text-sm rounded-pill transition-all active:scale-[0.97] bg-ink-900 text-cream-100"
          style={{ height: 52 }}
        >
          Start shopping with points →
        </button>
        <button
          onClick={completeFlow}
          className="w-full text-xs font-medium py-2 text-center hover:text-ink-700 transition-colors"
          style={{ color: 'rgba(14,20,16,0.35)' }}
        >
          View full transaction history
        </button>
      </motion.div>
    </div>
  );
}
