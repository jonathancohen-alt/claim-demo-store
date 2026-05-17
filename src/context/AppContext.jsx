import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useResults } from '../hooks/useResults';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const auth = useAuth();
  const results = useResults();

  // Modal / flow state
  const [flowOpen, setFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0–4 (5 steps)
  const [flowDirection, setFlowDirection] = useState('forward'); // 'forward' | 'back'

  // Post-flow: show loyalty dashboard instead of store
  const [showDashboard, setShowDashboard] = useState(false);

  // Points earned from the scan — persists even after going back to shop
  const [earnedPoints, setEarnedPoints] = useState(0);

  // ── Touchpoint visibility toggles ─────────────────────────────────────────
  const [showTopBanner,     setShowTopBanner]     = useState(true);
  const [showBottomBanner,  setShowBottomBanner]  = useState(true);
  const [showProductBanner, setShowProductBanner] = useState(true);
  const [showRewardsBanner, setShowRewardsBanner] = useState(true);

  // ── Popup auto-trigger ────────────────────────────────────────────────────
  const [popupAutoEnabled, setPopupAutoEnabled] = useState(false);
  const [popupAutoDelay,   setPopupAutoDelay]   = useState(8); // seconds

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Demo controls
  const [debugMode, setDebugMode] = useState(false);

  // Open the modal and reset to step 0
  const openFlow = useCallback(() => {
    setCurrentStep(0);
    setFlowDirection('forward');
    setFlowOpen(true);
  }, []);

  // Close the modal
  const closeFlow = useCallback(() => {
    setFlowOpen(false);
  }, []);

  // Advance to next step
  const nextStep = useCallback(() => {
    setFlowDirection('forward');
    setCurrentStep((s) => Math.min(s + 1, 4));
  }, []);

  // Go back one step
  const prevStep = useCallback(() => {
    setFlowDirection('back');
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  // Go to a specific step
  const goToStep = useCallback((n) => {
    setFlowDirection(n > currentStep ? 'forward' : 'back');
    setCurrentStep(n);
  }, [currentStep]);

  // Complete the flow — close modal, show loyalty dashboard, bank 5300 demo pts
  const completeFlow = useCallback(() => {
    setFlowOpen(false);
    setShowDashboard(true);
    setEarnedPoints(5300);
  }, []);

  // Go back to store without losing earned points
  const backToShop = useCallback(() => {
    setShowDashboard(false);
  }, []);

  // Jump directly to rewards page (without full flow)
  const goToRewards = useCallback(() => {
    setShowDashboard(true);
  }, []);

  const resetDemo = useCallback(() => {
    results.clearResults();
    setFlowOpen(false);
    setCurrentStep(0);
    setShowDashboard(false);
    setEarnedPoints(0);
    setDebugMode(false);
    setPopupAutoEnabled(false);
  }, [results]);

  return (
    <AppContext.Provider
      value={{
        // Auth (spread from useAuth)
        ...auth,

        // Results (spread from useResults)
        ...results,

        // Flow / modal state
        flowOpen,
        currentStep,
        flowDirection,
        showDashboard,
        earnedPoints,
        openFlow,
        closeFlow,
        nextStep,
        prevStep,
        goToStep,
        completeFlow,
        backToShop,
        goToRewards,

        // Touchpoint toggles
        showTopBanner,     setShowTopBanner,
        showBottomBanner,  setShowBottomBanner,
        showProductBanner, setShowProductBanner,
        showRewardsBanner, setShowRewardsBanner,

        // Popup auto-trigger
        popupAutoEnabled, setPopupAutoEnabled,
        popupAutoDelay,   setPopupAutoDelay,

        // Cart
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,

        // Demo
        debugMode,
        setDebugMode,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
