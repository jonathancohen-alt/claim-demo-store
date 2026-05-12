import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Menu, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrivaLogoWhite } from '../components/brand/Logo';
import { DEMO_BRAND } from '../config/constants';
import { ProductMock } from '../components/brand/ProductMock';
import { PRODUCTS } from '../config/products';
import { Footer } from '../components/brand/Footer';

// ─── Img with fallback ────────────────────────────────────────────────────────
function Img({ src, alt, fallbackBg, className, style, children }) {
  const [err, setErr] = useState(false);
  if (!err && src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        onError={() => setErr(true)}
        className={className}
        style={style}
      />
    );
  }
  return (
    <div className={className} style={{ ...style, background: fallbackBg }}>
      {children}
    </div>
  );
}

// ─── NAV  dark pill, floats on cream ─────────────────────────────────────────
function Nav({ onCart, cartCount, totalPoints }) {
  return (
    <nav className="sticky top-0 z-30 px-3 pt-3 pb-0">
      <div
        className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-pill"
        style={{ background: '#0E1410' }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <OrivaLogoWhite height={22} />
        </div>

        {/* Icons + User badge */}
        <div className="flex items-center gap-3">
          <button aria-label="Wishlist" className="w-9 h-9 flex items-center justify-center text-cream-100 hover:opacity-60 transition">
            <Heart size={18} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Cart"
            onClick={onCart}
            className="relative w-9 h-9 flex items-center justify-center text-cream-100 hover:opacity-60 transition"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cream-100 text-ink-900 text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button aria-label="Menu" className="w-9 h-9 flex items-center justify-center text-cream-100 hover:opacity-60 transition">
            <Menu size={18} strokeWidth={1.5} />
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <div className="w-7 h-7 rounded-full bg-[#1F4F3D] text-white text-xs font-bold flex items-center justify-center shrink-0">
              JC
            </div>
            <div className="hidden sm:flex flex-col leading-none gap-0.5">
              <span className="text-xs font-semibold text-white">Jonathan Cohen</span>
              <span className="text-xs font-medium tabular-nums" style={{ color: '#7EC8A4' }}>
                {totalPoints.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO  full-bleed photo, text + CTA overlaid bottom-left ─────────────────
function Hero({ onShop }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 460 }}>
      {/* Full-bleed couple photo — edge to edge, no radius, no margin */}
      <Img
        src="/images/hero-couple.jpg"
        alt="Good skin, no drama"
        fallbackBg="#7B8DD4"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 20%' }}
        style={{ minHeight: 460 }}
      >
        {/* gradient fallback stripes matching the periwinkle bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#9AAAE0 0%,#7B8DD4 55%,#6073B8 100%)' }} />
      </Img>

      {/* Scrim — bottom gradient for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(6,7,6,0.80) 0%, rgba(6,7,6,0.28) 50%, transparent 72%)' }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-end px-4 pb-7"
        style={{ minHeight: 460 }}
      >
        <h1
          className="text-white font-display leading-[0.90] tracking-tightest mb-2"
          style={{ fontSize: 'clamp(2.6rem, 10vw, 4rem)' }}
        >
          <span className="font-bold">Good</span> Skin.<br />
          No <span className="font-bold">Drama.</span>
        </h1>
        <p className="text-white/75 text-sm leading-snug mb-5">
          Simple skincare that actually works.<br />Hydrate, glow, repeat.
        </p>
        <button
          onClick={onShop}
          className="w-full bg-white text-ink-900 font-display font-semibold text-sm py-3.5 rounded-pill hover:bg-cream-100 transition-colors active:scale-[0.97] max-w-xs"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}

// ─── PRODUCT CARD  real photo on periwinkle bg ────────────────────────────────
function ProductCard({ product, onClick }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="cursor-pointer group" onClick={onClick}>
      {/* Image block */}
      <div
        className="relative rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: '#9AAAE0', aspectRatio: '1 / 1.05' }}
      >
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold px-3 py-1 rounded-pill bg-cream-100 text-ink-900">
            {product.badge}
          </div>
        )}

        {!imgErr && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="w-[52%] h-[70%] transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.20))' }}
          >
            <ProductMock
              shape={product.shape}
              color={product.color}
              textColor={product.textColor}
              accentColor={product.accentColor}
              sub={product.sub}
              label="oriva"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <h3 className="font-display font-semibold text-ink-900 text-base leading-snug">{product.name}</h3>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-ink-900 text-sm">${product.price}.00</span>
            {product.comparePrice && (
              <span className="text-ink-700/45 line-through text-sm">${product.comparePrice}.00</span>
            )}
          </div>
          <span className="text-xs text-ink-700/50">{product.size}</span>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURE TILES  clean icon cards matching brand ──────────────────────────
const FEATURE_TILES = [
  {
    label: 'Clean Formulas',
    body: 'No unnecessary ingredients. Just what your skin actually needs.',
    bg: '#EDE8F5',
    iconBg: '#9AAAE0',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Droplet / leaf icon */}
        <path
          d="M14 4 C14 4 6 13 6 18 C6 22.4 9.6 26 14 26 C18.4 26 22 22.4 22 18 C22 13 14 4 14 4Z"
          fill="white" fillOpacity="0.95"
        />
        <path
          d="M14 13 C14 13 10 17.5 10 19.5 C10 21.7 11.8 23.5 14 23.5"
          stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" fill="none"
        />
      </svg>
    ),
  },
  {
    label: 'Real Results',
    body: 'Backed by proven actives that deliver visible improvement.',
    bg: '#E0EDE8',
    iconBg: '#1F4F3D',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Sparkle / glow icon */}
        <path d="M14 5 L15.2 11.8 L22 13 L15.2 14.2 L14 21 L12.8 14.2 L6 13 L12.8 11.8 Z"
          fill="white" fillOpacity="0.95" />
        <circle cx="21" cy="7" r="1.5" fill="white" fillOpacity="0.7" />
        <circle cx="7" cy="21" r="1" fill="white" fillOpacity="0.5" />
      </svg>
    ),
  },
];

