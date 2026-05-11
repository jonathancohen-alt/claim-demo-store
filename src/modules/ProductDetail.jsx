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
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={15}
          strokeWidth={0}
          className={s <= Math.round(rating) ? 'fill-ink-900' : 'fill-ink-900/20'}
        />
      ))}
    </div>
  );
}

// ── Related product thumbnail ────────────────────────────────────────────────
function RelatedCard({ product, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <button onClick={onClick} className="text-left group w-full">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center mb-2"
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
      <div className="text-xs font-display font-semibold text-ink-900 leading-snug">{product.name}</div>
      <div className="text-xs text-ink-700/55 mt-0.5">${product.price}.00</div>
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount, openFlow } = useApp();

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

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream-100">
      <Nav
        onBack={() => navigate('/')}
        onCart={() => navigate('/checkout')}
        cartCount={cartCount}
      />

      <div className="max-w-screen-sm mx-auto">

        {/* ── Product image block ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            background: product.bg,
            aspectRatio: '1 / 1.05',
            borderRadius: '0 0 20px 20px',
          }}
        >
          {/* Wishlist heart — bottom left, matches reference */}
          <button
            aria-label="Add to wishlist"
            className="absolute bottom-4 left-4 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-periwinkle-600 shadow-sm hover:bg-white transition"
          >
            <Heart size={16} strokeWidth={1.8} />
          </button>

          {product.badge && (
            <div className="absolute top-4 left-4 text-[11px] font-semibold px-2.5 py-1 rounded-pill bg-cream-100 text-ink-900">
              {product.badge}
            </div>
          )}

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
              className="w-[60%] h-[75%] flex items-center justify-center"
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
        </motion.div>

        {/* ── Product info ─────────────────────────────────────────── */}
        <div className="px-4 pt-5">
          <span className="text-xs text-ink-700/55 font-medium">{product.size}</span>
          <h1
            className="font-display font-bold text-ink-900 leading-tight tracking-tightest mt-1"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)' }}
          >
            {product.name}
          </h1>

          {/* Price + stars row */}
          <div className="flex items-center justify-between mt-3 mb-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display font-semibold text-xl text-ink-900">
                ${product.price}.00
              </span>
              {product.comparePrice && (
                <span className="text-ink-700/45 line-through text-sm">${product.comparePrice}.00</span>
              )}
            </div>
            <Stars rating={product.rating} />
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-3 mb-3">
            {/* Qty stepper */}
            <div className="flex items-center gap-3 border-2 border-ink-900/12 rounded-pill px-4 py-3 bg-white">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-ink-900 hover:opacity-50 transition">
                <Minus size={13} strokeWidth={2.2} />
              </button>
              <span className="font-semibold text-ink-900 text-sm w-3 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="text-ink-900 hover:opacity-50 transition">
                <Plus size={13} strokeWidth={2.2} />
              </button>
            </div>

            {/* Add to Cart */}
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
            className="w-full font-display font-semibold text-sm rounded-pill py-3.5 mb-2 border-2 border-ink-900/15 text-ink-900 bg-white hover:border-ink-900/30 transition active:scale-[0.97]"
          >
            Buy now
          </button>

          {/* Rewards nudge */}
          <button
            onClick={openFlow}
            className="w-full text-center text-xs text-ink-700/55 py-2 hover:text-ink-700 transition mb-2"
          >
            🌿 Earn ORIVA Rewards on this purchase →
          </button>
        </div>

        {/* ── Description ─────────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-5 border-t border-ink-900/8 mt-2">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-700/55">Description</span>
          <p className="mt-3 text-ink-700 text-sm leading-relaxed">{product.description}</p>

          {product.ingredients && (
            <div className="mt-5 pt-5 border-t border-ink-900/8">
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-700/55">Key Ingredients</span>
              <p className="mt-2 text-ink-700 text-sm">{product.ingredients}</p>
            </div>
          )}
        </div>

        {/* ── You may also like ────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="px-4 pt-4 pb-8 border-t border-ink-900/8">
            <h2 className="font-display font-bold text-ink-900 tracking-tightest mb-4" style={{ fontSize: '1.1rem' }}>
              You may also like
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {related.map((p) => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
