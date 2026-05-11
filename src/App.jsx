import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { FlowModal } from './components/FlowModal';
import { DemoControls } from './components/DemoControls';
import { DebugDrawer } from './components/DebugDrawer';
import { LoyaltyDashboard } from './components/LoyaltyDashboard';
import { StoreFront } from './modules/StoreFront';
import { MerchantView } from './modules/MerchantView';
import { ProductDetail } from './modules/ProductDetail';
import { Checkout } from './modules/Checkout';

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
  const { showDashboard } = useApp();
  const [debugOpen, setDebugOpen] = useState(false);

  return (
    <div className="relative">
      {showDashboard ? <LoyaltyDashboard /> : <StoreFront />}
      <FlowModal />
      <DebugDrawer open={debugOpen} onClose={() => setDebugOpen(false)} />
      <DemoControls onOpenDebug={() => setDebugOpen(true)} />
    </div>
  );
}

function PDPView() {
  return (
    <div className="relative">
      <ProductDetail />
      <FlowModal />
    </div>
  );
}

function CheckoutView() {
  return (
    <div className="relative">
      <Checkout />
      <FlowModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<ShopperView />} />
          <Route path="/product/:id" element={<PDPView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/merchant" element={<MerchantWithDebug />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
