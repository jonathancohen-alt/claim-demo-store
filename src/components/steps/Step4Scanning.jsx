import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useScan } from '../../hooks/useScan';
import { RETAILER_CONFIG } from '../../config/constants';

function detectRetailer(from = '', subject = '') {
  const combined = `${from} ${subject}`.toLowerCase();
  for (const [key, cfg] of Object.entries(RETAILER_CONFIG)) {
    for (const domain of cfg.domains) {
      if (combined.includes(domain.toLowerCase())) return key;
    }
  }
  return null;
}

// Brand-colored progress ring
function ProgressRing({ progress = 0, size = 96, stroke = 6 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(14,20,16,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke="#1F4F3D"
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

function RetailerCard({ retailerKey, processed, index }) {
  const cfg = RETAILER_CONFIG[retailerKey];
  if (!cfg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.32, type: 'spring', stiffness: 220 }}
      className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: 'rgba(14,20,16,0.04)', border: '1px solid rgba(14,20,16,0.07)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: cfg.bgColor || '#EDE8F5' }}
      >
        {cfg.emoji}
      </div>
      <div className="flex-1">
        <div className="font-display font-semibold text-ink-900 text-sm">{cfg.displayName}</div>
        <div className="text-xs text-ink-700/50">Scanning receipts…</div>
      </div>
      <AnimatePresence>
        {processed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#D6EDE5' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#1F4F3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Step4Scanning() {
  const { token, isAuthenticated, nextStep, saveResults } = useApp();
  const { scanState, progress, processedEmails, startScan, startDemoScan } = useScan();
  const startedRef = useRef(false);
  const [seenRetailers, setSeenRetailers] = useState([]);
  const [processedRetailers, setProcessedRetailers] = useState(new Set());

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const onComplete = (processed, aggregated) => {
      saveResults(processed, {
        emailsFound: aggregated.totalEmailsScanned,
        receiptsIdentified: aggregated.totalReceipts,
        brandsMatched: aggregated.brandsMatched,
        totalPoints: aggregated.totalPoints,
        totalSpend: aggregated.totalSpend,
      });
    };
    if (isAuthenticated && token) {
      startScan(token, onComplete);
    } else {
      startDemoScan(onComplete);
    }
  }, []);

  useEffect(() => {
    for (const email of processedEmails) {
      const from = email._meta?.from || '';
      const subject = email._meta?.subject || '';
      const retailerKey = detectRetailer(from, subject) || email.retailer;
      if (retailerKey && retailerKey !== 'unknown') {
        setSeenRetailers((prev) => prev.includes(retailerKey) ? prev : [...prev, retailerKey]);
        if (email._meta) setProcessedRetailers((prev) => new Set([...prev, retailerKey]));
      }
    }
  }, [processedEmails]);

  useEffect(() => {
    if (scanState === 'complete') {
      const t = setTimeout(nextStep, 1200);
      return () => clearTimeout(t);
    }
  }, [scanState, nextStep]);

  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  const isActive = ['searching', 'fetching', 'parsing', 'matching'].includes(scanState);
  const displayPct = isActive && progress.total === 0 ? 25 : pct;
  const isDone = scanState === 'complete';

  return (
    <div className="flex flex-col h-full">

      {/* Ring + status */}
      <div className="flex flex-col items-center mb-7">
        <div className="relative">
          <ProgressRing progress={displayPct} size={100} stroke={6} />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1.6, repeat: isActive ? Infinity : 0 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: isDone ? '#D6EDE5' : 'rgba(31,79,61,0.10)' }}
            >
              {isDone ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10.5L8 14.5L16 6" stroke="#1F4F3D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="#1F4F3D" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
                  <circle cx="9" cy="3" r="1.5" fill="#1F4F3D"/>
                </svg>
              )}
            </motion.div>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display font-bold text-ink-900 text-center mt-5 mb-1 tracking-tightest"
          style={{ fontSize: '1.75rem' }}
        >
          {isDone ? 'All done!' : 'Looking for your rewards…'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-ink-700/55 text-sm text-center"
        >
          {isDone
            ? `Found ${progress.receiptsIdentified || 0} receipts, ${progress.brandsMatched || 0} brand matches`
            : progress.stageLabel || 'Scanning your inbox for receipts…'}
        </motion.p>

        {progress.total > 0 && (
          <div className="text-xs text-ink-700/40 mt-1">
            {progress.current} of {progress.total} emails
          </div>
        )}
      </div>

      {/* Retailer cards */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {seenRetailers.length === 0 && isActive && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-center text-sm text-ink-700/40 py-6"
          >
            Searching your inbox…
          </motion.div>
        )}
        {seenRetailers.map((key, i) => (
          <RetailerCard key={key} retailerKey={key} processed={processedRetailers.has(key)} index={i} />
        ))}
      </div>

    </div>
  );
}
