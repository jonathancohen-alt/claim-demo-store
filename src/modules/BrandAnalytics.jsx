import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Users, Star, ArrowUpRight,
  Eye, Package, BarChart2, AlertCircle, ChevronUp, ChevronDown, Download, Crown,
} from 'lucide-react';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  orange:    '#F5A623',
  orangeLight: '#FDDFA0',
  cream:     '#FAF7F2',
  creamDark: '#F0E8DC',
  ink:       '#1A1209',
  inkMid:    '#4A3F2F',
  inkLight:  '#8C7B66',
  white:     '#FFFFFF',
  green:     '#2D7A4F',
  greenLight:'#D6EDE5',
  rose:      '#C94F4F',
  roseLight: '#FDEAEA',
  blue:      '#3B6CB0',
  blueLight: '#E0E9F8',
  purple:    '#6B4FA0',
  purpleLight:'#EDE8F8',
};

// ─── Retailer config ───────────────────────────────────────────────────────────
const RETAILERS = {
  amazon:  { name: 'Amazon',  color: '#FF9900', emoji: '📦' },
  sephora: { name: 'Sephora', color: '#D4395C', emoji: '🌸' },
  ulta:    { name: 'Ulta',    color: '#7B1FA2', emoji: '💜' },
  target:  { name: 'Target',  color: '#CC0000', emoji: '🎯' },
};

// ─── Mock data ─────────────────────────────────────────────────────────────────
const DATA = {
  heroShoppers: 2727,
  connectedPeriod: '90 days',

  segmentation: {
    retailOnly:    { count: 1623, pct: 42 },
    omnichannel:   { count: 1104, pct: 29 },
    dtcOnly:       { count: 1120, pct: 29 },
  },

  cannibalisation: {
    loyaltyMembers: 58,
    netNew: 42,
    byRetailer: {
      amazon:  { loyaltyMembers: 51, netNew: 49 },
      sephora: { loyaltyMembers: 67, netNew: 33 },
      ulta:    { loyaltyMembers: 72, netNew: 28 },
      target:  { loyaltyMembers: 44, netNew: 56 },
    },
  },

  gmv: {
    total: 1_284_600,
    dtcAOV: 64,
    retailAOV: 48,
    byRetailer: [
      { id: 'amazon',  gmv: 487200, orders: 4820, shoppers: 1580, loyaltyPct: 51 },
      { id: 'sephora', gmv: 368900, orders: 3140, shoppers: 1210, loyaltyPct: 67 },
      { id: 'ulta',    gmv: 284100, orders: 2890, shoppers: 980,  loyaltyPct: 72 },
      { id: 'target',  gmv: 144400, orders: 1740, shoppers: 620,  loyaltyPct: 44 },
    ],
  },

  topSkus: [
    { name: 'Vitamin C Brightening Serum',   units: 3840, retailers: 4, dtcAvail: true  },
    { name: 'Hydra-Glow Moisturizer',         units: 3120, retailers: 4, dtcAvail: true  },
    { name: 'Retinol Renewal Night Cream',    units: 2670, retailers: 3, dtcAvail: true  },
    { name: 'SPF 40 Daily Primer',            units: 2240, retailers: 4, dtcAvail: true  },
    { name: 'Peptide Eye Concentrate',        units: 1980, retailers: 2, dtcAvail: true  },
    { name: 'Squalane Cleansing Oil',         units: 1740, retailers: 3, dtcAvail: true  },
    { name: 'Barrier Repair Balm (Travel)',   units: 1520, retailers: 4, dtcAvail: false },
    { name: 'AHA Exfoliating Toner',          units: 1310, retailers: 2, dtcAvail: true  },
    { name: 'Pore-Refining Clay Mask',        units: 1180, retailers: 3, dtcAvail: true  },
    { name: 'Lip Plumping Treatment',         units:  940, retailers: 2, dtcAvail: false },
  ],

  ordersOverTime: [
    { week: 'Mar 3',  dtc: 610, retail: 820,  amazon: 320, sephora: 248, ulta: 182, target: 70 },
    { week: 'Mar 10', dtc: 580, retail: 870,  amazon: 340, sephora: 262, ulta: 190, target: 78 },
    { week: 'Mar 17', dtc: 640, retail: 910,  amazon: 355, sephora: 275, ulta: 200, target: 80 },
    { week: 'Mar 24', dtc: 720, retail: 1040, amazon: 405, sephora: 315, ulta: 228, target: 92 },
    { week: 'Mar 31', dtc: 690, retail: 980,  amazon: 384, sephora: 296, ulta: 212, target: 88 },
    { week: 'Apr 7',  dtc: 760, retail: 1120, amazon: 437, sephora: 338, ulta: 248, target: 97 },
    { week: 'Apr 14', dtc: 810, retail: 1180, amazon: 462, sephora: 356, ulta: 258, target: 104 },
    { week: 'Apr 21', dtc: 780, retail: 1100, amazon: 430, sephora: 332, ulta: 242, target: 96 },
    { week: 'Apr 28', dtc: 850, retail: 1240, amazon: 485, sephora: 374, ulta: 274, target: 107 },
    { week: 'May 5',  dtc: 920, retail: 1310, amazon: 512, sephora: 396, ulta: 289, target: 113 },
    { week: 'May 12', dtc: 870, retail: 1270, amazon: 496, sephora: 384, ulta: 280, target: 110 },
    { week: 'May 19', dtc: 960, retail: 1380, amazon: 540, sephora: 416, ulta: 304, target: 120 },
    { week: 'May 26', dtc: 1010, retail: 1420, amazon: 555, sephora: 428, ulta: 312, target: 125 },
  ],
};

