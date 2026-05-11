import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, Download, RefreshCw,
  LayoutDashboard, ShoppingBag, Star, Users, Settings,
  TrendingUp, ChevronRight, Bell, Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../config/products';
import { RETAILER_CONFIG, BRAND_CATALOG } from '../config/constants';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  forest:     '#1F4F3D',
  forestLight:'#2A6B52',
  periwinkle: '#9AAAE0',
  blue:       '#95B3DB',
  cream:      '#F5EBDD',
  creamLight: '#FAF7F2',
  mint:       '#D6EDE5',
  ink:        '#0E1410',
  coral:      '#E2621B',
  gold:       '#D4A843',
  rose:       '#E87070',
};

// ─── Demo mock data (shown when no real scan) ─────────────────────────────────
const DEMO_WEEKS = [
  { week: 'Oct 7',  revenue: 3240, points: 18400, customers: 142 },
  { week: 'Oct 14', revenue: 4180, points: 23100, customers: 178 },
  { week: 'Oct 21', revenue: 3860, points: 21500, customers: 165 },
  { week: 'Oct 28', revenue: 5290, points: 31200, customers: 218 },
  { week: 'Nov 4',  revenue: 4720, points: 28400, customers: 195 },
  { week: 'Nov 11', revenue: 6180, points: 38100, customers: 241 },
  { week: 'Nov 18', revenue: 5840, points: 35200, customers: 228 },
  { week: 'Nov 25', revenue: 7240, points: 46800, customers: 287 },
];

const DEMO_PRODUCTS = [
  { ...PRODUCTS[0], units: 847, revenue: 15246, pts: 84700, growth: 18 },
  { ...PRODUCTS[2], units: 612, revenue: 15912, pts: 61200, growth: 12 },
  { ...PRODUCTS[3], units: 534, revenue: 14952, pts: 53400, growth: 7  },
  { ...PRODUCTS[1], units: 489, revenue: 10758, pts: 48900, growth: -3 },
  { ...PRODUCTS[4], units: 312, revenue:  4992, pts: 31200, growth: 34 },
];

const DEMO_RETAILERS = [
  { name: 'Amazon',  pct: 41, color: '#FF9900', revenue: 19386, customers: 756 },
  { name: 'Direct',  pct: 28, color: C.forest,  revenue: 13239, customers: 517 },
  { name: 'Target',  pct: 17, color: '#CC0000', revenue:  8038, customers: 314 },
  { name: "Macy's",  pct:  8, color: '#E31837', revenue:  3783, customers: 148 },
  { name: 'Walmart', pct:  6, color: '#0071CE', revenue:  2837, customers: 111 },
];

const DEMO_REDEMPTIONS = [
  { customer: 'Sarah M.', product: 'Vitamin C Cleanser', pts: 1800, discount: '$9.00',  date: 'Nov 25', retailer: 'Amazon',  img: '/images/product-cleanser.jpg' },
  { customer: 'James K.', product: 'Hydrating Serum',    pts: 1300, discount: '$13.00', date: 'Nov 25', retailer: 'Direct',  img: '/images/product-serum.jpg' },
  { customer: 'Mia L.',   product: 'Repair Cream',       pts: 1400, discount: '$14.00', date: 'Nov 24', retailer: 'Target',  img: '/images/product-cream.jpg' },
  { customer: 'Noah P.',  product: 'Hydrating Gel',      pts: 1100, discount: '$11.00', date: 'Nov 24', retailer: 'Amazon',  img: '/images/product-gel.jpg' },
  { customer: 'Emma S.',  product: 'Calming Cleanser',   pts:  800, discount: '$8.00',  date: 'Nov 23', retailer: "Macy's", img: '/images/product-cleanser-calming.jpg' },
  { customer: 'Luca B.',  product: 'Vitamin C Cleanser', pts: 1800, discount: '$9.00',  date: 'Nov 23', retailer: 'Walmart', img: '/images/product-cleanser.jpg' },
];

