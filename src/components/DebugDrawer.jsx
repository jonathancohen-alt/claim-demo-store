import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Download, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

function EmailDebugRow({ receipt, index }) {
  const [open, setOpen] = useState(false);
  const meta = receipt._meta || {};

  const statusIcon = receipt.is_receipt && receipt.matchedItems?.length > 0
    ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
    : receipt.is_receipt
    ? <Clock size={13} className="text-amber-500 flex-shrink-0" />
    : <XCircle size={13} className="text-slate-400 flex-shrink-0" />;

  const statusLabel = receipt.is_receipt && receipt.matchedItems?.length > 0
    ? `${receipt.matchedItems.length} brand match${receipt.matchedItems.length !== 1 ? 'es' : ''} · +${receipt.totalPoints} pts`
    : receipt.is_receipt
    ? 'Receipt — no catalog matches'
    : receipt._fetchError
    ? 'Fetch error'
    : 'Not a receipt';

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="mt-0.5">{statusIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-slate-300 truncate">
            {meta.subject || receipt._meta?.messageId || `Email ${index + 1}`}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 truncate">{meta.from || '—'}</span>
            {meta.processingMs && (
              <span className="text-xs text-slate-600">{meta.processingMs}ms</span>
            )}
          </div>
          <div className="text-xs mt-0.5" style={{
            color: receipt.matchedItems?.length > 0 ? '#10B981'
              : receipt.is_receipt ? '#F59E0B'
              : '#64748B'
          }}>
            {statusLabel}
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-600 mt-0.5">
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Claude extraction */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Claude Extraction
                </div>
                <pre className="text-xs font-mono text-emerald-400 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
{JSON.stringify({
  is_receipt: receipt.is_receipt,
  retailer: receipt.retailer,
  order_id: receipt.order_id,
  order_date: receipt.order_date,
  confidence: receipt.confidence,
  items: receipt.items,
  subtotal: receipt.subtotal,
  total: receipt.total,
  tax: receipt.tax,
  shipping: receipt.shipping,
}, null, 2)}
                </pre>
              </div>

              {/* Match results */}
              {receipt.is_receipt && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Brand Matching
                  </div>
                  <pre className="text-xs font-mono text-blue-400 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
{JSON.stringify({
  matched: (receipt.matchedItems || []).map(i => ({
    name: i.name,
    brand: i.matchedBrand,
    method: i.matchMethod,
    confidence: i.matchConfidence,
    points: i.points,
    price: i.price,
  })),
  unmatched_count: receipt.unmatchedItems?.length || 0,
  total_points: receipt.totalPoints,
}, null, 2)}
                  </pre>
                </div>
              )}

              {/* Raw parse error */}
              {meta.error && (
                <div className="bg-red-950 border border-red-800 rounded-lg p-3 text-xs text-red-400 font-mono">
                  Error: {meta.error}
                </div>
              )}

              {/* Parse success flag */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>Parse: {meta.parseSuccess === false ? '❌ Failed' : meta.parseSuccess ? '✓ OK' : '—'}</span>
                {receipt.confidence != null && (
                  <span>Confidence: {Math.round(receipt.confidence * 100)}%</span>
                )}
                {meta.processingMs && <span>⏱ {meta.processingMs}ms</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DebugDrawer({ open, onClose }) {
  const { results, stats, scanDate } = useApp();
  const [activeTab, setActiveTab] = useState('emails'); // emails | stats | raw

  function handleExport() {
    const blob = new Blob([JSON.stringify({ scanDate, stats, results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnichannel-debug-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const receipts = results.filter(r => r.is_receipt);
  const matched = results.filter(r => r.matchedItems?.length > 0);
  const errors = results.filter(r => r._meta?.parseSuccess === false || r._fetchError);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          {/* Drawer — slides in from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 420, background: '#0F172A', borderLeft: '1px solid #1E293B' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  🐛 Debug Panel
                  <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                    {results.length} emails
                  </span>
                </div>
                {scanDate && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    Last scan: {new Date(scanDate).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {results.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
                  >
                    <Download size={11} />
                    Export JSON
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Summary pills */}
            {results.length > 0 && (
              <div className="flex gap-2 px-4 py-3 border-b border-slate-800 flex-wrap">
                {[
                  { label: 'Scanned', val: results.length, color: '#94A3B8' },
                  { label: 'Receipts', val: receipts.length, color: '#F97316' },
                  { label: 'Matched', val: matched.length, color: '#10B981' },
                  { label: 'Points', val: stats.totalPoints?.toLocaleString() || 0, color: '#16A34A' },
                  ...(errors.length > 0 ? [{ label: 'Errors', val: errors.length, color: '#EF4444' }] : []),
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1 text-xs bg-slate-800 px-2.5 py-1 rounded-full">
                    <span style={{ color: s.color }} className="font-bold">{s.val}</span>
                    <span className="text-slate-500">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-800 px-4 gap-1">
              {[
                { key: 'emails', label: `Emails (${results.length})` },
                { key: 'stats', label: 'Stats' },
                { key: 'raw', label: 'Raw JSON' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#F97316] text-[#F97316]'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="text-4xl mb-3">📭</div>
                  <div className="text-slate-400 font-semibold text-sm mb-2">No scan data yet</div>
                  <div className="text-slate-600 text-xs leading-relaxed">
                    Go through the flow, connect Gmail, and complete the scan.
                    All raw API responses will appear here.
                  </div>
                </div>
              ) : activeTab === 'emails' ? (
                <div>
                  {results.map((r, i) => (
                    <EmailDebugRow key={r._meta?.messageId || i} receipt={r} index={i} />
                  ))}
                </div>
              ) : activeTab === 'stats' ? (
                <div className="p-4 space-y-4">
                  <StatSection title="Pipeline Summary" items={[
                    ['Emails scanned', results.length],
                    ['Receipts identified', receipts.length],
                    ['Parse errors', errors.length],
                    ['Brands matched', stats.brandsMatched || 0],
                    ['Total points', stats.totalPoints || 0],
                    ['Total spend identified', `$${(stats.totalSpend || 0).toFixed(2)}`],
                  ]} />
                  <StatSection title="Gmail Query" items={[
                    ['Query', 'from:(walmart OR target OR amazon OR bestbuy OR kohls OR sephora OR ulta OR chewy OR "home depot" OR lowes) subject:(order OR receipt OR confirmation OR shipped OR delivered) newer_than:1y'],
                    ['Max results', 50],
                    ['API', 'https://gmail.googleapis.com/gmail/v1/users/me/messages'],
                  ]} />
                  <StatSection title="Claude API" items={[
                    ['Model', 'claude-sonnet-4-20250514'],
                    ['Max tokens', 1024],
                    ['Truncation', '15,000 chars'],
                    ['Avg parse time', results.filter(r=>r._meta?.processingMs).length > 0
                      ? Math.round(results.filter(r=>r._meta?.processingMs).reduce((s,r)=>s+(r._meta.processingMs||0),0) / results.filter(r=>r._meta?.processingMs).length) + 'ms'
                      : '—'],
                  ]} />
                </div>
              ) : (
                <div className="p-4">
                  <pre className="text-xs font-mono text-emerald-400 bg-slate-950 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify({ scanDate, stats, results }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatSection({ title, items }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{title}</div>
      <div className="bg-slate-800 rounded-xl divide-y divide-slate-700/50">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-3 px-3 py-2.5">
            <span className="text-xs text-slate-400 flex-shrink-0">{k}</span>
            <span className="text-xs font-mono text-slate-200 text-right break-all">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