function FeatureTile({ tile }) {
  return (
    <div
      className="rounded-2xl px-4 py-5 flex flex-col gap-4"
      style={{ background: tile.bg, minHeight: 170 }}
    >
      {/* Icon disc */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: tile.iconBg }}
      >
        {tile.icon}
      </div>
      {/* Text */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-900/60 mb-1.5">
          {tile.label}
        </div>
        <p className="text-[12px] text-ink-800 leading-snug">{tile.body}</p>
      </div>
    </div>
  );
}

// ─── MISSION SECTION  full-bleed periwinkle card, text top + soap photo bottom ─
function MissionSection() {
  const [imgErr, setImgErr] = useState(false);

  return (
    <section
      className="relative overflow-hidden mx-4 rounded-3xl"
      style={{ background: '#95B3DB' }}
    >
      {/* Text — top portion */}
      <div className="px-6 pt-8 pb-0 relative z-10">
        <h2
          className="font-display text-ink-900 leading-[0.93] tracking-tightest mb-4"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)' }}
        >
          Skincare That<br />
          Makes <span className="font-extrabold">Sense</span>
        </h2>
        <p className="text-ink-800/75 text-sm leading-relaxed mb-2">
          At ORIVA, we believe skincare shouldn't be complicated. Our mission is to create effective,
          minimal, and reliable products that support your skin — not overwhelm it.
        </p>
        <p className="text-ink-800/75 text-sm leading-relaxed">
          We focus on essential ingredients, clean formulations, and results you can actually see.
        </p>
      </div>

      {/* Soap photo — seamlessly fills the bottom, matching bg */}
      <div className="relative mt-4">
        {!imgErr ? (
          <img
            src="/images/mission-soap.jpg"
            alt="ORIVA soap"
            onError={() => setImgErr(true)}
            className="w-full block"
            style={{ height: 300, objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        ) : (
          /* Fallback SVG soap */
          <svg viewBox="0 0 260 180" className="w-[80%] max-w-[280px] mb-4" style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.20))' }}>
            <defs>
              <linearGradient id="sb-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C2D9C0"/><stop offset="1" stopColor="#93B896"/></linearGradient>
              <linearGradient id="sb-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7AA87A"/><stop offset="1" stopColor="#5A885A"/></linearGradient>
            </defs>
            <ellipse cx="130" cy="162" rx="90" ry="8" fill="rgba(0,0,0,0.18)" />
            <path d="M30 86 L30 130 Q30 138 42 142 L218 142 Q230 142 230 130 L230 86 Z" fill="url(#sb-side)" />
            <path d="M16 52 L130 28 L244 52 L230 86 Q230 94 218 98 L42 98 Q30 94 30 86 Z" fill="url(#sb-top)" />
            <path d="M55 58 L130 40 L205 58 L198 74 L130 56 L62 74 Z" fill="rgba(255,255,255,0.16)" />
            <g transform="translate(155,70)"><circle r="18" fill="rgba(31,79,61,0.22)"/><line x1="-9" y1="-13" x2="9" y2="13" stroke="rgba(31,79,61,0.5)" strokeWidth="2.5" strokeLinecap="round"/><line x1="-2" y1="-16" x2="16" y2="9" stroke="rgba(31,79,61,0.28)" strokeWidth="2" strokeLinecap="round"/><line x1="-16" y1="-7" x2="2" y2="16" stroke="rgba(31,79,61,0.28)" strokeWidth="2" strokeLinecap="round"/></g>
          </svg>
        )}
      </div>
    </section>
  );
}

