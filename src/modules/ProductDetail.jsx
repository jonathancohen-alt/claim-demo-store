import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ArrowLeft, Star, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../config/products';
import { OrivaLogoWhite } from '../components/brand/Logo';
import { ProductMock } from '../components/brand/ProductMock';
import { Footer } from '../components/brand/Footer';

// ── Nav — dark pill matching storefront ──────────────────────────────────────
function Nav({ onBack, onCart, cartCount }) {
  return (
    <nav className="sticky top-0 z-30 px-3 pt-3 pb-1">
      <div
        className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-pill"
        style={{ background: '#0E1410' }}
      >
        <button onClick={onBack} className="flex items-center gap-2 text-cream-100 hover:opacity-60 transition">
          <ArrowLeft size={16} strokeWidth={2} />
          <OrivaLogoWhite height={20} />
        </button>
        <button
          onClick={onCart}
          aria-label="Cart"
          className="relative w-9 h-9 flex items-center justify-center text-cream-100 hover:opacity-60 transition"
        >
          <ShoppingBag size={19} strokeWidth={1.6} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cream-100 text-ink-900 text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            strokeWidth={0}
            className={s <= Math.round(rating) ? 'fill-ink-900' : 'fill-ink-900/20'}
          />
        ))}
      </div>
      <span className="text-xs text-ink-700/55 font-medium">{rating} · {reviews?.toLocaleString()} reviews</span>
    </div>
  );
}

// ── Inline Claim strip ────────────────────────────────────────────────────────
function ClaimStrip({ onClaim, productName }) {
  return (
    <button
      onClick={onClaim}
      id="capture-product-banner"
    className="w-full relative rounded-2xl px-5 py-4 overflow-hidden flex items-center gap-4 text-left group transition-opacity hover:opacity-90 active:scale-[0.99]"
      style={{ background: '#0E1410' }}
    >
      {/* Blur blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: '#7B8DD4' }} />
      <div className="absolute -bottom-8 -left-6 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: '#E8568C' }} />

      {/* Icon */}
      <div
        className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: 'rgba(245,235,221,0.10)' }}
      >
        🌿
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <div className="font-display font-semibold text-cream-100 text-sm leading-snug">
          Buying this on Amazon or Walmart too?
        </div>
        <div className="text-cream-100/55 text-xs mt-0.5 leading-snug">
          Connect your inbox — you could have points waiting for past orders.
        </div>
      </div>

      {/* CTA pill */}
      <div
        className="relative z-10 flex-shrink-0 text-xs font-semibold px-3.5 py-2 rounded-pill whitespace-nowrap"
        style={{ background: '#F5EBDD', color: '#0E1410' }}
      >
        Earn points →
      </div>
    </button>
  );
}

