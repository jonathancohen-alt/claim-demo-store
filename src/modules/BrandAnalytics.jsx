import { useState, useMemo, useCallback } from 'react';
import { DemoControls } from '../components/DemoControls';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Users, Star, ArrowUpRight,
  Eye, Package, BarChart2, AlertCircle, ChevronUp, ChevronDown, Download, Crown,
  AlertTriangle, CheckCircle, X,
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
    { name: 'Vitamin C Brightening Serum',   units: 3840, gmv: 215040, retailers: 4, dtcAvail: true  },
    { name: 'Hydra-Glow Moisturizer',         units: 3120, gmv: 171600, retailers: 4, dtcAvail: true  },
    { name: 'Retinol Renewal Night Cream',    units: 2670, gmv: 187290, retailers: 3, dtcAvail: true  },
    { name: 'SPF 40 Daily Primer',            units: 2240, gmv: 100800, retailers: 4, dtcAvail: true  },
    { name: 'Peptide Eye Concentrate',        units: 1980, gmv: 148500, retailers: 2, dtcAvail: true  },
    { name: 'Squalane Cleansing Oil',         units: 1740, gmv:  78300, retailers: 3, dtcAvail: true  },
    { name: 'Barrier Repair Balm (Travel)',   units: 1520, gmv:  45600, retailers: 4, dtcAvail: false },
    { name: 'AHA Exfoliating Toner',          units: 1310, gmv:  72050, retailers: 2, dtcAvail: true  },
    { name: 'Pore-Refining Clay Mask',        units: 1180, gmv:  59000, retailers: 3, dtcAvail: true  },
    { name: 'Lip Plumping Treatment',         units:  940, gmv:  37600, retailers: 2, dtcAvail: false },
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

// ─── Section 9: Channel Migration ─────────────────────────────────────────────
const MIGRATION_BA = {
  '90d':  { dtcStay: 342, dtcToRetail: 156, retailToDtc: 89,  retailStay: 521 },
  '180d': { dtcStay: 418, dtcToRetail: 203, retailToDtc: 134, retailStay: 647 },
  '12m':  { dtcStay: 512, dtcToRetail: 287, retailToDtc: 198, retailStay: 850 },
};

const FLOW_COLORS = {
  dtcStay:      C.blue,
  dtcToRetail:  C.orange,
  retailToDtc:  C.green,
  retailStay:   C.purple,
};

function InsightBox({ children, color = C.green, Icon = TrendingUp }) {
  return (
    <div className="mt-4 rounded-xl p-3 flex items-start gap-2.5" style={{ backgroundColor: color + '18', border: `1px solid ${color}30` }}>
      <Icon size={15} style={{ color, marginTop: 1, flexShrink: 0 }} />
      <p className="text-xs leading-relaxed" style={{ color: color === C.green ? '#1a5c39' : color === C.orange ? '#7a4a00' : color }}>
        {children}
      </p>
    </div>
  );
}

