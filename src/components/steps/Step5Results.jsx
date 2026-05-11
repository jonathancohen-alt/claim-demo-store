import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { BRAND_CATALOG, RETAILER_CONFIG } from '../../config/constants';

function CountUp({ target, duration = 1400, className, style }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (target === 0) { setVal(0); return; }
    function step(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return <span className={className} style={style}>{val.toLocaleString()}</span>;
}

function PurchaseCard({ item, index }) {
  const brand = BRAND_CATALOG[item.brandKey];
  const dateStr = item.orderDate
    ? new Date(item.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.28 }}
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
      style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: '#F5EBDD', border: '1px solid rgba(14,20,16,0.08)' }}
      >
        {brand?.emoji || '🏷️'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-ink-900 text-sm leading-snug truncate">
          {brand?.displayName || item.matchedBrand}
          <span className="text-ink-700/40 font-normal"> — </span>
          <span className="font-medium text-ink-700/80">{item.name}</span>
        </div>
        <div className="text-xs text-ink-700/45 mt-0.5">{dateStr}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-display font-bold text-sm" style={{ color: '#1F4F3D' }}>
          +{(item.points || 0).toLocaleString()} pts
        </div>
        {item.price > 0 && (
          <div className="text-xs text-ink-700/45">${item.price.toFixed(2)}</div>
        )}
      </div>
    </motion.div>
  );
}

function OtherBrandCard({ brandKey, count, index }) {
  const brand = BRAND_CATALOG[brandKey];
  if (!brand) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.06 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
    >
      <div className="text-2xl mb-2">{brand.emoji}</div>
      <div className="font-display font-semibold text-ink-900 text-sm">{brand.displayName}</div>
      <div className="text-xs text-ink-700/50 mt-0.5">{count} purchase{count !== 1 ? 's' : ''}</div>
    </motion.div>
  );
}

export function Step5Results() {
  const { allMatchedItems, stats, completeFlow, nextStep, results } = useApp();

  const items = [...allMatchedItems]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 12);

  const totalPoints = stats.totalPoints || 0;
  const dollarsValue = (totalPoints / 100).toFixed(2);

  const matchedBrandKeys = new Set(items.map((i) => i.brandKey));
  const otherBrandCounts = {};
  for (const receipt of results || []) {
    for (const item of receipt.unmatchedItems || []) {
      if (!item.brand) continue;
      const norm = item.brand.toLowerCase();
      for (const [key, brand] of Object.entries(BRAND_CATALOG)) {
        if (matchedBrandKeys.has(key)) continue;
        if (brand.aliases.some((a) => norm.includes(a))) {
          otherBrandCounts[key] = (otherBrandCounts[key] || 0) + 1;
        }
      }
    }
  }
  const otherBrands = Object.entries(otherBrandCounts).slice(0, 4);
  const retailerCount = new Set(items.map((i) => i.retailer).filter(Boolean)).size;
  const totalSpend = stats.totalSpend || 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Scan complete pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 self-start"
        style={{ background: '#D6EDE5', color: '#1F4F3D' }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="6" stroke="#1F4F3D" strokeWidth="1.2"/>
          <path d="M4 6.5L5.8 8.3L9 5" stroke="#1F4F3D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Scan complete
      </motion.div>

      {/* Points headline */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-2">
        <div className="text-ink-700/60 text-sm font-medium mb-1">You've earned</div>
        <div className="flex items-baseline gap-2 flex-wrap font-display">
          <CountUp
            target={totalPoints}
            style={{ fontSize: '3.4rem', fontWeight: 800, color: '#1F4F3D', letterSpacing: '-0.04em', lineHeight: 1 }}
          />
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0E1410', letterSpacing: '-0.03em', lineHeight: 1 }}>
            points
          </span>
        </div>
        <p className="text-ink-700/60 text-sm mt-2">
          That's <span className="font-semibold text-ink-900">${dollarsValue}</span> in ORIVA rewards.
        </p>
      </motion.div>

      {/* Purchase cards */}
      {items.length > 0 ? (
        <div className="space-y-2 my-5">
          {items.map((item, i) => (
            <PurchaseCard key={`${item.brandKey}-${i}`} item={item} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="my-6 p-5 rounded-2xl text-center"
          style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
        >
          <div className="text-3xl mb-2">📭</div>
          <div className="font-display font-semibold text-ink-900 text-sm mb-1">No catalog matches found</div>
          <div className="text-xs text-ink-700/50">
            We scanned {stats.receiptsIdentified || 0} receipt{stats.receiptsIdentified !== 1 ? 's' : ''} but none matched brands in our catalog.
          </div>
        </motion.div>
      )}

      {/* More rewards waiting */}
      {otherBrands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <div className="mb-4" style={{ height: 1, background: 'rgba(14,20,16,0.08)' }} />
          <h3 className="font-display font-bold text-ink-900 mb-1">More rewards waiting</h3>
          <p className="text-ink-700/60 text-sm mb-3">
            We found purchases from {otherBrands.length} other brand{otherBrands.length !== 1 ? 's' : ''} you can earn rewards with.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {otherBrands.map(([key, count], i) => (
              <OtherBrandCard key={key} brandKey={key} count={count} index={i} />
            ))}
          </div>
          {totalSpend > 0 && (
            <div
              className="rounded-2xl px-4 py-2.5 text-sm text-center mb-3"
              style={{ background: '#EDE8F5', color: '#5C4A9A', border: '1px solid rgba(155,130,220,0.25)' }}
            >
              Total found: <span className="font-semibold">${totalSpend.toFixed(2)}</span>
              {retailerCount > 0 && ` across ${retailerCount} retailer${retailerCount !== 1 ? 's' : ''}`}
            </div>
          )}
          <button
            className="w-full font-display font-semibold text-sm rounded-pill py-3 transition-all active:scale-[0.97]"
            style={{ border: '1.5px solid rgba(14,20,16,0.14)', color: '#0E1410', background: 'white' }}
          >
            Unlock these rewards too →
          </button>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-auto space-y-3 pt-2 pb-1"
      >
        <button
          onClick={nextStep}
          className="w-full font-display font-semibold text-sm rounded-pill transition-all active:scale-[0.97] bg-ink-900 text-cream-100"
          style={{ height: 52 }}
        >
          Go to my rewards →
        </button>
        <button className="w-full text-ink-700/40 text-xs font-medium py-2 hover:text-ink-700 transition-colors flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity="0.7">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 1a4 4 0 110 8A4 4 0 016 2zm-.5 2v3.25l2.6 1.5.5-.87-2.1-1.21V4H5.5z"/>
          </svg>
          Manage brands
        </button>
      </motion.div>
    </div>
  );
}