// ── Related product card ──────────────────────────────────────────────────────
function RelatedCard({ product, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <button onClick={onClick} className="text-left group w-full">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center mb-2.5"
        style={{ background: product.bg }}
      >
        {!imgErr && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-[58%] h-[65%] transition-transform duration-300 group-hover:scale-105"
            style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))' }}>
            <ProductMock
              shape={product.shape}
              color={product.color}
              textColor={product.textColor}
              accentColor={product.accentColor}
              label="oriva"
            />
          </div>
        )}
      </div>
      <div className="text-sm font-display font-semibold text-ink-900 leading-snug">{product.name}</div>
      <div className="text-xs text-ink-700/55 mt-0.5">${product.price}.00</div>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount, openFlow, showProductBanner } = useApp();

  const product = PRODUCTS.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [addedState, setAddedState] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-700 mb-4">Product not found.</p>
          <button onClick={() => navigate('/')} className="underline text-ink-900 font-semibold">Back to shop</button>
        </div>
      </div>
    );
  }

  function handleAdd() {
    addToCart(product, qty);
    setAddedState(true);
    setTimeout(() => setAddedState(false), 1600);
  }

  function handleBuyNow() {
    addToCart(product, qty);
    navigate('/checkout');
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-100">
      <Nav
        onBack={() => navigate('/')}
        onCart={() => navigate('/checkout')}
        cartCount={cartCount}
      />

      {/* ── Main 2-col layout ──────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── LEFT: Image ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:sticky lg:top-24"
          >
            <div
              className="relative rounded-4xl overflow-hidden flex items-center justify-center"
              style={{ background: product.bg, aspectRatio: '1 / 1.1' }}
            >
              {product.badge && (
                <div className="absolute top-5 left-5 z-10 text-[11px] font-semibold px-3 py-1 rounded-pill bg-cream-100 text-ink-900">
                  {product.badge}
                </div>
              )}
              <button
                aria-label="Add to wishlist"
                className="absolute bottom-5 left-5 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-periwinkle-600 shadow-sm hover:bg-white transition"
              >
                <Heart size={16} strokeWidth={1.8} />
              </button>

              {product.image && !imgError ? (
                <motion.img
                  src={product.image}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-[55%] h-[72%] flex items-center justify-center"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.28))' }}
                >
                  <ProductMock
                    shape={product.shape}
                    color={product.color}
                    textColor={product.textColor}
                    accentColor={product.accentColor}
                    sub={product.sub}
                    label="oriva"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Details ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-ink-700/50 uppercase tracking-[0.14em]">{product.category}</span>
              <span className="text-ink-700/25">·</span>
              <span className="text-xs font-medium text-ink-700/50">{product.size}</span>
            </div>

            {/* Name */}
            <div className="-mt-3">
              <h1
                className="font-display font-bold text-ink-900 leading-[0.95] tracking-tightest"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {product.name}
              </h1>
            </div>

            {/* Stars + Price */}
            <div className="flex flex-col gap-2">
              <Stars rating={product.rating} reviews={product.reviews} />
              <div className="flex items-baseline gap-2.5">
                <span className="font-display font-bold text-2xl text-ink-900">${product.price}.00</span>
                {product.comparePrice && (
                  <span className="text-ink-700/40 line-through text-sm">${product.comparePrice}.00</span>
                )}
              </div>
            </div>

            {/* Short description */}
            {product.sub && (
              <p className="text-sm text-ink-700/70 leading-relaxed -mt-2">
                {product.sub}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-ink-900/8" />

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 border-2 border-ink-900/12 rounded-pill px-4 py-3 bg-white flex-shrink-0">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-ink-900 hover:opacity-50 transition">
                  <Minus size={13} strokeWidth={2.2} />
                </button>
                <span className="font-semibold text-ink-900 text-sm w-3 text-center tabular-nums">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="text-ink-900 hover:opacity-50 transition">
                  <Plus size={13} strokeWidth={2.2} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 font-display font-semibold text-sm rounded-pill py-3.5 transition-all active:scale-[0.97]"
                style={{
                  background: addedState ? '#1F4F3D' : '#0E1410',
                  color: '#F5EBDD',
                }}
              >
                {addedState ? 'Added ✓' : 'Add to Cart'}
              </button>
            </div>

            {/* Buy now */}
            <button
              onClick={handleBuyNow}
              className="w-full font-display font-semibold text-sm rounded-pill py-3.5 -mt-3 border-2 border-ink-900/15 text-ink-900 bg-white hover:border-ink-900/30 transition active:scale-[0.97]"
            >
              Buy now
            </button>

            {/* ── Claim strip ──────────────────────────────────────── */}
            {showProductBanner && (
              <ClaimStrip onClaim={openFlow} productName={product.name} />
            )}

            {/* Divider */}
            <div className="border-t border-ink-900/8" />

            {/* Description */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-700/50 block mb-3">Description</span>
              <p className="text-ink-700 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="border-t border-ink-900/8 pt-5">
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-700/50 block mb-3">Key Ingredients</span>
                <p className="text-ink-700 text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── You may also like — full width ─────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-ink-900/8">
          <div className="max-w-screen-xl mx-auto px-6 py-10">
            <h2
              className="font-display text-ink-900 tracking-tightest mb-6"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)' }}
            >
              You may also <span className="font-extrabold">like</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