// ─── REWARDS BANNER ──────────────────────────────────────────────────────────
function RewardsBanner({ onClaim }) {
  return (
    <section className="px-4 max-w-screen-xl mx-auto">
      <div
        className="rounded-3xl px-6 py-8 relative overflow-hidden"
        style={{ background: '#0E1410', color: '#F5EBDD' }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20 blur-3xl" style={{ background: '#7B8DD4' }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-15 blur-3xl" style={{ background: '#E8568C' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-50 mb-2">ORIVA Rewards</p>
          <h2
            className="font-display text-cream-100 leading-[0.94] tracking-tightest mb-3"
            style={{ fontSize: 'clamp(1.3rem, 5vw, 1.85rem)' }}
          >
            Earn points for every<br />
            <span className="font-extrabold">purchase you've already made.</span>
          </h2>
          <p className="text-cream-100/60 text-xs leading-relaxed mb-5 max-w-xs">
            Connect your inbox once. We'll find purchases at Sephora, Ulta, Amazon and beyond —
            and credit you the points you missed.
          </p>
          <button
            onClick={onClaim}
            className="bg-cream-100 text-ink-900 font-display font-semibold text-sm px-6 py-3 rounded-pill hover:bg-white transition active:scale-[0.97]"
          >
            Claim my rewards →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── STOREFRONT ROOT ──────────────────────────────────────────────────────────
export function StoreFront() {
  const { openFlow, cartCount, earnedPoints } = useApp();
  const navigate = useNavigate();
  const totalPoints = DEMO_BRAND.existingMemberPoints + earnedPoints;

  function scrollToShop() {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-cream-100">

      {/* 1. Nav pill — above hero */}
      <Nav onCart={() => navigate('/checkout')} cartCount={cartCount} totalPoints={totalPoints} />

      {/* 2. Hero — full-bleed real photo */}
      <Hero onShop={scrollToShop} />

      {/* 3. Daily Essentials — horizontal scroll, one card at a time on mobile */}
      <section id="shop" className="pt-7 pb-5">
        <div className="px-4 max-w-screen-xl mx-auto flex items-baseline justify-between mb-4">
          <h2
            className="font-display text-ink-900 tracking-tightest"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)' }}
          >
            Your <span className="font-extrabold">Daily</span> Essentials
          </h2>
        </div>

        {/* Horizontal scroll — one card ~90% wide, peek at next */}
        <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-4 pr-4 pb-1">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex-none w-[82vw] max-w-[340px] snap-center">
              <ProductCard
                product={p}
                onClick={() => navigate(`/product/${p.id}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Feature tiles — icon cards */}
      <section className="pb-5 px-4 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURE_TILES.map((tile, i) => <FeatureTile key={i} tile={tile} />)}
        </div>
      </section>

      {/* 5. Mission card */}
      <section className="pb-5 px-0"><MissionSection /></section>

      {/* 6. Rewards banner */}
      <section className="pb-8"><RewardsBanner onClaim={openFlow} /></section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
