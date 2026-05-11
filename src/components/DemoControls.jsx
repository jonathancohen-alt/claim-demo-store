import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RotateCcw, Bug, X, BarChart3, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function DemoControls({ onOpenDebug }) {
  const [open, setOpen] = useState(false);
  const { debugMode, setDebugMode, resetDemo, openFlow, goToStep, results } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isMerchant = location.pathname === '/merchant';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="mb-3 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-64"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Demo Controls</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            {/* View toggle */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">View</label>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { navigate('/'); setOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !isMerchant ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ShoppingBag size={12} />
                  Shopper
                </button>
                <button
                  onClick={() => { navigate('/merchant'); setOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isMerchant ? 'bg-[#1F4F3D] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BarChart3 size={12} />
                  Merchant
                </button>
              </div>
            </div>

            {/* Jump to step */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Jump to Flow Step</label>

              {/* Active flow steps */}
              <div className="flex gap-1.5 mb-2">
                {[
                  { label: 'Hook', i: 0, emoji: '🪝' },
                  { label: 'Rewards', i: 4, emoji: '🎉' },
                ].map(({ label, i, emoji }) => (
                  <button
                    key={label}
                    onClick={() => {
                      navigate('/');
                      openFlow();
                      setTimeout(() => goToStep(i), 50);
                      setOpen(false);
                    }}
                    className="flex-1 py-2 text-xs rounded-lg bg-[#1F4F3D] text-white hover:bg-[#2a6b52] transition-all font-semibold"
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>

            </div>

            {/* Debug drawer button */}
            {onOpenDebug && (
              <button
                onClick={() => { onOpenDebug(); setOpen(false); }}
                className="w-full flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-emerald-400 hover:bg-slate-800 text-xs font-mono font-semibold transition-all mb-3"
              >
                <Bug size={12} />
                Open Debug Panel
                {results.length > 0 && (
                  <span className="ml-auto bg-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded-full text-xs">
                    {results.length}
                  </span>
                )}
              </button>
            )}

            {/* Reset */}
            <button
              onClick={() => { resetDemo(); navigate('/'); setOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition-all"
            >
              <RotateCcw size={12} />
              Reset Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button row */}
      <div className="flex items-center gap-2">
        {/* Demo Controls toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2.5 rounded-xl shadow-lg hover:bg-[#2a4f82] transition-all font-semibold text-sm"
        >
          <Settings size={15} className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
          Demo Controls
        </button>
      </div>
    </div>
  );
}