function ChannelMigrationSection() {
  const [win, setWin] = useState('90d');
  const [drillKey, setDrillKey] = useState(null);
  const d = MIGRATION_BA[win];
  const total = d.dtcStay + d.dtcToRetail + d.retailToDtc + d.retailStay;

  const W = 520, H = 200, pad = 20, nodeW = 16, gap = 10;
  const dtcOut = d.dtcStay + d.dtcToRetail;
  const retailOut = d.retailToDtc + d.retailStay;
  const dtcOutH = (dtcOut / total) * (H - pad * 2 - gap);
  const retailOutH = (retailOut / total) * (H - pad * 2 - gap);
  const dtcOutY = pad;
  const retailOutY = pad + dtcOutH + gap;

  const dtcEndH = ((d.dtcStay + d.retailToDtc) / total) * (H - pad * 2 - gap);
  const retailEndH = ((d.dtcToRetail + d.retailStay) / total) * (H - pad * 2 - gap);
  const dtcEndY = pad;
  const retailEndY = pad + dtcEndH + gap;

  const flows = [
    {
      key: 'dtcStay', label: 'DTC → DTC', value: d.dtcStay,
      lx0: nodeW, ly0: dtcOutY, ly1: dtcOutY + (d.dtcStay / dtcOut) * dtcOutH,
      rx0: W - nodeW, ry0: dtcEndY, ry1: dtcEndY + (d.dtcStay / (d.dtcStay + d.retailToDtc)) * dtcEndH,
    },
    {
      key: 'dtcToRetail', label: 'DTC → Retail', value: d.dtcToRetail,
      lx0: nodeW, ly0: dtcOutY + (d.dtcStay / dtcOut) * dtcOutH, ly1: dtcOutY + dtcOutH,
      rx0: W - nodeW, ry0: retailEndY, ry1: retailEndY + (d.dtcToRetail / (d.dtcToRetail + d.retailStay)) * retailEndH,
    },
    {
      key: 'retailToDtc', label: 'Retail → DTC', value: d.retailToDtc,
      lx0: nodeW, ly0: retailOutY, ly1: retailOutY + (d.retailToDtc / retailOut) * retailOutH,
      rx0: W - nodeW, ry0: dtcEndY + (d.dtcStay / (d.dtcStay + d.retailToDtc)) * dtcEndH, ry1: dtcEndY + dtcEndH,
    },
    {
      key: 'retailStay', label: 'Retail → Retail', value: d.retailStay,
      lx0: nodeW, ly0: retailOutY + (d.retailToDtc / retailOut) * retailOutH, ly1: retailOutY + retailOutH,
      rx0: W - nodeW, ry0: retailEndY + (d.dtcToRetail / (d.dtcToRetail + d.retailStay)) * retailEndH, ry1: retailEndY + retailEndH,
    },
  ];

  const biggest = [...flows].sort((a, b) => b.value - a.value)[0];
  const drillSeg = flows.find(f => f.key === drillKey);
  const sampleShoppers = [
    { name: 'Emma Johnson', id: '#10284', spend: '$312' },
    { name: 'Liam Garcia',  id: '#10291', spend: '$208' },
    { name: 'Olivia Smith', id: '#10305', spend: '$445' },
    { name: 'Noah Brown',   id: '#10318', spend: '$187' },
    { name: 'Ava Martinez', id: '#10324', spend: '$390' },
  ];

  return (
    <div>
      <SectionLabel>Channel migration</SectionLabel>
      <Section>
        <div className="flex items-start justify-between mb-4">
          <SectionTitle>How shoppers move between DTC and retail</SectionTitle>
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 shrink-0">
            {['90d', '180d', '12m'].map(w => (
              <button
                key={w}
                onClick={() => { setWin(w); setDrillKey(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${win === w ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {w === '90d' ? '90 days' : w === '180d' ? '6 months' : '12 months'}
              </button>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: 200, overflow: 'visible' }}>
          {/* Left node labels */}
          <text x={nodeW + 6} y={dtcOutY + dtcOutH / 2} dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#4A3F2F" fontFamily="DM Sans,sans-serif">DTC ({Math.round((dtcOut / total) * 100)}%)</text>
          <text x={nodeW + 6} y={retailOutY + retailOutH / 2} dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#4A3F2F" fontFamily="DM Sans,sans-serif">Retail ({Math.round((retailOut / total) * 100)}%)</text>
          {/* Right node labels */}
          <text x={W - nodeW - 6} y={dtcEndY + dtcEndH / 2} dominantBaseline="middle" textAnchor="end" fontSize="10" fontWeight="700" fill="#4A3F2F" fontFamily="DM Sans,sans-serif">DTC ({d.dtcStay + d.retailToDtc})</text>
          <text x={W - nodeW - 6} y={retailEndY + retailEndH / 2} dominantBaseline="middle" textAnchor="end" fontSize="10" fontWeight="700" fill="#4A3F2F" fontFamily="DM Sans,sans-serif">Retail ({d.dtcToRetail + d.retailStay})</text>

          {flows.map(f => {
            const ctrl = W * 0.38;
            const path = `M ${f.lx0} ${f.ly0} C ${ctrl} ${f.ly0}, ${W - ctrl} ${f.ry0}, ${f.rx0} ${f.ry0} L ${f.rx0} ${f.ry1} C ${W - ctrl} ${f.ry1}, ${ctrl} ${f.ly1}, ${f.lx0} ${f.ly1} Z`;
            const col = FLOW_COLORS[f.key];
            const isActive = drillKey === f.key;
            return (
              <path key={f.key} d={path} fill={col} fillOpacity={drillKey && !isActive ? 0.06 : 0.20}
                stroke={col} strokeOpacity={isActive ? 0.9 : 0.40} strokeWidth={isActive ? 1.5 : 0.5}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setDrillKey(isActive ? null : f.key)}
              />
            );
          })}

          <rect x={0} y={dtcOutY} width={nodeW} height={dtcOutH} rx={4} fill={C.blue} />
          <rect x={0} y={retailOutY} width={nodeW} height={retailOutH} rx={4} fill={C.purple} />
          <rect x={W - nodeW} y={dtcEndY} width={nodeW} height={dtcEndH} rx={4} fill={C.blue} />
          <rect x={W - nodeW} y={retailEndY} width={nodeW} height={retailEndH} rx={4} fill={C.purple} />
        </svg>

        {/* Legend chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {flows.map(f => {
            const col = FLOW_COLORS[f.key];
            const isActive = drillKey === f.key;
            return (
              <button key={f.key} onClick={() => setDrillKey(isActive ? null : f.key)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                style={{ background: isActive ? col + '18' : '#F5F0E8', color: isActive ? col : '#8C7B66', border: `1px solid ${isActive ? col + '40' : 'transparent'}` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: col }} />
                {f.label}
                <span className="font-bold ml-0.5" style={{ color: isActive ? col : '#1A1209' }}>{f.value.toLocaleString()}</span>
              </button>
            );
          })}
        </div>

        {/* Drill-down */}
        {drillSeg && (
          <div className="mt-4 rounded-xl overflow-hidden border" style={{ borderColor: FLOW_COLORS[drillSeg.key] + '30' }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: FLOW_COLORS[drillSeg.key] + '12' }}>
              <span className="text-xs font-bold" style={{ color: FLOW_COLORS[drillSeg.key] }}>{drillSeg.label} — {drillSeg.value.toLocaleString()} shoppers</span>
              <button onClick={() => setDrillKey(null)} style={{ color: FLOW_COLORS[drillSeg.key], opacity: 0.6 }}><X size={13} /></button>
            </div>
            {sampleShoppers.slice(0, Math.min(5, drillSeg.value)).map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5 border-t border-stone-50">
                <div>
                  <span className="text-xs font-semibold text-stone-800">{s.name}</span>
                  <span className="text-[10px] text-stone-400 ml-2">{s.id}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: C.orange }}>{s.spend}</span>
              </div>
            ))}
            {drillSeg.value > 5 && (
              <div className="px-4 py-2.5 border-t border-stone-50 text-center text-xs text-stone-400">
                + {drillSeg.value - 5} more · Export to see full list
              </div>
            )}
          </div>
        )}

        <InsightBox color={FLOW_COLORS[biggest.key]} Icon={TrendingUp}>
          <strong>{biggest.label}</strong> is the dominant migration pattern this period — {biggest.value.toLocaleString()} shoppers ({Math.round((biggest.value / total) * 100)}% of base).
          {biggest.key === 'dtcToRetail' && ' Consider a DTC loyalty incentive to recover channel share.'}
          {biggest.key === 'retailToDtc' && ' Retail-to-DTC converts are your highest LTV segment — nurture them with a welcome series.'}
          {biggest.key === 'dtcStay' && ' DTC retention is strong. Double down on points bonuses to hold the base.'}
          {biggest.key === 'retailStay' && ' Most of your base is retail-loyal. A direct-channel intro offer could accelerate conversion.'}
        </InsightBox>
      </Section>
    </div>
  );
}

