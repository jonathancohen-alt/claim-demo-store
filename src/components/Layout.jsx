import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, BarChart3, ChevronRight } from 'lucide-react';
import { DemoControls } from './DemoControls';

const SHOPPER_STEPS = [
  { label: 'Store', path: '/' },
  { label: 'Enroll', path: '/enroll' },
  { label: 'Connect', path: '/connect' },
  { label: 'Scan', path: '/scan' },
  { label: 'Monitor', path: '/monitor' },
];

const MERCHANT_STEP = { label: 'Dashboard', path: '/dashboard' };

export function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';

  const allSteps = [...SHOPPER_STEPS, MERCHANT_STEP];
  const currentIndex = allSteps.findIndex((s) => s.path === location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-[#1E3A5F] text-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl">🎁</span>
            <span className="hidden sm:block">Omnichannel Rewards</span>
          </button>

          {/* Step indicator — middle */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {allSteps.map((step, i) => {
              const isActive = step.path === location.pathname;
              const isPast = i < currentIndex;
              const isDashboardStep = step.path === '/dashboard';
              return (
                <div key={step.path} className="flex items-center gap-1 shrink-0">
                  {i > 0 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
                  <button
                    onClick={() => navigate(step.path)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${
                      isActive
                        ? isDashboardStep
                          ? 'bg-[#1E3A5F] text-white'
                          : 'bg-[#F97316] text-white'
                        : isPast
                        ? 'text-[#F97316] hover:bg-orange-50'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {step.label}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => navigate('/scan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                !isDashboard ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag size={13} />
              <span className="hidden sm:block">Shopper</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isDashboard ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={13} />
              <span className="hidden sm:block">Merchant</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Demo controls */}
      <DemoControls />
    </div>
  );
}
