import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRAND_CATALOG, RETAILER_CONFIG, DEMO_BRAND } from '../config/constants';
import { OrivaLogo } from './brand/Logo';
import { Footer } from './brand/Footer';

// ─── Activity row ─────────────────────────────────────────────────────────────
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

// ─── Earn card (image-based) ──────────────────────────────────────────────────
function EarnCard({ image, label, sub, value, highlight, onClick }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onClick}
      className="relative flex-none rounded-3xl overflow-hidden group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-800"
      style={{ width: 220, height: 300 }}
    >
      {/* Photo */}
      {!imgErr && image ? (
        <img
          src={image}
          alt={label}
          onError={() => setImgErr(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: '#9AAAE0' }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(14,20,16,0.82) 0%, rgba(14,20,16,0.22) 55%, transparent 78%)' }}
      />

      {/* Points pill — top right */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-pill"
          style={{ background: 'rgba(245,235,221,0.92)', color: '#0E1410' }}
        >
          {value}
        </span>
        {highlight && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-pill"
            style={{ background: '#1F4F3D', color: '#F5EBDD' }}
          >
            Connect →
          </span>
        )}
      </div>

      {/* Text — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-display font-bold text-cream-100 text-base leading-snug">
          {label}
        </div>
        {sub && (
          <div className="text-cream-100/65 text-xs mt-1 leading-snug">{sub}</div>
        )}
      </div>
    </button>
  );
}

// ─── Redeem tile ──────────────────────────────────────────────────────────────
function RedeemTile({ dollars, points }) {
  return (
    <div
      className="rounded-2xl px-4 py-4 flex flex-col gap-1.5 border border-ink-900/10"
      style={{ background: 'white' }}
    >
      <div
        className="font-display font-extrabold text-xl tracking-tightest"
        style={{ color: '#1F4F3D' }}
      >
        ${dollars} off
      </div>
      <div className="text-xs font-medium text-ink-700/55">{points} points</div>
    </div>
  );
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_ITEMS = [
  { brandKey: 'toybox', retailer: 'amazon',  orderDate: '2024-11-12', points: 450, price: 26.00 },
  { brandKey: 'toybox', retailer: 'target',  orderDate: '2024-11-08', points: 280, price: 18.00 },
  { brandKey: 'toybox', retailer: 'walmart', orderDate: '2024-10-30', points: 340, price: 22.00 },
  { brandKey: 'toybox', retailer: 'amazon',  orderDate: '2024-10-22', points: 520, price: 34.00 },
  { brandKey: 'toybox', retailer: 'target',  orderDate: '2024-10-15', points: 180, price: 18.00 },
  { brandKey: 'toybox', retailer: 'walmart', orderDate: '2024-10-10', points: 260, price: 22.00 },
];

const EARN_WAYS = [
  {
    image: '/images/product-gel.jpg',
    label: 'Shop oriva.com',
    sub: '1 pt for every $1 spent',
    value: '1 pt / $1',
  },
  {
    image: '/images/hero-couple.jpg',
    label: 'Amazon & Walmart',
    sub: 'Connect inbox to earn on outside orders',
    value: '+300 pts',
    highlight: true,
  },
  {
    image: '/images/product-serum.jpg',
    label: 'Write a review',
    sub: 'Share your experience',
    value: '50 pts',
  },
  {
    image: '/images/l626_b0.jpg',
    label: 'Birthday bonus',
    sub: 'A little gift on your day',
    value: '100 pts',
  },
  {
    image: '/images/product-cleanser.jpg',
    label: 'Refer a friend',
    sub: 'You both earn when they shop',
    value: '200 pts',
  },
];

const REDEEM_TIERS = [
  { dollars: 5,  points: 100 },
  { dollars: 10, points: 200 },
  { dollars: 20, points: 400 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export function LoyaltyDashboard() {
  const { openFlow, backToShop, showRewardsBanner } = useApp();

  const newlyFoundPoints = 5300;
  const points = DEMO_BRAND.existingMemberPoints + newlyFoundPoints;
  const items = DEMO_ITEMS;

  return (
    <div className="min-h-screen bg-cream-100">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-cream-100 border-b border-ink-900/8">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <OrivaLogo size={22} color="#1F4F3D" textColor="#0E1410" />
          <button
            onClick={backToShop}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 transition"
          >
            <ShoppingBag size={14} strokeWidth={1.6} />
            Back to shop
          </button>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-4">

        {/* ── 1. Points hero — full width, horizontal layout ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-4xl overflow-hidden px-8 py-8"
          style={{ background: '#7B8DD4' }}
        >
          <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full opacity-40 blur-3xl"
            style={{ background: '#E8A98C' }} />
          <div className="absolute -bottom-16 -left-12 w-72 h-72 rounded-full opacity-25 blur-3xl"
            style={{ background: '#A8C4B0' }} />

          {/* Horizontal split: points left, stats right */}
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="text-cream-100/80 text-xs font-medium uppercase tracking-[0.18em] mb-3">
                ORIVA Rewards · Member
              </div>
              <div
                className="font-display text-cream-100 leading-none tracking-tightest"
                style={{ fontSize: 'clamp(3.4rem, 8vw, 5.5rem)', fontWeight: 800 }}
              >
                {points.toLocaleString()}
              </div>
              <div className="text-cream-100/85 text-base mt-1 font-medium">points</div>
            </div>

            {/* Stats — right side on desktop */}
            <div className="flex gap-3 lg:gap-4">
              {[
                { label: 'Current tier',    value: 'Freshies'  },
                { label: 'To next tier',    value: '2,360 pts' },
                { label: 'Lifetime earned', value: '9,980 pts' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/20 backdrop-blur-sm rounded-3xl px-5 py-4 text-center min-w-[100px]"
                >
                  <div className="font-display font-bold text-cream-100 leading-tight" style={{ fontSize: s.value.length > 6 ? '0.95rem' : '1.5rem' }}>{s.value}</div>
                  <div className="text-xs text-cream-100/70 mt-1.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Ways to earn — full-width image card row ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
        >
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h2 className="font-display font-semibold text-ink-900">Ways to earn</h2>
            <span className="text-xs text-ink-700/50">Tap any card to get started</span>
          </div>
          {/* Horizontal scroll on all sizes; on wide screens cards naturally fill */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {EARN_WAYS.map((card) => (
              <div key={card.label} className="snap-start flex-none">
                <EarnCard
                  {...card}
                  onClick={card.highlight ? openFlow : undefined}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Claim banner — full width ────────────────────────────── */}
        {showRewardsBanner && (
        <motion.div
          id="capture-rewards-banner"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="relative rounded-3xl px-8 py-8 overflow-hidden"
          style={{ background: '#0E1410' }}
        >
          <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full opacity-20 blur-3xl"
            style={{ background: '#7B8DD4' }} />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full opacity-15 blur-3xl"
            style={{ background: '#E8568C' }} />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-50 mb-2 text-cream-100">
                Earn everywhere you shop
              </p>
              <h2
                className="font-display text-cream-100 leading-[0.94] tracking-tightest mb-3"
                style={{ fontSize: 'clamp(1.35rem, 3vw, 1.9rem)' }}
              >
                Get points for your{' '}
                <span className="font-extrabold">Amazon & Walmart orders too.</span>
              </h2>
              <div className="mb-3">
                <span
                  className="text-sm font-bold px-3 py-1.5 rounded-pill"
                  style={{ background: 'rgba(245,235,221,0.15)', color: '#F5EBDD' }}
                >
                  +300 pts for connecting
                </span>
              </div>
              <p className="text-cream-100/60 text-xs leading-relaxed max-w-md">
                Connect your inbox once. We'll find past purchases across 10+ retailers and credit you the points you've been missing.
              </p>
            </div>
            <button
              onClick={openFlow}
              className="self-start lg:self-center flex-none bg-cream-100 text-ink-900 font-display font-semibold text-sm px-7 py-3.5 rounded-pill hover:bg-white transition active:scale-[0.97] whitespace-nowrap"
            >
              Claim my rewards →
            </button>
          </div>
        </motion.div>
        )}

        {/* ── Bottom grid: Redeem + Recent activity ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Ways to redeem — left, 2/5 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-ink-900/8 px-5 py-5"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display font-semibold text-ink-900">Redeem points</h2>
              <span className="text-xs text-ink-700/50">100 pts = $1</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {REDEEM_TIERS.map((tier) => (
                <RedeemTile key={tier.dollars} dollars={tier.dollars} points={tier.points} />
              ))}
            </div>
            <p className="text-xs text-ink-700/45 leading-relaxed">
              Log in and choose an eligible reward at checkout.
            </p>
          </motion.div>

          {/* Recent activity — right, 3/5 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="lg:col-span-3 bg-white rounded-3xl border border-ink-900/8 px-5"
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
        </div>


      </div>

      <Footer />
    </div>
  );
}