// ─── Top spenders mock data ────────────────────────────────────────────────────
const FIRST_NAMES = ['Emma','Liam','Olivia','Noah','Ava','Ethan','Sophia','Mason','Isabella','Logan','Mia','Lucas','Charlotte','Aiden','Amelia','Jackson','Harper','Sebastian','Evelyn','Mateo','Abigail','James','Emily','Alexander','Elizabeth','Benjamin','Sofia','Elijah','Avery','Michael','Ella','Owen','Scarlett','Samuel','Grace','Daniel','Chloe','Henry','Victoria','Carter','Riley','Wyatt','Aria','Jayden','Lily','John','Aubrey','Luke','Zoey','Gabriel'];
const LAST_NAMES  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','White','Harris','Martin','Thompson','Young','Robinson','Lewis','Walker','Hall','Allen','Young','King','Wright','Scott','Green','Baker','Adams','Nelson','Hill','Campbell','Mitchell','Roberts','Carter','Phillips','Evans'];
const RETAILERS_LIST = ['Amazon','Sephora','Ulta','Target'];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const TOP_SPENDERS = Array.from({ length: 1000 }, (_, i) => {
  const r = seededRand(i * 137 + 42);
  const first = FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)];
  const last  = LAST_NAMES[Math.floor(r()  * LAST_NAMES.length)];
  const domain = ['gmail.com','yahoo.com','outlook.com','icloud.com'][Math.floor(r() * 4)];
  const numRetailers = r() < 0.5 ? 1 : r() < 0.8 ? 2 : r() < 0.95 ? 3 : 4;
  const shuffled = [...RETAILERS_LIST].sort(() => r() - 0.5);
  const retailers = shuffled.slice(0, numRetailers);
  const orders = Math.floor(r() * 8) + 1;
  const aov = Math.round((r() * 120 + 35) * 100) / 100;
  const totalSpend = Math.round(orders * aov * 100) / 100;
  return {
    rank: i + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(r()*99)}@${domain}`,
    retailers,
    orders,
    aov,
    totalSpend,
  };
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}
function fmtNum(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}
function fmtComma(n) {
  return n.toLocaleString();
}

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="text-stone-500 mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">
      {children}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-fraunces text-xl font-semibold text-stone-900 mb-4">
      {children}
    </h2>
  );
}

// ─── Sparkline mini component ──────────────────────────────────────────────────
function MiniSparkline({ data, color }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 48;
    const y = 16 - (v / max) * 14;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width="52" height="20" className="mt-1">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Donut chart for cannibalization ──────────────────────────────────────────
function DonutChart({ loyalty, netNew }) {
  const data = [
    { name: 'Existing loyalty members', value: loyalty, color: C.orange },
    { name: 'Net new to brand',          value: netNew,  color: C.inkLight },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Sortable table ────────────────────────────────────────────────────────────
function RetailerTable({ rows }) {
  const [sort, setSort] = useState({ col: 'gmv', dir: 'desc' });

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sort.col];
      const bv = b[sort.col];
      return sort.dir === 'desc' ? bv - av : av - bv;
    });
  }, [rows, sort]);

  const toggle = (col) => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'desc' ? 'asc' : 'desc' } : { col, dir: 'desc' });
  };

  const ColHead = ({ col, label, right }) => {
    const active = sort.col === col;
    return (
      <th
        className={`py-3 px-4 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none whitespace-nowrap
          ${right ? 'text-right' : 'text-left'}
          ${active ? 'text-stone-900' : 'text-stone-400'}`}
        onClick={() => toggle(col)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {active
            ? sort.dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />
            : <ChevronDown size={12} className="opacity-30" />}
        </span>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-stone-100">
          <tr>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-stone-400 text-left">Retailer</th>
            <ColHead col="shoppers" label="Shoppers" right />
            <ColHead col="orders"   label="Orders"   right />
            <ColHead col="gmv"      label="GMV"      right />
            <ColHead col="loyaltyPct" label="Loyalty %" right />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const r = RETAILERS[row.id];
            return (
              <tr key={row.id} className="border-b border-stone-50 hover:bg-amber-50/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="font-medium text-stone-800">{r.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right text-stone-700">{fmtComma(row.shoppers)}</td>
                <td className="py-3.5 px-4 text-right text-stone-700">{fmtComma(row.orders)}</td>
                <td className="py-3.5 px-4 text-right font-semibold text-stone-900">{fmt(row.gmv)}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: row.loyaltyPct >= 60 ? C.green : C.orange }}
                    />
                    <span className={`font-medium ${row.loyaltyPct >= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {row.loyaltyPct}%
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────────────────────────────
const TIER_LIMITS = [50, 100, 500, 1000];

function TopSpendersSection() {
  const [limit, setLimit] = useState(50);
  const [exported, setExported] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const PREVIEW = 10;
  const allRows = TOP_SPENDERS.slice(0, limit);
  const rows = expanded ? allRows : allRows.slice(0, PREVIEW);

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div>
      <SectionLabel>Top spenders at retail</SectionLabel>
      <Section>
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <SectionTitle>Highest AOV buyers identified across retail channels</SectionTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
              {TIER_LIMITS.map(t => (
                <button
                  key={t}
                  onClick={() => { setLimit(t); setExpanded(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${limit === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Top {t.toLocaleString()}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Download size={14} />
              {exported ? 'Exported!' : 'Export segment'}
            </button>
          </div>
        </div>

        {/* Table — always shows first 10, rest collapsible */}
        <div className="overflow-hidden rounded-xl border border-stone-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide w-10">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">Retailers</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">AOV</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wide">Total spend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.email} className={`border-b border-stone-50 hover:bg-stone-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-stone-50/30'}`}>
                  <td className="py-3 px-4 text-stone-400 text-xs">{row.rank}</td>
                  <td className="py-3 px-4 font-medium text-stone-800">{row.name}</td>
                  <td className="py-3 px-4 text-stone-500">{row.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {row.retailers.map(r => (
                        <span key={r} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-stone-700">{row.orders}</td>
                  <td className="py-3 px-4 text-right font-semibold text-stone-900">${row.aov.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold" style={{ color: C.orange }}>${row.totalSpend.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show more / less */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-stone-400">
            Showing {rows.length.toLocaleString()} of {limit.toLocaleString()} buyers · Sorted by total spend
          </p>
          {allRows.length > PREVIEW && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {limit.toLocaleString()} buyers</>}
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}

export function BrandAnalytics() {
  const [retailerView, setRetailerView] = useState('all');
  const [showRetailerLines, setShowRetailerLines] = useState(false);

  const canniData = retailerView === 'all'
    ? DATA.cannibalisation
    : {
        loyaltyMembers: DATA.cannibalisation.byRetailer[retailerView].loyaltyMembers,
        netNew:         DATA.cannibalisation.byRetailer[retailerView].netNew,
      };

  const sparkRetailOnly = [880, 1020, 1180, 1340, 1480, 1623];
  const sparkOmni       = [620,  720,  810,  920, 1020, 1104];
  const sparkDtc        = [780,  880,  960, 1040, 1090, 1120];

  const gmvBars = DATA.gmv.byRetailer.map(r => ({
    name: RETAILERS[r.id].name,
    gmv:  r.gmv,
    color: RETAILERS[r.id].color,
  }));

  const totalOrders = DATA.gmv.byRetailer.reduce((s, r) => s + r.orders, 0);
  const totalRetailers = Object.keys(RETAILERS).length;

  return (
    <div className="min-h-screen font-dm-sans" style={{ backgroundColor: C.cream }}>
      {/* Top Nav */}
      <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: C.orange }}
            >
              O
            </div>
            <span className="font-fraunces font-semibold text-stone-900 text-lg tracking-tight">Oriva</span>
            <span className="text-stone-300 mx-1">·</span>
            <span className="text-stone-500 text-sm">Retail Visibility Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: C.orangeLight, color: '#8B5E0A' }}
            >
              Last 90 days
            </span>
            <span className="text-xs text-stone-400">Powered by Claim</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── 1. Hero Banner ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #1A1209 0%, #3D2B10 100%)` }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10"
            style={{ backgroundColor: C.orange }} />
          <div className="absolute -right-8 -bottom-16 w-52 h-52 rounded-full opacity-[0.06]"
            style={{ backgroundColor: C.orange }} />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80 mb-2">
              Unique retail buyers identified
            </p>
            <div className="flex items-end gap-4 mb-3">
              <span className="font-fraunces text-7xl font-bold text-white leading-none">
                {fmtComma(DATA.heroShoppers)}
              </span>
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-sm font-semibold">+34% vs. prior period</span>
                </div>
                <p className="text-stone-400 text-sm">connected in the last 90 days</p>
              </div>
            </div>
            {/* Mini stat strip */}
            <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
              {[
                { label: 'Retail GMV surfaced',   value: fmt(DATA.gmv.total) },
                { label: 'Retailer touchpoints',  value: String(totalRetailers) },
                { label: 'Retail orders matched', value: fmtComma(totalOrders)  },
                { label: 'Loyalty members found at retail', value: `${DATA.cannibalisation.loyaltyMembers}%` },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-fraunces text-xl font-semibold text-white">{s.value}</p>
                  <p className="text-stone-300 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. Shopper Segmentation ─────────────────────────────────────── */}
        <div>
          <SectionLabel>Shopper segmentation</SectionLabel>
          <div className="grid grid-cols-2 gap-4">

            {/* Retail-Only */}
            <Section>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
                    Retail-Only Buyers
                  </p>
                  <p className="font-fraunces text-4xl font-bold text-stone-900">
                    {fmtComma(DATA.segmentation.retailOnly.count)}
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    {DATA.segmentation.retailOnly.pct}% of connected base
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: C.blueLight }}
                >
                  <ShoppingBag size={18} style={{ color: C.blue }} />
                </div>
              </div>
              <MiniSparkline data={sparkRetailOnly} color={C.blue} />
              <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                Never purchased DTC. Retail is their only brand touchpoint.
              </p>
              <button
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                onClick={() => alert('Exporting Retail-Only segment…')}
              >
                <Download size={14} />
                Export as segment
              </button>
            </Section>

            {/* Omnichannel */}
            <Section className="ring-2" style={{ '--tw-ring-color': C.orange + '40' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                      Omnichannel Buyers
                    </p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: C.orangeLight, color: '#8B5E0A' }}
                    >
                      Highest LTV
                    </span>
                  </div>
                  <p className="font-fraunces text-4xl font-bold text-stone-900">
                    {fmtComma(DATA.segmentation.omnichannel.count)}
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    {DATA.segmentation.omnichannel.pct}% of connected base
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: C.orangeLight }}
                >
                  <Star size={18} style={{ color: C.orange }} />
                </div>
              </div>
              <MiniSparkline data={sparkOmni} color={C.orange} />
              <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                Shops both DTC and at retail. Your most engaged, highest-value cohort.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                  onClick={() => alert('Exporting Omnichannel segment…')}
                >
                  <Download size={14} />
                  Export as segment
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                  onClick={() => alert('Creating loyalty tier for 1,104 omnichannel buyers…')}
                >
                  <Crown size={14} />
                  Tier upgrade
                </button>
              </div>
            </Section>

          </div>
        </div>

        {/* ── 3. Cannibalization vs. Acquisition ──────────────────────────── */}
        <div>
          <SectionLabel>Loyalty overlap</SectionLabel>
          <Section>
            <div className="flex items-start justify-between mb-2">
              <SectionTitle>Are retail buyers new customers or loyalty members shopping elsewhere?</SectionTitle>
              {/* Retailer toggle */}
              <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
                {['all', 'amazon', 'sephora', 'ulta', 'target'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRetailerView(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                      ${retailerView === r
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    {r === 'all' ? 'All Retailers' : RETAILERS[r].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 items-center">
              <div>
                <DonutChart loyalty={canniData.loyaltyMembers} netNew={canniData.netNew} />
              </div>
              <div>
                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Existing loyalty members', pct: canniData.loyaltyMembers, color: C.orange },
                    { label: 'Net new to brand',          pct: canniData.netNew,         color: C.inkLight },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-sm text-stone-600">{s.label}</span>
                        </div>
                        <span className="font-fraunces text-xl font-bold text-stone-900">{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl p-4 border"
                  style={{ backgroundColor: C.roseLight, borderColor: '#FECACA' }}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-rose-800 leading-relaxed">
                      <strong>{canniData.loyaltyMembers}% of your retail buyers are already in your loyalty program.</strong>{' '}
                      They're earning nothing for those purchases — and you're not seeing them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ── 4. Retail GMV ──────────────────────────────────────────────── */}
        <div>
          <SectionLabel>Revenue visibility</SectionLabel>
          <Section>
            <div className="grid grid-cols-3 gap-8">
              {/* Left: big GMV number */}
              <div className="col-span-1">
                <SectionTitle>Retail GMV surfaced</SectionTitle>
                <p className="font-fraunces text-5xl font-bold text-stone-900 mb-1">
                  {fmt(DATA.gmv.total)}
                </p>
                <p className="text-stone-400 text-sm mb-6">across all connected shoppers</p>

                {/* AOV comparison */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Avg. Order Value</p>
                  {[
                    { label: 'DTC',    aov: DATA.gmv.dtcAOV,    isPrimary: true  },
                    { label: 'Retail', aov: DATA.gmv.retailAOV, isPrimary: false },
                  ].map(c => (
                    <div key={c.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: c.isPrimary ? C.orange : C.inkLight }}
                        />
                        <span className="text-sm text-stone-600">{c.label}</span>
                      </div>
                      <span className="font-fraunces text-lg font-bold text-stone-900">${c.aov}</span>
                    </div>
                  ))}
                  <div
                    className="rounded-xl p-3 mt-2"
                    style={{ backgroundColor: C.creamDark }}
                  >
                    <p className="text-xs text-stone-500 leading-relaxed">
                      <strong className="text-stone-700">Retail drives volume; DTC drives value.</strong>{' '}
                      Your retail AOV is ${DATA.gmv.dtcAOV - DATA.gmv.retailAOV} lower — but retail touches {fmtComma(DATA.heroShoppers)} shoppers you weren't reaching.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: GMV by retailer bar chart */}
              <div className="col-span-2">
                <p className="text-sm font-semibold text-stone-500 mb-4">GMV by retailer</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={gmvBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F0E8" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                      tick={{ fontSize: 11, fill: '#9C8A77' }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      type="category" dataKey="name"
                      tick={{ fontSize: 12, fill: '#4A3F2F', fontWeight: 600 }}
                      axisLine={false} tickLine={false} width={64}
                    />
                    <Tooltip
                      formatter={(v) => [`$${v.toLocaleString()}`, 'GMV']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD0', fontSize: 12 }}
                    />
                    <Bar dataKey="gmv" radius={[0, 6, 6, 0]}>
                      {gmvBars.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>
        </div>

        {/* ── 5. Top Spenders ─────────────────────────────────────────────── */}
        <TopSpendersSection />

        {/* ── 6. Top SKUs at Retail ───────────────────────────────────────── */}
        <div>
          <SectionLabel>Product performance</SectionLabel>
          <Section>
            <div className="flex items-start justify-between mb-4">
              <div>
                <SectionTitle>Top SKUs at retail</SectionTitle>
                <p className="text-sm text-stone-400 -mt-3 mb-4">
                  These products are moving at retail. Are your loyalty members earning points for them?
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> DTC available
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Retail-only SKU
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {DATA.topSkus.map((sku, i) => (
                <div
                  key={sku.name}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-amber-50/40 transition-colors group"
                >
                  <span className="font-fraunces text-lg font-bold text-stone-300 w-6 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-800 truncate">{sku.name}</p>
                      <span
                        className="shrink-0 inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: sku.dtcAvail ? C.orange : C.rose }}
                        title={sku.dtcAvail ? 'Available on DTC' : 'Retail-only SKU'}
                      />
                      {!sku.dtcAvail && (
                        <span
                          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: C.roseLight, color: '#C94F4F' }}
                        >
                          Retail-only
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-sm">
                    <div className="text-right">
                      <p className="font-semibold text-stone-900">{fmtComma(sku.units)}</p>
                      <p className="text-xs text-stone-400">units sold</p>
                    </div>
                    <div className="text-right w-20">
                      <p className="font-semibold text-stone-900">{sku.retailers}</p>
                      <p className="text-xs text-stone-400">{sku.retailers === 1 ? 'retailer' : 'retailers'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── 7. Orders Over Time ─────────────────────────────────────────── */}
        <div>
          <SectionLabel>Trend analysis</SectionLabel>
          <Section>
            <div className="flex items-start justify-between mb-4">
              <div>
                <SectionTitle>Orders over time — last 90 days</SectionTitle>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-stone-400">Show by retailer</span>
                <div
                  className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                    showRetailerLines ? 'bg-amber-400' : 'bg-stone-200'
                  }`}
                  onClick={() => setShowRetailerLines(v => !v)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      showRetailerLines ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={DATA.ordersOverTime} margin={{ right: 16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F0E8" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#9C8A77' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9C8A77' }}
                  axisLine={false} tickLine={false}
                  width={36}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD0', fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                {/* DTC — always shown, dotted */}
                <Line
                  type="monotone" dataKey="dtc" name="DTC"
                  stroke={C.inkLight} strokeWidth={2} strokeDasharray="4 4"
                  dot={false} activeDot={{ r: 4 }}
                />
                {/* Retail total — always shown when not split */}
                {!showRetailerLines && (
                  <Line
                    type="monotone" dataKey="retail" name="Retail (total)"
                    stroke={C.orange} strokeWidth={2.5}
                    dot={false} activeDot={{ r: 4 }}
                  />
                )}
                {/* Per-retailer lines */}
                {showRetailerLines && Object.entries(RETAILERS).map(([id, r]) => (
                  <Line
                    key={id}
                    type="monotone" dataKey={id} name={r.name}
                    stroke={r.color} strokeWidth={2}
                    dot={false} activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            <div
              className="mt-4 rounded-xl p-3 flex items-start gap-2.5"
              style={{ backgroundColor: C.greenLight }}
            >
              <TrendingUp size={15} className="text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed">
                <strong>Retail and DTC are growing together</strong> — a signal of brand health, not cannibalization.
                Amazon is driving the most retail volume; Sephora and Ulta show the highest loyalty overlap.
              </p>
            </div>
          </Section>
        </div>

        {/* ── 8. Retailer Breakdown Table ─────────────────────────────────── */}
        <div>
          <SectionLabel>Retailer breakdown</SectionLabel>
          <Section>
            <SectionTitle>Performance by retailer</SectionTitle>
            <RetailerTable rows={DATA.gmv.byRetailer} />
          </Section>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-stone-300">
          Oriva · Retail Visibility · Powered by Claim / Yotpo &nbsp;·&nbsp; Data refreshes daily
        </div>
      </main>
    </div>
  );
}