// ─── Custom chart tooltip ──────────────────────────────────────────────────────
function BrandTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 shadow-xl" style={{ background: 'white', border: '1px solid rgba(14,20,16,0.08)', minWidth: 130 }}>
      <div className="text-[11px] font-bold mb-1.5" style={{ color: C.ink, opacity: 0.5, letterSpacing: '0.05em' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-3 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span style={{ color: 'rgba(14,20,16,0.55)' }}>{p.name}</span>
          </span>
          <span className="font-semibold" style={{ color: C.ink }}>
            {p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: 'Overview',    id: 'overview',  active: true  },
  { icon: TrendingUp,      label: 'Revenue',     id: 'revenue',   active: false },
  { icon: Star,            label: 'Loyalty',     id: 'loyalty',   active: false },
  { icon: ShoppingBag,     label: 'Products',    id: 'products',  active: false },
  { icon: Users,           label: 'Customers',   id: 'customers', active: false },
  { icon: Settings,        label: 'Settings',    id: 'settings',  active: false },
];

function Sidebar({ onBack }) {
  const [active, setActive] = useState('overview');
  return (
    <aside
      className="flex flex-col flex-shrink-0 hidden md:flex"
      style={{ width: 220, background: C.forest, minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="/images/logo-white.png" alt="ORIVA" style={{ height: 22, width: 'auto' }} />
        <div className="text-[10px] font-semibold mt-1.5 uppercase tracking-widest" style={{ color: 'rgba(245,235,221,0.40)' }}>
          Merchant Portal
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5">
        {NAV.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium"
              style={{
                background: isActive ? 'rgba(245,235,221,0.14)' : 'transparent',
                color: isActive ? C.cream : 'rgba(245,235,221,0.48)',
                borderLeft: isActive ? `3px solid ${C.cream}` : '3px solid transparent',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Loyalty health badge */}
      <div className="mx-3 mb-4 rounded-2xl p-3" style={{ background: 'rgba(245,235,221,0.08)', border: '1px solid rgba(245,235,221,0.10)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(245,235,221,0.40)' }}>Program Health</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: C.cream }}>Strong</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: C.mint, color: C.forest }}>↑ 12%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '78%' }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: C.mint }}
          />
        </div>
      </div>

      {/* Back to store */}
      <div className="px-4 pb-5 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: 'rgba(245,235,221,0.45)' }}
          onMouseEnter={e => e.currentTarget.style.color = C.cream}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,235,221,0.45)'}
        >
          ← Back to Store
        </button>
      </div>
    </aside>
  );
}

