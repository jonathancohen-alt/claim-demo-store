import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function TopBanner() {
  const { openFlow } = useApp();
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          id="capture-top-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden relative z-50"
          style={{ background: '#0E1410' }}
        >
          {/* Subtle blur blobs — same language as other claim placements */}
          <div className="absolute -top-6 left-[30%] w-40 h-12 rounded-full opacity-25 blur-2xl pointer-events-none"
            style={{ background: '#7B8DD4' }} />
          <div className="absolute -top-6 right-[20%] w-32 h-12 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ background: '#E8568C' }} />

          <div className="relative max-w-screen-xl mx-auto px-4 h-10 flex items-center justify-between gap-4">
            {/* Left spacer to balance dismiss button */}
            <div className="w-6 flex-shrink-0" />

            {/* Copy + CTA */}
            <button
              onClick={openFlow}
              className="flex items-center gap-2.5 group"
            >
              <span className="text-cream-100/60 text-xs hidden sm:inline">🌿</span>
              <span className="text-cream-100 text-xs font-medium">
                Earn points on every purchase — even on Amazon and Walmart.
              </span>
              <span
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-pill flex-shrink-0 transition-colors group-hover:bg-white"
                style={{ background: '#F5EBDD', color: '#0E1410' }}
              >
                Claim now →
              </span>
            </button>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="w-6 h-6 flex items-center justify-center text-cream-100/40 hover:text-cream-100 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
