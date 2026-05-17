import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrivaLogoWhite } from '../components/brand/Logo';
import { ProductMock } from '../components/brand/ProductMock';
import { Footer } from '../components/brand/Footer';

// ── Nav — dark pill matching storefront ──────────────────────────────────────
function Nav({ onBack }) {
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
        <span className="text-sm font-medium text-cream-100/70">Checkout</span>
        <div className="w-20" />
      </div>
    </nav>
  );
}

// ── Payment logos ────────────────────────────────────────────────────────────
function ShopPayBtn() {
  return (
    <button className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-sm transition active:scale-[0.98]"
      style={{ background: '#5A31F4' }}>
      <svg viewBox="0 0 40 16" className="h-4 w-auto fill-white">
        <text x="0" y="13" fontSize="13" fontWeight="800" fontFamily="system-ui">shop</text>
      </svg>
      <span className="font-semibold text-sm">Pay</span>
    </button>
  );
}

function GooglePayBtn() {
  return (
    <button className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-1.5 border-2 border-ink-900/10 bg-white transition hover:border-ink-900/20 active:scale-[0.98]">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M12 12v3.9h5.4c-.22 1.4-1.6 4.1-5.4 4.1-3.24 0-5.88-2.68-5.88-6S8.76 8 12 8c1.85 0 3.08.78 3.79 1.46L18.6 6.7C16.9 5.08 14.66 4 12 4 6.48 4 2 8.48 2 14s4.48 10 10 10c5.76 0 9.58-4.04 9.58-9.74 0-.66-.07-1.16-.16-1.66H12z" fill="#4285F4"/>
      </svg>
      <span className="font-semibold text-sm text-ink-900" style={{ fontFamily: 'system-ui' }}>Pay</span>
    </button>
  );
}

function PayPalBtn() {
  return (
    <button className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-1 border-0 transition active:scale-[0.98]"
      style={{ background: '#FFC439' }}>
      <span className="font-bold text-sm" style={{ color: '#003087' }}>Pay</span>
      <span className="font-bold text-sm" style={{ color: '#009CDE' }}>Pal</span>
    </button>
  );
}

// ── Cart item row ────────────────────────────────────────────────────────────
function CartRow({ item }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0">
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: item.bg }}
        >
          {!imgErr && item.image ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-[60%] h-[80%]">
              <ProductMock
                shape={item.shape}
                color={item.color}
                textColor={item.textColor}
                accentColor={item.accentColor}
                label="oriva"
              />
            </div>
          )}
        </div>
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink-900 text-cream-100 text-[10px] font-bold flex items-center justify-center">
          {item.qty}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-ink-900 text-sm">{item.name}</div>
        <div className="text-xs text-ink-700/55 mt-0.5 line-clamp-2">{item.description}</div>
      </div>
      <div className="font-display font-semibold text-ink-900 text-sm flex-shrink-0">
        ${(item.price * item.qty).toFixed(2)}
      </div>
    </div>
  );
}

// ── Confirmed nav ─────────────────────────────────────────────────────────────
function ConfirmedNav({ onShop }) {
  return (
    <nav className="sticky top-0 z-30 px-3 pt-3 pb-1">
      <div
        className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-pill"
        style={{ background: '#0E1410' }}
      >
        <OrivaLogoWhite height={20} />
        <button
          onClick={onShop}
          className="text-cream-100/60 text-sm font-medium hover:text-cream-100 transition"
        >
          Continue shopping →
        </button>
      </div>
    </nav>
  );
}

