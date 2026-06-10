import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, RotateCcw, Bug, X, BarChart3, ShoppingBag,
  Download, ArrowRight, Zap, Mail, Send, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { EMAIL_TYPES, sendTransactionalEmail } from '../services/transactionalEmail';

const DELAY_OPTIONS = [3, 5, 10, 30];

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex-shrink-0 focus:outline-none"
      aria-pressed={value}
    >
      <div
        className="w-8 h-4 rounded-full transition-colors relative"
        style={{ background: value ? '#1F4F3D' : '#CBD5E1' }}
      >
        <div
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform"
          style={{ transform: value ? 'translateX(16px)' : 'translateX(2px)' }}
        />
      </div>
    </button>
  );
}

// ── Async download helper ─────────────────────────────────────────────────────
async function capturePlacement(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`[DemoControls] Element #${elementId} not found`);
    return false;
  }
  try {
    const canvas = await html2canvas(el, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (err) {
    console.error('[DemoControls] html2canvas error:', err);
    return false;
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export function DemoControls({ onOpenDebug }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(null);

  // ── Transactional email state ───────────────────────────────────────────────
  const [emailTo, setEmailTo] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailType, setEmailType] = useState(EMAIL_TYPES[0].id);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'sent' | 'error' | null
  const [emailError, setEmailError] = useState('');

  const app = useApp();
  const {
    resetDemo, openFlow, goToStep, results, goToRewards,
    showTopBanner,     setShowTopBanner,
    showBottomBanner,  setShowBottomBanner,
    showProductBanner, setShowProductBanner,
    showRewardsBanner, setShowRewardsBanner,
    popupAutoEnabled,  setPopupAutoEnabled,
    popupAutoDelay,    setPopupAutoDelay,
    useLiveOAuth,      setUseLiveOAuth,
  } = app;

  const navigate = useNavigate();
  const location = useLocation();
  const isMerchant = location.pathname === '/brand-analytics';

  // ── Download handler ────────────────────────────────────────────────────────
  const handleDownload = useCallback(async (placement) => {
    if (!placement.captureId) return;
    setDownloading(placement.captureId);

    try {
      // 1. Ensure placement is visible
      const wasVisible = placement.visible;
      if (!wasVisible && placement.setter) placement.setter(true);

      // 2. Navigate if needed
      if (placement.route && location.pathname !== placement.route) {
        navigate(placement.route);
        await new Promise((r) => setTimeout(r, 400));
      } else if (placement.useRewards) {
        goToRewards();
        await new Promise((r) => setTimeout(r, 300));
      }

      // 3. Wait for render
      await new Promise((r) => setTimeout(r, 500));

      // 4. Scroll element into view
      const el = document.getElementById(placement.captureId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise((r) => setTimeout(r, 350));
      }

      // 5. Capture + download
      await capturePlacement(
        placement.captureId,
        `oriva-${placement.label.toLowerCase().replace(/ /g, '-')}.png`
      );

      // 6. Restore hidden state
      if (!wasVisible && placement.setter) placement.setter(false);
    } finally {
      setDownloading(null);
    }
  }, [location.pathname, navigate, goToRewards]);

  // ── Placement definitions ───────────────────────────────────────────────────
  const placements = [
    {
      label: 'Top Banner',
      captureId: 'capture-top-banner',
      visible: showTopBanner,
      setter: setShowTopBanner,
      route: '/',
      onJump: () => {
        navigate('/');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150);
        setOpen(false);
      },
    },
    {
      label: 'Bottom Banner',
      captureId: 'capture-bottom-banner',
      visible: showBottomBanner,
      setter: setShowBottomBanner,
      route: '/',
      onJump: () => {
        navigate('/');
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 350);
        setOpen(false);
      },
    },
    {
      label: 'Product Page',
      captureId: 'capture-product-banner',
      visible: showProductBanner,
      setter: setShowProductBanner,
      route: '/product/1',
      onJump: () => {
        navigate('/product/1');
        setTimeout(() => {
          document.getElementById('capture-product-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
        setOpen(false);
      },
    },
    {
      label: 'Rewards Banner',
      captureId: 'capture-rewards-banner',
      visible: showRewardsBanner,
      setter: setShowRewardsBanner,
      useRewards: true,
      onJump: () => {
        goToRewards();
        setTimeout(() => {
          document.getElementById('capture-rewards-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 450);
        setOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="mb-3 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Demo Controls</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── View toggle ─────────────────────────────────────────── */}
            <div className="mb-4">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                View
              </label>
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
                  onClick={() => { navigate('/brand-analytics'); setOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isMerchant ? 'bg-[#1F4F3D] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BarChart3 size={12} />
                  Merchant
                </button>
              </div>
            </div>

            {/* ── Touchpoint placements ───────────────────────────────── */}
            <div className="mb-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Touchpoints
                </label>
                <span className="text-[10px] text-slate-400 font-medium">toggle · jump · export</span>
              </div>

              <div className="space-y-0.5">
                {placements.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-xl group hover:bg-slate-50 transition-colors"
                  >
                    {/* Toggle */}
                    <Toggle value={p.visible} onChange={p.setter} />

                    {/* Label */}
                    <span
                      className="flex-1 text-xs font-medium transition-colors"
                      style={{ color: p.visible ? '#1E293B' : '#94A3B8' }}
                    >
                      {p.label}
                    </span>

                    {/* Jump */}
                    <button
                      onClick={p.onJump}
                      title={`Go to ${p.label}`}
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#1F4F3D] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ArrowRight size={12} />
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(p)}
                      disabled={!!downloading}
                      title={`Export ${p.label}`}
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#1F4F3D] opacity-0 group-hover:opacity-100 transition-all disabled:pointer-events-none"
                    >
                      {downloading === p.captureId ? (
                        <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download size={12} />
                      )}
                    </button>
                  </div>
                ))}

                {/* Pop-up row — jump only */}
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-xl group hover:bg-slate-50 transition-colors">
                  {/* Spacer where toggle would be (jump-to opens the popup directly) */}
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    <Zap size={13} className="text-slate-300" />
                  </div>
                  <span className="flex-1 text-xs font-medium text-slate-700">Pop-up</span>
                  <button
                    onClick={() => { navigate('/'); openFlow(); setOpen(false); }}
                    title="Open pop-up"
                    className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#1F4F3D] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ArrowRight size={12} />
                  </button>
                  <div className="w-6" />
                </div>
              </div>
            </div>

            {/* ── Auto Pop-up ─────────────────────────────────────────── */}
            <div className="mt-3 mb-4 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Toggle value={popupAutoEnabled} onChange={setPopupAutoEnabled} />
                <span className="flex-1 text-xs font-semibold text-slate-700">Auto Pop-up</span>
                {popupAutoEnabled && (
                  <span className="text-[10px] text-slate-400">fires after delay</span>
                )}
              </div>
              <AnimatePresence>
                {popupAutoEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-1.5 pl-10 pb-1">
                      {DELAY_OPTIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setPopupAutoDelay(d)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: popupAutoDelay === d ? '#1F4F3D' : '#F1F5F9',
                            color: popupAutoDelay === d ? '#F5EBDD' : '#64748B',
                          }}
                        >
                          {d}s
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Live OAuth toggle ───────────────────────────────────── */}
            <div className="mb-4 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Toggle value={useLiveOAuth} onChange={setUseLiveOAuth} />
                <span className="flex-1 text-xs font-semibold text-slate-700">Use live OAuth</span>
                {useLiveOAuth ? (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide"
                    style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                  >
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">mock</span>
                )}
              </div>
              {useLiveOAuth && (
                <p className="mt-1.5 ml-10 text-[10px] text-amber-600 leading-tight">
                  Google consent → real OAuth service
                </p>
              )}
            </div>

            {/* ── Transactional Emails ────────────────────────────────── */}
            <div className="mb-4 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2 mb-2.5">
                <Mail size={12} className="text-slate-400 flex-shrink-0" />
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Transactional Email
                </label>
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="recipient@email.com"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
                <input
                  type="text"
                  placeholder="First name"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  {EMAIL_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>

                <button
                  onClick={async () => {
                    if (!emailTo || !emailName) return;
                    setEmailSending(true);
                    setEmailStatus(null);
                    try {
                      await sendTransactionalEmail({ type: emailType, toEmail: emailTo, firstName: emailName });
                      setEmailStatus('sent');
                      setTimeout(() => setEmailStatus(null), 4000);
                    } catch (err) {
                      console.error('[DemoControls] Email error:', err);
                      setEmailError(err?.text || err?.message || String(err));
                      setEmailStatus('error');
                      setTimeout(() => setEmailStatus(null), 8000);
                    } finally {
                      setEmailSending(false);
                    }
                  }}
                  disabled={emailSending || !emailTo || !emailName}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none"
                  style={{ background: '#1F4F3D', color: '#F5EBDD' }}
                >
                  {emailSending ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                  {emailSending ? 'Sending…' : 'Send Email'}
                </button>

                <AnimatePresence>
                  {emailStatus === 'sent' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl"
                    >
                      <CheckCircle size={11} />
                      Email sent to {emailTo}
                    </motion.div>
                  )}
                  {emailStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-1.5 text-[11px] font-medium text-red-700 bg-red-50 px-3 py-2 rounded-xl"
                    >
                      <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />
                      <span>{emailError || 'Send failed — check console for details'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Debug panel ─────────────────────────────────────────── */}
            {onOpenDebug && (
              <button
                onClick={() => { onOpenDebug(); setOpen(false); }}
                className="w-full flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-emerald-400 hover:bg-slate-800 text-xs font-mono font-semibold transition-all mb-3"
              >
                <Bug size={12} />
                Debug Panel
                {results.length > 0 && (
                  <span className="ml-auto bg-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded-full text-xs">
                    {results.length}
                  </span>
                )}
              </button>
            )}

            {/* ── Reset ───────────────────────────────────────────────── */}
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

      {/* ── FAB toggle ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2.5 rounded-xl shadow-lg hover:bg-[#2a4f82] transition-all font-semibold text-sm"
        >
          <Settings
            size={15}
            className="transition-transform duration-300"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
          Demo Controls
        </button>
      </div>
    </div>
  );
}