// ─── Section 10: Purchase Timing ───────────────────────────────────────────────
// Each bucket = number of shoppers whose average days-between-purchases falls in that range.
// Broken out by shopper type so you can see omnichannel shoppers cluster at shorter intervals.
const INTERVAL_HIST_BA = [
  { range: '0–14d',  dtcOnly: 4,  retailOnly: 6,  omni: 38  },
  { range: '15–21d', dtcOnly: 18, retailOnly: 14, omni: 112 },
  { range: '22–30d', dtcOnly: 74, retailOnly: 58, omni: 198 },
  { range: '31–45d', dtcOnly: 182, retailOnly: 164, omni: 148 },
  { range: '46–60d', dtcOnly: 224, retailOnly: 312, omni: 68  },
  { range: '61–90d', dtcOnly: 168, retailOnly: 248, omni: 24  },
  { range: '90d+',   dtcOnly: 98,  retailOnly: 142, omni: 8   },
];

const LAPSE_BA = {
  '90d':  { active: 1124, atRisk: 412, lapsed: 311 },
  '180d': { active: 1248, atRisk: 356, lapsed: 243 },
  '12m':  { active: 1412, atRisk: 289, lapsed: 146 },
};

function LapseCohortCards({ lapse }) {
  const [exported, setExported] = useState(null);
  const cohorts = [
    { key: 'active',  label: 'Active',  count: lapse.active,  desc: '< 1× their avg interval',  color: C.green,   bg: C.greenLight,  Icon: CheckCircle  },
    { key: 'atRisk',  label: 'At-Risk', count: lapse.atRisk,  desc: '1.5× their avg interval',  color: '#B45309', bg: C.orangeLight, Icon: AlertTriangle },
    { key: 'lapsed',  label: 'Lapsed',  count: lapse.lapsed,  desc: '≥ 2× their avg interval',  color: C.rose,    bg: C.roseLight,   Icon: AlertTriangle },
  ];

  function handleExport(key) {
    setExported(key);
    setTimeout(() => setExported(null), 2000);
  }

  return (
    <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-stone-100">
      {cohorts.map(({ key, label, count, desc, color, bg, Icon }) => (
        <div key={key} className="rounded-xl p-3 flex flex-col items-center gap-2" style={{ background: bg }}>
          <Icon size={14} style={{ color }} />
          <p className="font-fraunces font-bold text-xl" style={{ color }}>{count.toLocaleString()}</p>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>{label}</p>
          <p className="text-[10px] text-stone-400">{desc}</p>
          <button
            onClick={() => handleExport(key)}
            className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors w-full justify-center"
            style={{
              background: exported === key ? color : 'rgba(255,255,255,0.7)',
              color: exported === key ? 'white' : color,
              border: `1px solid ${color}40`,
            }}
          >
            <Download size={11} />
            {exported === key ? 'Exported!' : 'Export segment'}
          </button>
        </div>
      ))}
    </div>
  );
}