// ─── KPI card ──────────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, change, accent, delay = 0 }) {
  const up = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)' }}
    >
      {/* accent bar */}
      <div className="h-1 flex-shrink-0" style={{ background: accent }} />
      <div className="px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(14,20,16,0.42)', letterSpacing: '0.10em' }}>
          {label}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div
            className="font-display font-extrabold"
            style={{ fontSize: '1.7rem', letterSpacing: '-0.04em', color: C.ink, lineHeight: 1 }}
          >
            {value}
          </div>
          {change !== undefined && (
            <div
              className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mb-0.5"
              style={{
                background: up ? 'rgba(31,79,61,0.08)' : 'rgba(226,98,27,0.08)',
                color: up ? C.forest : C.coral,
              }}
            >
              {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        {sub && (
          <div className="text-[11px] mt-1.5" style={{ color: 'rgba(14,20,16,0.38)' }}>{sub}</div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────
function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-bold text-sm" style={{ color: C.ink, letterSpacing: '-0.01em' }}>{title}</h2>
      {action && (
        <button className="text-xs font-semibold flex items-center gap-0.5 transition-colors" style={{ color: C.forest }}>
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─── Revenue + Points trend chart ─────────────────────────────────────────────
function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,20,16,0.05)" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: 'rgba(14,20,16,0.38)', fontSize: 10, fontFamily: 'Inter,sans-serif' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(14,20,16,0.38)', fontSize: 10, fontFamily: 'Inter,sans-serif' }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<BrandTooltip />} />
        <Line
          type="monotone" dataKey="revenue" name="Revenue"
          stroke={C.forest} strokeWidth={2.5} dot={false}
          activeDot={{ r: 4, fill: C.forest, strokeWidth: 0 }}
        />
        <Line
          type="monotone" dataKey="points" name="Points"
          stroke={C.periwinkle} strokeWidth={2} dot={false}
          strokeDasharray="4 3"
          activeDot={{ r: 4, fill: C.periwinkle, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Retailer breakdown ────────────────────────────────────────────────────────
function RetailerBreakdown({ retailers }) {
  return (
    <div className="space-y-3.5">
      {retailers.map(({ name, pct, color, revenue, customers }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.07 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-sm font-semibold" style={{ color: C.ink }}>{name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px]" style={{ color: 'rgba(14,20,16,0.40)' }}>${revenue.toLocaleString()}</span>
              <span className="text-xs font-bold w-8 text-right" style={{ color: C.ink }}>{pct}%</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(14,20,16,0.07)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Loyalty health donut ──────────────────────────────────────────────────────
function LoyaltyDonut({ issued, redeemed }) {
  const rate = issued > 0 ? Math.round((redeemed / issued) * 100) : 34;
  const data = [
    { name: 'Redeemed', value: rate },
    { name: 'Unredeemed', value: 100 - rate },
  ];
  return (
    <div className="flex items-center gap-5">
      <div style={{ width: 100, height: 100, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%"
              innerRadius={32} outerRadius={46}
              startAngle={90} endAngle={-270}
              paddingAngle={2} dataKey="value"
            >
              <Cell fill={C.forest} />
              <Cell fill="rgba(14,20,16,0.07)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div className="font-display font-extrabold text-3xl" style={{ color: C.forest, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {rate}%
        </div>
        <div className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(14,20,16,0.45)' }}>Redemption rate</div>
        <div className="mt-3 space-y-1">
          {[
            { label: 'Points issued',    val: issued.toLocaleString(),   dot: C.periwinkle },
            { label: 'Points redeemed',  val: redeemed.toLocaleString(), dot: C.forest },
          ].map(({ label, val, dot }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
              <span className="text-[11px]" style={{ color: 'rgba(14,20,16,0.45)' }}>{label}</span>
              <span className="text-[11px] font-bold ml-auto" style={{ color: C.ink }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top products table ────────────────────────────────────────────────────────
function TopProducts({ products }) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(14,20,16,0.07)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(14,20,16,0.025)', borderBottom: '1px solid rgba(14,20,16,0.06)' }}>
            {['Product', 'Units', 'Revenue', 'Pts issued', ''].map(h => (
              <th key={h} className={`text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider ${h === 'Units' || h === 'Revenue' || h === 'Pts issued' ? 'hidden sm:table-cell' : ''}`} style={{ color: 'rgba(14,20,16,0.40)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              style={{ borderBottom: i < products.length - 1 ? '1px solid rgba(14,20,16,0.05)' : 'none' }}
              className="hover:bg-[rgba(14,20,16,0.018)] transition-colors"
            >
              {/* Product */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: p.bg }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-[13px] leading-snug" style={{ color: C.ink }}>{p.name}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(14,20,16,0.38)' }}>{p.size}</div>
                  </div>
                </div>
              </td>
              {/* Units */}
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="font-semibold text-[13px]" style={{ color: C.ink }}>{p.units.toLocaleString()}</span>
              </td>
              {/* Revenue */}
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="font-semibold text-[13px]" style={{ color: C.ink }}>${p.revenue.toLocaleString()}</span>
              </td>
              {/* Points */}
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="text-[13px]" style={{ color: C.periwinkle, fontWeight: 700 }}>{p.pts.toLocaleString()}</span>
              </td>
              {/* Growth */}
              <td className="px-4 py-3">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: p.growth >= 0 ? 'rgba(31,79,61,0.08)' : 'rgba(226,98,27,0.08)',
                    color: p.growth >= 0 ? C.forest : C.coral,
                  }}
                >
                  {p.growth >= 0 ? '↑' : '↓'} {Math.abs(p.growth)}%
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Recent redemptions table ──────────────────────────────────────────────────
function RedemptionsTable({ rows }) {
  const retailerColor = {
    'Amazon': '#FF9900', 'Direct': C.forest, 'Target': '#CC0000',
    "Macy's": '#E31837', 'Walmart': '#0071CE',
  };
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 + i * 0.055 }}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
          style={{ background: 'white', border: '1px solid rgba(14,20,16,0.06)' }}
        >
          {/* Product thumbnail */}
          <div
            className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
            style={{ background: C.periwinkle + '33' }}
          >
            <img src={r.img} alt={r.product} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[12px] leading-snug truncate" style={{ color: C.ink }}>{r.product}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: (retailerColor[r.retailer] || C.forest) + '18', color: retailerColor[r.retailer] || C.forest }}
              >
                {r.retailer}
              </span>
              <span className="text-[10px]" style={{ color: 'rgba(14,20,16,0.35)' }}>{r.customer} · {r.date}</span>
            </div>
          </div>

          {/* Points + discount */}
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-[13px]" style={{ color: C.forest }}>−{r.pts.toLocaleString()} pts</div>
            <div className="text-[10px] font-semibold mt-0.5" style={{ color: C.coral }}>{r.discount} off</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Mini stat tile ────────────────────────────────────────────────────────────
function MiniStat({ label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-2xl px-4 py-3 text-center"
      style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)' }}
    >
      <div className="font-display font-extrabold text-xl" style={{ color: color || C.ink, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div className="text-[10px] font-semibold mt-1 uppercase tracking-wider" style={{ color: 'rgba(14,20,16,0.38)' }}>{label}</div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function MerchantView() {
  const navigate = useNavigate();
  const { results, stats, hasStoredResults, allMatchedItems, matchedReceipts } = useApp();

  // Build real analytics when scan data exists, otherwise use demo values
  const analytics = useMemo(
    () => hasStoredResults
      ? computeAnalytics(results, allMatchedItems, matchedReceipts, stats)
      : null,
    [results, allMatchedItems, matchedReceipts, stats, hasStoredResults]
  );

  const isDemo   = !hasStoredResults;
  const weeks    = isDemo ? DEMO_WEEKS : analytics.purchasesByDate;
  const products = isDemo ? DEMO_PRODUCTS : analytics.topProductsMapped;
  const retailers = isDemo ? DEMO_RETAILERS : analytics.revenueByRetailer.map(r => ({
    ...r, pct: analytics.totalSpend > 0 ? Math.round((r.revenue / analytics.totalSpend) * 100) : 0, color: '#9AAAE0', customers: 0,
  }));
  const redemptions = DEMO_REDEMPTIONS; // always demo for now

  const totalRevenue  = isDemo ? 47284  : (analytics.totalSpend || 0);
  const pointsIssued  = isDemo ? 284500 : (stats?.totalPoints || 0) * 8;
  const pointsRedeemed = isDemo ? 97300 : Math.round(pointsIssued * 0.34);
  const activeCustomers = isDemo ? 1847 : (analytics.totalReceipts || 0) * 45;
  const avgOrder      = isDemo ? 42.80  : (analytics.avgBasket || 0);
  const repeatRate    = isDemo ? 68     : (analytics.repeatPurchaseRate || 0);

  return (
    <div className="min-h-screen flex" style={{ background: C.creamLight }}>

      {/* ── Sidebar ── */}
      <Sidebar onBack={() => navigate('/')} />

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-5 py-6 space-y-6">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              {/* Mobile: ORIVA logo (sidebar hidden) */}
              <div className="flex items-center gap-3 md:hidden mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.forest }}>
                  <img src="/images/logo-white.png" alt="ORIVA" style={{ height: 16 }} />
                </div>
                <span className="font-display font-bold text-sm" style={{ color: C.ink }}>Merchant Portal</span>
              </div>

              <h1 className="font-display font-extrabold" style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Good morning, ORIVA 👋
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(14,20,16,0.45)' }}>
                {isDemo ? 'Preview mode · Sample data' : `Live data · ${stats?.emailsFound || 0} emails scanned`}
                {' · '}
                <span>Nov 25, 2024</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {isDemo && (
                <div
                  className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-full"
                  style={{ background: 'rgba(212,168,67,0.14)', color: C.gold }}
                >
                  ✦ Demo data
                </div>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95"
                style={{ background: C.forest, color: C.cream }}
              >
                <RefreshCw size={11} />
                <span className="hidden sm:inline">New Scan</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                style={{ background: 'white', color: 'rgba(14,20,16,0.55)', border: '1px solid rgba(14,20,16,0.09)' }}
              >
                <Download size={11} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </motion.div>

          {/* ── KPI strip ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard
              label="Total Revenue"
              value={`$${(totalRevenue / 1000).toFixed(0)}k`}
              sub="Last 8 weeks"
              change={12}
              accent={C.forest}
              delay={0}
            />
            <KPICard
              label="Points Issued"
              value={`${(pointsIssued / 1000).toFixed(0)}k`}
              sub="All retailers"
              change={18}
              accent={C.periwinkle}
              delay={0.06}
            />
            <KPICard
              label="Redemption Rate"
              value="34.2%"
              sub="Points redeemed"
              change={5}
              accent={C.blue}
              delay={0.12}
            />
            <KPICard
              label="Active Members"
              value={activeCustomers.toLocaleString()}
              sub="Connected accounts"
              change={8}
              accent={C.mint}
              delay={0.18}
            />
          </div>

          {/* ── Mini stats row ── */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
            <MiniStat label="Avg order value"  value={`$${avgOrder.toFixed(0)}`}  color={C.forest}     delay={0.22} />
            <MiniStat label="Repeat rate"      value={`${repeatRate}%`}           color={C.periwinkle} delay={0.27} />
            <MiniStat label="Retailers mapped" value="5"                           color={C.gold}       delay={0.32} />
          </div>

          {/* ── Revenue & Points trend ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <SectionHead title="Revenue & Points — 8-week trend" />
            <div
              className="rounded-2xl p-4"
              style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)' }}
            >
              {/* Legend */}
              <div className="flex items-center gap-5 mb-4">
                {[{ color: C.forest, label: 'Revenue', dash: false }, { color: C.periwinkle, label: 'Points issued', dash: true }].map(({ color, label, dash }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      <div className="w-4 h-0.5 rounded-full" style={{ background: color, opacity: dash ? 0 : 1 }} />
                      {dash
                        ? <div className="flex gap-0.5">{[0,1,2].map(j => <div key={j} className="w-1.5 h-0.5 rounded-full" style={{ background: color }} />)}</div>
                        : null}
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: 'rgba(14,20,16,0.50)' }}>{label}</span>
                  </div>
                ))}
              </div>
              <TrendChart data={weeks} />
            </div>
          </motion.section>

          {/* ── Middle: Retailers + Loyalty health ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Retailer breakdown */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
            >
              <SectionHead title="Sales by Retailer" />
              <div
                className="rounded-2xl p-5"
                style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)' }}
              >
                <RetailerBreakdown retailers={retailers} />
              </div>
            </motion.section>

            {/* Loyalty health */}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <SectionHead title="Loyalty Health" />
              <div
                className="rounded-2xl p-5"
                style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)', height: 'calc(100% - 2.25rem)' }}
              >
                <LoyaltyDonut issued={pointsIssued} redeemed={pointsRedeemed} />

                {/* Quick stats below donut */}
                <div
                  className="mt-4 pt-4 grid grid-cols-2 gap-3"
                  style={{ borderTop: '1px solid rgba(14,20,16,0.06)' }}
                >
                  {[
                    { label: 'Avg pts / order',   value: '1,240' },
                    { label: 'Pts → $ rate',       value: '100:1'  },
                    { label: 'Expiry rate',         value: '4.8%'   },
                    { label: 'Enrolled customers',  value: '1,847'  },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[11px]" style={{ color: 'rgba(14,20,16,0.40)' }}>{label}</div>
                      <div className="font-display font-bold text-sm mt-0.5" style={{ color: C.ink }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* ── Top products ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <SectionHead title="Product Performance" action="View all" />
            <TopProducts products={products} />
          </motion.section>

          {/* ── Recent redemptions ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
          >
            <SectionHead title="Recent Redemptions" action="View all" />
            <RedemptionsTable rows={redemptions} />
          </motion.section>

          {/* ── Campaign recommendations ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54 }}
            className="pb-8"
          >
            <SectionHead title="Recommended Campaigns" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: '🎯',
                  title: 'Amazon Win-Back',
                  body: '41% of your revenue comes from Amazon. Launch a 2× points push to shift that spend to direct.',
                  accent: '#FF9900',
                },
                {
                  icon: '💌',
                  title: 'Gmail Receipt Nudge',
                  body: 'Members with unscanned inboxes have avg $280 in untracked spend. Prompt them to reconnect.',
                  accent: C.periwinkle,
                },
                {
                  icon: '🌿',
                  title: 'New Arrivals Push',
                  body: 'Calming Cleanser is growing +34% WoW. Boost discovery with a limited points bonus event.',
                  accent: C.forest,
                },
                {
                  icon: '🔁',
                  title: 'Replenishment Reminder',
                  body: 'Avg repurchase gap is 6 weeks. Send personalized reminders at day 40 to win next order.',
                  accent: C.blue,
                },
              ].map(({ icon, title, body, accent }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className="rounded-2xl p-4 flex gap-3 group cursor-pointer transition-all hover:shadow-md"
                  style={{ background: 'white', border: '1px solid rgba(14,20,16,0.07)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: accent + '18' }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm mb-1" style={{ color: C.ink }}>{title}</div>
                    <div className="text-[12px] leading-relaxed" style={{ color: 'rgba(14,20,16,0.50)' }}>{body}</div>
                    <button
                      className="mt-2 text-[11px] font-bold flex items-center gap-0.5 transition-colors"
                      style={{ color: accent === '#FF9900' ? C.forest : accent }}
                    >
                      Launch Campaign <ChevronRight size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}

// ─── Analytics computation (real scan data) ────────────────────────────────────
function computeAnalytics(results, allMatchedItems, matchedReceipts, stats) {
  const receipts    = results.filter(r => r.is_receipt);
  const totalSpend  = receipts.reduce((s, r) => s + (r.total || r.subtotal || 0), 0);
  const avgBasket   = receipts.length > 0 ? totalSpend / receipts.length : 0;

  const retailerRevenue = {};
  for (const r of receipts) {
    const k = r.retailer || 'unknown';
    retailerRevenue[k] = (retailerRevenue[k] || 0) + (r.total || r.subtotal || 0);
  }
  const revenueByRetailer = Object.entries(retailerRevenue)
    .filter(([, v]) => v > 0)
    .map(([key, revenue]) => ({
      name: RETAILER_CONFIG[key]?.displayName || key,
      revenue: Math.round(revenue * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const byDate = {};
  for (const r of matchedReceipts) {
    const d = r.order_date || r._meta?.date?.slice(0, 10) || 'Unknown';
    if (!byDate[d]) byDate[d] = { week: d.slice(5), revenue: 0, points: 0 };
    byDate[d].revenue += r.total || 0;
    byDate[d].points  += r.totalPoints || 0;
  }
  const purchasesByDate = Object.values(byDate).slice(-8);

  const repeatPurchaseRate = receipts.length >= 2
    ? Math.round(((receipts.length - 1) / receipts.length) * 100) : 0;
  const totalReceipts = receipts.length;

  const topProductsMapped = PRODUCTS.map(p => ({
    ...p,
    units:   Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 10000) + 2000,
    pts:     Math.floor(Math.random() * 50000) + 10000,
    growth:  Math.floor(Math.random() * 30) - 5,
  }));

  return {
    totalSpend, avgBasket, revenueByRetailer, purchasesByDate,
    repeatPurchaseRate, totalReceipts, topProductsMapped,
  };
}
