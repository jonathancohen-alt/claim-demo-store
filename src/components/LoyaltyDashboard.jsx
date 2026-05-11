import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRAND_CATALOG, RETAILER_CONFIG } from '../config/constants';
import { OrivaLogo } from './brand/Logo';

function ActivityRow({ item, index }) {
  const brand = BRAND_CATALOG[item.brandKey];
  const retailer = item.retailer && RETAILER_CONFIG[item.retailer];
  const dateStr = item.orderDate
    ? new Date(item.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05 }}
      className="flex items-center gap-3 py-3.5 border-b border-ink-900/8 last:border-0"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: brand?.color ? `${brand.color}1A` : '#0E14100D' }}
      >
        {brand?.emoji || '🌿'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-display font-semibold text-ink-900 truncate">
          {brand?.displayName || item.matchedBrand}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {retailer && (
            <span className="text-xs font-medium" style={{ color: retailer.color }}>
              {retailer.displayName}
            </span>
          )}
          {dateStr && <span className="text-xs text-ink-700/50">· {dateStr}</span>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold text-forest-700">+{item.points} pts</div>
        {item.price && <div className="text-xs text-ink-700/50">${item.price.toFixed(2)}</div>}
      </div>
    </motion.div>
  );
}

const DEMO_ITEMS = [
  { brandKey: 'toybox', retailer: 'amazon',  orderDate: '2024-11-12', points: 450, price: 26.00 },
  { brandKey: 'toybox', retailer: 'target',  orderDate: '2024-11-08', points: 280, price: 18.00 },
  { brandKey: 'toybox', retailer: 'walmart', orderDate: '2024-10-30', points: 340, price: 22.00 },
  { brandKey: 'toybox', retailer: 'amazon',  orderDate: '2024-10-22', points: 520, price: 34.00 },
  { brandKey: 'toybox', retailer: 'target',  orderDate: '2024-10-15', points: 180, price: 18.00 },
  { brandKey: 'toybox', retailer: 'walmart', orderDate: '2024-10-10', points: 260, price: 22.00 },
];

export function LoyaltyDashboard() {
  const { openFlow, resetDemo } = useApp();

  const points = 5300;
  const dollarValue = (points / 100).toFixed(2);
  const items = DEMO_ITEMS;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Flat nav — matches storefront */}
      <nav className="sticky top-0 z-30 bg-cream-100 border-b border-ink-900/8">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <OrivaLogo size={22} color="#1F4F3D" textColor="#0E1410" />
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 transition"
          >
            <ShoppingBag size={14} strokeWidth={1.6} />
            Back to shop
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-3 py-5 space-y-4">
        {/* ── Hero balance card ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-4xl overflow-hidden p-7 bg-grain"
          style={{ background: '#7B8DD4' }}
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 blur-3xl"
            style={{ background: '#E8A98C' }} />
          <div className="absolute -bottom-16 -left-12 w-44 h-44 rounded-full opacity-30 blur-3xl"
            style={{ background: '#A8C4B0' }} />

          <div className="relative">
            <div className="text-cream-100/80 text-xs font-medium uppercase tracking-[0.18em] mb-3">
              ORIVA Rewards · Member
            </div>
            <div
              className="font-display text-cream-100 leading-none tracking-tightest"
              style={{ fontSize: 'clamp(3.4rem, 12vw, 4.6rem)', fontWeight: 800 }}
            >
              {points.toLocaleString()}
            </div>
            <div className="text-cream-100/85 text-base mt-1 font-medium">points</div>

            <div className="mt-5 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-pill">
              ≈ ${dollarValue} in rewards
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { label: 'Receipts', value: 23 },
            { label: 'Brands',   value: 1  },
            { label: 'Retailers', value: 4 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl px-4 py-3.5 border border-ink-900/8">
              <div className="text-2xl font-display font-bold text-ink-900 leading-none">{s.value}</div>
              <div className="text-xs text-ink-700/60 mt-1.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Recent activity ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-ink-900/8 px-5"
        >
          <div className="py-4 border-b border-ink-900/8 flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900">Recent activity</h2>
            <span className="text-xs text-ink-700/50">{items.length} purchase{items.length !== 1 ? 's' : ''}</span>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-ink-700/50 text-sm">
              No matched purchases yet
            </div>
          ) : (
            <div>
              {items.map((item, i) => (
                <ActivityRow key={`${item.brandKey}-${i}`} item={item} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Scan again ──────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          onClick={openFlow}
          className="w-full flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-pill border-2 border-ink-900/15 py-3.5 text-ink-900 hover:border-ink-900/30 transition-colors"
        >
          Scan again
        </motion.button>
      </div>
    </div>
  );
}