// ── Confirmed ────────────────────────────────────────────────────────────────
function OrderConfirmed({ onShop }) {
  const { cartItems, cartTotal, openFlow } = useApp();

  const [orderNum] = useState(
    () => `OV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  const deliveryStart = new Date();
  deliveryStart.setDate(deliveryStart.getDate() + 5);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 7);
  const deliveryRange = `${deliveryStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${deliveryEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="min-h-screen bg-cream-100">
      <ConfirmedNav onShop={onShop} />

      <div className="max-w-screen-sm mx-auto px-4 pt-8 pb-16 space-y-4">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center pt-4 pb-4"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-forest-800 flex items-center justify-center mx-auto mb-5"
          >
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <path d="M4 11l5 5 9-9" stroke="#F5EBDD" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <h1 className="font-display font-bold text-ink-900 text-3xl tracking-tightest mb-2">Order confirmed!</h1>
          <p className="text-ink-700/60 text-sm">Your ORIVA order is on its way. Check your inbox for confirmation.</p>
          <p className="text-xs text-ink-700/30 mt-2 font-mono tracking-wide">{orderNum}</p>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl px-5 py-5 border border-ink-900/8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-ink-900 text-sm">Order summary</span>
            <span className="text-xs text-ink-700/40 font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {cartItems.length > 0 ? (
              cartItems.map(item => <CartRow key={item.id} item={item} />)
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-ink-900 text-sm">ORIVA Order</div>
                  <div className="text-xs text-ink-700/50 mt-0.5">Qty 1</div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-ink-900/6" />

          <div className="space-y-2 text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink-900">
                {cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-700/60">Shipping</span>
              <span className="text-forest-700 font-semibold text-xs">Free</span>
            </div>
            <div className="flex justify-between font-display font-bold text-ink-900 pt-1 border-t border-ink-900/6">
              <span>Total</span>
              <span>{cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : '—'}</span>
            </div>
          </div>

          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: 'rgba(31,79,61,0.06)', border: '1px solid rgba(31,79,61,0.10)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F4F3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <div className="text-xs font-semibold text-ink-900">Estimated delivery</div>
              <div className="text-xs text-ink-700/55 mt-0.5">{deliveryRange} · Standard shipping</div>
            </div>
          </div>
        </motion.div>

        {/* Claim banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
              Points for this order:<br />
              <span className="font-extrabold">confirmed. Find more.</span>
            </h2>
            <p className="text-cream-100/60 text-xs leading-relaxed mb-5 max-w-xs">
              Buying ORIVA on Amazon too? Connect your inbox and we'll find those receipts too.
            </p>
            <button
              onClick={openFlow}
              className="bg-cream-100 text-ink-900 font-display font-semibold text-sm px-6 py-3 rounded-pill hover:bg-white transition active:scale-[0.97]"
            >
              Claim my rewards →
            </button>
          </div>
        </motion.div>

        {/* Back to shop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <button
            onClick={onShop}
            className="w-full font-display font-semibold text-sm rounded-pill border-2 border-ink-900/15 text-ink-900 py-3.5 transition hover:border-ink-900/30"
          >
            Back to shop
          </button>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, openFlow } = useApp();
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return <OrderConfirmed onShop={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Nav onBack={() => navigate(-1)} />

      <div className="max-w-screen-sm mx-auto px-4 pt-5 pb-16 space-y-3">

        {/* Cart items */}
        {cartItems.length > 0 ? (
          <div className="bg-white rounded-3xl px-5 py-5 space-y-5 border border-ink-900/8">
            {cartItems.map((item) => <CartRow key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="bg-white rounded-3xl px-5 py-10 text-center text-ink-700/55 text-sm border border-ink-900/8">
            Your cart is empty.{' '}
            <button onClick={() => navigate('/')} className="underline text-ink-900 font-semibold">Shop now</button>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-3xl px-5 py-4 border border-ink-900/8">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setSummaryOpen(o => !o)}
          >
            <span className="font-display font-bold text-ink-900 text-sm">Order summary</span>
            <span className="text-periwinkle-600 font-semibold text-xs flex items-center gap-1">
              {summaryOpen ? 'Hide' : 'Show'} {summaryOpen ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                key="summary"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2 text-sm text-ink-700">
                  <div className="flex justify-between">
                    <span>Subtotal · {cartItems.reduce((s, i) => s + i.qty, 0)} item{cartItems.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}</span>
                    <span className="font-semibold text-ink-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-ink-700/60">
                    <span>Shipping</span>
                    <span>Enter shipping address</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div className="bg-white rounded-3xl px-5 py-4 border border-ink-900/8">
          <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-700/55 block mb-3">Contact</label>
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-cream-100 rounded-pill px-4 py-3.5 text-ink-900 text-sm placeholder:text-ink-700/45 outline-none focus:ring-2 focus:ring-forest-800/25 transition"
          />
        </div>

        {/* Pay now */}
        <div className="bg-white rounded-3xl px-5 py-5 space-y-3 border border-ink-900/8">
          <button
            onClick={() => setConfirmed(true)}
            className="w-full font-display font-semibold text-sm rounded-2xl bg-ink-900 text-cream-100 py-4 transition-all active:scale-[0.97] hover:bg-forest-800"
          >
            Pay now
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-ink-900/10" />
            <span className="text-xs text-ink-700/50 font-medium">Express checkout</span>
            <div className="flex-1 h-px bg-ink-900/10" />
          </div>

          {/* Shop Pay */}
          <ShopPayBtn />

          {/* Google + PayPal */}
          <div className="flex gap-2">
            <GooglePayBtn />
            <PayPalBtn />
          </div>
        </div>

        {/* Rewards nudge */}
        <button
          onClick={openFlow}
          className="w-full text-center text-xs text-ink-700/50 py-2 hover:text-ink-700 transition"
        >
          🌿 Earn ORIVA Rewards on this purchase →
        </button>
      </div>

      <Footer />
    </div>
  );
}
