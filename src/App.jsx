import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { FlowModal } from './components/FlowModal';
import { DemoControls } from './components/DemoControls';
import { DebugDrawer } from './components/DebugDrawer';
import { LoyaltyDashboard } from './components/LoyaltyDashboard';
import { TopBanner } from './components/TopBanner';
import { StoreFront } from './modules/StoreFront';
import { MerchantView } from './modules/MerchantView';
import { ProductDetail } from './modules/ProductDetail';
import { Checkout } from './modules/Checkout';
import { OAuthCallback } from './modules/OAuthCallback';

// ── Popup auto-trigger — runs on any shopper page ─────────────────────────────
function PopupAutoTrigger() {
  const { popupAutoEnabled, popupAutoDelay, flowOpen, openFlow } = useApp();
  const timerRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!popupAutoEnabled) {
      clearTimeout(timerRef.current);
      firedRef.current = false;
      return;
    }
    if (firedRef.current || flowOpen) return;
    timerRef.current = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        openFlow();
      }
    }, popupAutoDelay * 1000);
    return () => clearTimeout(timerRef.current);
  }, [popupAutoEnabled, popupAutoDelay, flowOpen, openFlow]);

  // Reset fired state when auto is toggled back on
  useEffect(() => {
    if (!popupAutoEnabled) firedRef.current = false;
  }, [popupAutoEnabled]);

  return null;
}

function MerchantWithDebug() {
  const [debugOpen, setDebugOpen] = useState(false);
  return (
    <div className="relative">
      <MerchantView />
      <DebugDrawer open={debugOpen} onClose={() => setDebugOpen(false)} />
      <DemoControls onOpenDebug={() => setDebugOpen(true)} />
    </div>
  );
}

function ShopperView() {
  const { showDashboard, showTopBanner } = useApp();
  const [debugOpen, setDebugOpen] = useState(false);

  return (
    <div className="relative">
      {showTopBanner && <TopBanner />}
      {showDashboard ? <LoyaltyDashboard /> : <StoreFront />}
      <FlowModal />
      <PopupAutoTrigger />
      <DebugDrawer open={debugOpen} onClose={() => setDebugOpen(false)} />
      <DemoControls onOpenDebug={() => setDebugOpen(true)} />
    </div>
  );
}

function PDPView() {
  const { showTopBanner } = useApp();
  return (
    <div className="relative">
      {showTopBanner && <TopBanner />}
      <ProductDetail />
      <FlowModal />
      <PopupAutoTrigger />
      <DemoControls />
    </div>
  );
}

function CheckoutView() {
  const { showTopBanner } = useApp();
  return (
    <div className="relative">
      {showTopBanner && <TopBanner />}
      <Checkout />
      <FlowModal />
      <DemoControls />
    </div>
  );
}

function AppRoutes() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<ShopperView />} />
        <Route path="/product/:id" element={<PDPView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/merchant" element={<MerchantWithDebug />} />
      </Routes>
    </AppProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