function PurchaseTimingSection() {
  const [timeWin, setTimeWin] = useState('90d');
  const lapse = LAPSE_BA[timeWin];

  return (
    <div>
      <SectionLabel>Replenishment rhythm</SectionLabel>
      <Section>
        <div className="flex items-start justify-between mb-2">
          <SectionTitle>Average days between purchases — per shopper</SectionTitle>
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 shrink-0">
            {['90d', '180d', '12m'].map(w => (
              <button key={w} onClick={() => setTimeWin(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeWin === w ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {w === '90d' ? '90 days' : w === '180d' ? '6 months' : '12 months'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-stone-400 mb-5">
          Each shopper's average interval across <em>all</em> their purchases, regardless of channel. Omnichannel shoppers buy more frequently — their intervals compress.
        </p>

        {/* Median stats */}
        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { label: 'Median — DTC only',    value: '54 days', color: C.blue   },
            { label: 'Median — Retail only', value: '58 days', color: C.purple },
            { label: 'Median — Omnichannel', value: '28 days', color: C.orange },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2 border border-stone-100" style={{ background: '#FAF7F2' }}>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
                <p className="font-fraunces font-bold text-base leading-tight" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Histogram */}
        <div className="flex items-center gap-4 mb-2">
          {[{ color: C.blue, label: 'DTC-only shoppers' }, { color: C.purple, label: 'Retail-only shoppers' }, { color: C.orange, label: 'Omnichannel shoppers' }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-xs text-stone-400">{label}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={INTERVAL_HIST_BA} barGap={2} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0E8" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#9C8A77' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9C8A77' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD0', fontSize: 12 }} />
            <Bar dataKey="dtcOnly"    name="DTC-only"    fill={C.blue}   radius={[3,3,0,0]} fillOpacity={0.80} />
            <Bar dataKey="retailOnly" name="Retail-only" fill={C.purple} radius={[3,3,0,0]} fillOpacity={0.75} />
            <Bar dataKey="omni"       name="Omnichannel" fill={C.orange} radius={[3,3,0,0]} fillOpacity={0.90} />
          </BarChart>
        </ResponsiveContainer>

        {/* Lapse cards */}
        <LapseCohortCards lapse={lapse} />

        <InsightBox color={C.rose} Icon={AlertTriangle}>
          <strong>{lapse.atRisk.toLocaleString()} shoppers are overdue</strong> based on their personal replenishment rhythm — last purchase was 1.5× their own average interval.
          A targeted nudge now could recover an estimated <strong>${(lapse.atRisk * 38).toLocaleString()}</strong> in at-risk GMV.
        </InsightBox>
      </Section>
    </div>
  );
}

// ─── Section 11: Interactive Channel Segmentation ─────────────────────────────
const CHANNELS_BA = [
  { id: 'dtc',     label: 'DTC',     color: C.blue,   shoppers: 829,  gmv: 35482, aov: 42.8 },
  { id: 'amazon',  label: 'Amazon',  color: '#FF9900', shoppers: 1247, gmv: 58963, aov: 47.3 },
  { id: 'sephora', label: 'Sephora', color: '#D4395C', shoppers: 978,  gmv: 44210, aov: 45.2 },
  { id: 'ulta',    label: 'Ulta',    color: '#7B1FA2', shoppers: 784,  gmv: 35840, aov: 45.7 },
  { id: 'target',  label: 'Target',  color: '#CC0000', shoppers: 612,  gmv: 24381, aov: 39.8 },
];

const OVERLAP_BA = {
  'amazon+dtc':    { shoppers: 412, gmv: 24180, aov: 58.7 },
  'dtc+sephora':   { shoppers: 210, gmv: 12840, aov: 61.1 },
  'dtc+ulta':      { shoppers: 178, gmv: 10920, aov: 61.3 },
  'dtc+target':    { shoppers: 134, gmv:  7480, aov: 55.8 },
  'amazon+sephora':{ shoppers: 298, gmv: 18740, aov: 62.9 },
  'amazon+ulta':   { shoppers: 234, gmv: 15120, aov: 64.6 },
  'amazon+target': { shoppers: 187, gmv: 10440, aov: 55.8 },
  'sephora+ulta':  { shoppers: 312, gmv: 20280, aov: 65.0 },
  'sephora+target':{ shoppers: 148, gmv:  8140, aov: 55.0 },
  'target+ulta':   { shoppers: 118, gmv:  6490, aov: 55.0 },
  'amazon+dtc+sephora':       { shoppers: 142, gmv: 11360, aov: 80.0 },
  'amazon+dtc+ulta':          { shoppers: 118, gmv:  9440, aov: 80.0 },
  'amazon+sephora+ulta':      { shoppers: 168, gmv: 14280, aov: 85.0 },
  'amazon+dtc+sephora+ulta':  { shoppers:  88, gmv:  8800, aov: 100.0 },
  'amazon+dtc+sephora+target+ulta': { shoppers: 42, gmv:  4620, aov: 110.0 },
};

function segStats(selected) {
  if (selected.length === 0) return { shoppers: 0, gmv: 0, aov: 0 };
  if (selected.length === 1) return CHANNELS_BA.find(c => c.id === selected[0]) || { shoppers: 0, gmv: 0, aov: 0 };
  const key = [...selected].sort().join('+');
  return OVERLAP_BA[key] || { shoppers: Math.max(8, Math.floor(CHANNELS_BA.find(c=>c.id===selected[0])?.shoppers * 0.02)), gmv: 0, aov: 0 };
}

function ChannelSegmentationSection() {
  const [selected, setSelected] = useState(['dtc', 'amazon']);
  const [exported, setExported] = useState(false);

  const toggle = useCallback((id) => {
    setSelected(prev => prev.includes(id)
      ? prev.length > 1 ? prev.filter(x => x !== id) : prev
      : [...prev, id]
    );
  }, []);

  const stats = segStats(selected);
  const selectedLabels = selected.map(id => CHANNELS_BA.find(c => c.id === id)?.label).join(' + ');

  const singleAvg = CHANNELS_BA.filter(c => selected.includes(c.id)).reduce((s,c) => s + c.aov, 0) / selected.length;
  const aovPremium = stats.aov && selected.length >= 2 ? Math.round(((stats.aov - singleAvg) / singleAvg) * 100) : 0;

  return (
    <div>
      <SectionLabel>Interactive segmentation</SectionLabel>
      <Section>
        <div className="flex items-start justify-between mb-1">
          <SectionTitle>Build your own channel overlap segment</SectionTitle>
        </div>
        <p className="text-sm text-stone-400 -mt-3 mb-5">
          Select any combination of channels to see only shoppers who purchased across all of them.
        </p>

        {/* Channel toggles */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CHANNELS_BA.map(ch => {
            const isOn = selected.includes(ch.id);
            return (
              <button key={ch.id} onClick={() => toggle(ch.id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isOn ? ch.color + '18' : '#F5F0E8',
                  color: isOn ? ch.color : '#8C7B66',
                  border: `1.5px solid ${isOn ? ch.color + '50' : 'transparent'}`,
                  boxShadow: isOn ? `0 0 0 3px ${ch.color}12` : 'none',
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ch.color, opacity: isOn ? 1 : 0.5 }} />
                {ch.label}
                <span className="font-normal opacity-60 ml-0.5">{ch.shoppers.toLocaleString()}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Shoppers', value: stats.shoppers?.toLocaleString() ?? '—', color: C.blue   },
            { label: 'GMV',      value: stats.gmv ? `$${stats.gmv.toLocaleString()}` : '—', color: C.orange },
            { label: 'AOV',      value: stats.aov ? `$${stats.aov.toFixed(0)}` : '—', color: C.green  },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl px-4 py-3 text-center border border-stone-100" style={{ background: '#FAF7F2' }}>
              <p className="font-fraunces font-bold text-2xl" style={{ color }}>{value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Selection summary + export */}
        <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 border border-stone-100" style={{ background: C.creamDark }}>
          <p className="text-xs text-stone-600">
            Showing <strong className="text-stone-900">{stats.shoppers?.toLocaleString() ?? 0} shoppers</strong> who purchased from: <strong className="text-stone-900">{selectedLabels}</strong>
            {selected.length > 1 && <span className="text-stone-400"> (cross-channel overlap)</span>}
          </p>
          <button
            onClick={() => { setExported(true); setTimeout(() => setExported(false), 2000); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 transition-colors shrink-0"
            style={{ background: exported ? C.green : 'white', color: exported ? 'white' : C.inkMid }}
          >
            <Download size={13} />
            {exported ? 'Exported!' : 'Export segment'}
          </button>
        </div>

        {aovPremium > 0 && (
          <InsightBox color={C.green} Icon={TrendingUp}>
            Cross-channel shoppers buying from <strong>{selectedLabels}</strong> have an AOV of <strong>${stats.aov?.toFixed(0)}</strong> — {aovPremium}% higher than the single-channel average (${singleAvg.toFixed(0)}).
            This is your highest-value audience.
          </InsightBox>
        )}
      </Section>
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

  const gmvBars = DATA.gmv.byRetailer.map(r => ({
    name: RETAILERS[r.id].name,
    gmv:  r.gmv,
    color: RETAILERS[r.id].color,
  }));

  const totalOrders = DATA.gmv.byRetailer.reduce((s, r) => s + r.orders, 0);
  const totalRetailers = Object.keys(RETAILERS).length;

  return (
    <div className="min-h-screen font-dm-sans" style={{ backgroundColor: C.cream }}>
      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: C.orange }}>O</div>
            <span className="font-fraunces font-semibold text-stone-900 text-lg tracking-tight">Oriva</span>
            <span className="text-stone-300 mx-1">·</span>
            <span className="text-stone-500 text-sm">Retail Visibility Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: C.orangeLight, color: '#8B5E0A' }}>Last 90 days</span>
            <span className="text-xs text-stone-400">Powered by Claim</span>
          </div>
        </div>
      </nav>

      <DemoControls />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-5">

        {/* ── Row 1: Hero ── */}
        <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #1A1209 0%, #3D2B10 100%)` }}>
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: C.orange }} />
          <div className="absolute -right-8 -bottom-16 w-52 h-52 rounded-full opacity-[0.06]" style={{ backgroundColor: C.orange }} />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80 mb-2">Unique retail buyers identified</p>
            <div className="flex items-end gap-4 mb-3">
              <span className="font-fraunces text-7xl font-bold text-white leading-none">{fmtComma(DATA.heroShoppers)}</span>
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1"><TrendingUp size={16} /><span className="text-sm font-semibold">+34% vs. prior period</span></div>
                <p className="text-stone-400 text-sm">connected in the last 90 days</p>
              </div>
            </div>
            <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
              {[
                { label: 'Retail GMV surfaced',             value: fmt(DATA.gmv.total)                        },
                { label: 'Retailer touchpoints',            value: String(totalRetailers)                     },
                { label: 'Retail orders matched',           value: fmtComma(totalOrders)                      },
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

        {/* ── Row 2: Segmentation (2 cards) + Loyalty Overlap ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Retail-Only */}
          <Section>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Retail-Only Buyers</p>
                <p className="font-fraunces text-3xl font-bold text-stone-900">{fmtComma(DATA.segmentation.retailOnly.count)}</p>
                <p className="text-stone-400 text-sm mt-0.5">{DATA.segmentation.retailOnly.pct}% of base</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.blueLight }}>
                <ShoppingBag size={16} style={{ color: C.blue }} />
              </div>
            </div>
            <MiniSparkline data={sparkRetailOnly} color={C.blue} />
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">Never purchased DTC.</p>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors" onClick={() => alert('Exporting…')}>
              <Download size={12} /> Export segment
            </button>
          </Section>

          {/* Omnichannel */}
          <Section className="ring-2" style={{ '--tw-ring-color': C.orange + '40' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Omnichannel</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: C.orangeLight, color: '#8B5E0A' }}>Highest LTV</span>
                </div>
                <p className="font-fraunces text-3xl font-bold text-stone-900">{fmtComma(DATA.segmentation.omnichannel.count)}</p>
                <p className="text-stone-400 text-sm mt-0.5">{DATA.segmentation.omnichannel.pct}% of base</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.orangeLight }}>
                <Star size={16} style={{ color: C.orange }} />
              </div>
            </div>
            <MiniSparkline data={sparkOmni} color={C.orange} />
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">DTC + retail. Most engaged cohort.</p>
            <div className="mt-3 flex gap-1.5">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors" onClick={() => alert('Exporting…')}>
                <Download size={12} /> Export
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors" onClick={() => alert('Tier upgrade…')}>
                <Crown size={12} /> Tier upgrade
              </button>
            </div>
          </Section>

          {/* Loyalty Overlap */}
          <Section>
            <div className="flex items-start justify-between mb-1">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Loyalty Overlap</p>
              <select
                value={retailerView}
                onChange={e => setRetailerView(e.target.value)}
                className="text-xs text-stone-500 border border-stone-200 rounded-lg px-2 py-1 bg-white"
              >
                <option value="all">All Retailers</option>
                {['amazon','sephora','ulta','target'].map(r => <option key={r} value={r}>{RETAILERS[r].name}</option>)}
              </select>
            </div>
            <DonutChart loyalty={canniData.loyaltyMembers} netNew={canniData.netNew} />
            <div className="space-y-2 -mt-2">
              {[
                { label: 'Loyalty members', pct: canniData.loyaltyMembers, color: C.orange },
                { label: 'Net new to brand', pct: canniData.netNew,        color: C.inkLight },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-xs text-stone-500">{s.label}</span></div>
                    <span className="text-xs font-bold text-stone-900">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg p-2.5 border" style={{ backgroundColor: C.roseLight, borderColor: '#FECACA' }}>
              <p className="text-xs text-rose-800 leading-relaxed">
                <strong>{canniData.loyaltyMembers}%</strong> are loyalty members earning nothing for retail purchases.
              </p>
            </div>
          </Section>
        </div>

        {/* ── Row 3: GMV chart + Orders over time ── */}
        <div className="grid grid-cols-2 gap-4">
          <Section>
            <SectionLabel>Revenue visibility</SectionLabel>
            <div className="flex items-baseline gap-3 mb-1">
              <p className="font-fraunces text-4xl font-bold text-stone-900">{fmt(DATA.gmv.total)}</p>
              <p className="text-stone-400 text-sm">retail GMV surfaced</p>
            </div>
            <div className="flex gap-4 mb-4">
              {[{ label: 'DTC AOV', aov: DATA.gmv.dtcAOV, c: C.orange }, { label: 'Retail AOV', aov: DATA.gmv.retailAOV, c: C.inkLight }].map(x => (
                <div key={x.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} />
                  <span className="text-xs text-stone-400">{x.label}</span>
                  <span className="text-xs font-bold text-stone-900">${x.aov}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gmvBars} layout="vertical" margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F0E8" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#9C8A77' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#4A3F2F', fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'GMV']} contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD0', fontSize: 12 }} />
                <Bar dataKey="gmv" radius={[0, 6, 6, 0]}>
                  {gmvBars.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section>
            <div className="flex items-start justify-between mb-3">
              <div>
                <SectionLabel>Trend analysis</SectionLabel>
                <SectionTitle>Orders over time</SectionTitle>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <span className="text-xs text-stone-400">By retailer</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${showRetailerLines ? 'bg-amber-400' : 'bg-stone-200'}`} onClick={() => setShowRetailerLines(v => !v)}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${showRetailerLines ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={DATA.ordersOverTime} margin={{ right: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F0E8" />
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#9C8A77' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: '#9C8A77' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7DDD0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line type="monotone" dataKey="dtc" name="DTC" stroke={C.inkLight} strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{ r: 3 }} />
                {!showRetailerLines && <Line type="monotone" dataKey="retail" name="Retail (total)" stroke={C.orange} strokeWidth={2.5} dot={false} activeDot={{ r: 3 }} />}
                {showRetailerLines && Object.entries(RETAILERS).map(([id, r]) => (
                  <Line key={id} type="monotone" dataKey={id} name={r.name} stroke={r.color} strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 rounded-xl p-2.5 flex items-start gap-2" style={{ backgroundColor: C.greenLight }}>
              <TrendingUp size={13} className="text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed"><strong>Retail and DTC are growing together</strong> — brand health signal, not cannibalization.</p>
            </div>
          </Section>
        </div>

        {/* ── Row 4: Channel Migration + Purchase Timing ── */}
        <div className="grid grid-cols-2 gap-4">
          <div><ChannelMigrationSection /></div>
          <div><PurchaseTimingSection /></div>
        </div>

        {/* ── Row 5: Channel Segmentation (full width) ── */}
        <ChannelSegmentationSection />

        {/* ── Row 6: Top Spenders (full width) ── */}
        <TopSpendersSection />

        {/* ── Row 7: Top SKUs (full width) ── */}
        <div>
          <SectionLabel>Product performance</SectionLabel>
          <Section>
            <div className="flex items-start justify-between mb-4">
              <div>
                <SectionTitle>Top SKUs at retail</SectionTitle>
                <p className="text-sm text-stone-400 -mt-3 mb-4">These products are moving at retail. Are your loyalty members earning points for them?</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> DTC available</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Retail-only</span>
              </div>
            </div>
            <div className="space-y-1">
              {DATA.topSkus.map((sku, i) => (
                <div key={sku.name} className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-amber-50/40 transition-colors">
                  <span className="font-fraunces text-lg font-bold text-stone-300 w-6 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-800 truncate">{sku.name}</p>
                      <span className="shrink-0 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: sku.dtcAvail ? C.orange : C.rose }} />
                      {!sku.dtcAvail && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: C.roseLight, color: '#C94F4F' }}>Retail-only</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-sm">
                    <div className="text-right w-20"><p className="font-semibold text-stone-900">{fmtComma(sku.units)}</p><p className="text-xs text-stone-400">units sold</p></div>
                    <div className="text-right w-24"><p className="font-semibold" style={{ color: C.orange }}>{fmt(sku.gmv)}</p><p className="text-xs text-stone-400">GMV</p></div>
                    <div className="text-right w-16"><p className="font-semibold text-stone-900">{sku.retailers}</p><p className="text-xs text-stone-400">{sku.retailers === 1 ? 'retailer' : 'retailers'}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="text-center py-6 text-xs text-stone-300">
          Oriva · Retail Visibility · Powered by Claim / Yotpo &nbsp;·&nbsp; Data refreshes daily
        </div>
      </main>
    </div>
  );
}
