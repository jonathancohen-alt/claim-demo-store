import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Step1Hook } from './steps/Step1Hook';
import { Step2Trust } from './steps/Step2Trust';
import { Step4Scanning } from './steps/Step4Scanning';
import { Step5Results } from './steps/Step5Results';
import { StepRewards } from './steps/StepRewards';

const STEPS = [Step1Hook, Step2Trust, Step4Scanning, Step5Results, StepRewards];

function DotStepper({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i === current ? '#1F4F3D' : i < current ? '#A8C4B0' : '#E5DAC8',
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

const slideVariants = {
  enterForward: { x: '100%', opacity: 0 },
  enterBack:    { x: '-100%', opacity: 0 },
  center:       { x: 0, opacity: 1 },
  exitForward:  { x: '-40%', opacity: 0 },
  exitBack:     { x: '40%', opacity: 0 },
};

export function FlowModal() {
  const { flowOpen, currentStep, flowDirection, prevStep, closeFlow } = useApp();

  useEffect(() => {
    document.body.style.overflow = flowOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [flowOpen]);

  const StepComponent = STEPS[currentStep] ?? STEPS[STEPS.length - 1];

  const isHook    = currentStep === 0;
  const isRewards = currentStep === STEPS.length - 1;

  const showBack    = currentStep === 1;
  const showStepper = currentStep >= 1 && currentStep <= 3;
  const showHeader  = !isRewards && !isHook;

  return (
    <AnimatePresence>
      {flowOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={closeFlow}
          />

          {/* Centered modal — same proportions for all steps */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ padding: '16px' }}
          >
            <div
              className="relative w-full"
              style={{
                maxWidth: 760,
                borderRadius: 24,
                background: '#FFFFFF',
                boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* X close button — inside card, top-right */}
              <button
                onClick={closeFlow}
                className="absolute z-20 flex items-center justify-center rounded-full transition-all active:scale-90"
                style={{
                  top: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  background: 'rgba(255,255,255,0.92)',
                  color: '#1a1a1a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                }}
                aria-label="Close"
              >
                <X size={15} strokeWidth={2.2} />
              </button>

              {/* Header: back button + dot stepper (non-hook, non-rewards) */}
              {showHeader && (
                <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                  <div className="w-9">
                    {showBack && (
                      <button
                        onClick={prevStep}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-90"
                      >
                        <ArrowLeft size={16} className="text-slate-700" />
                      </button>
                    )}
                  </div>
                  {showStepper
                    ? <DotStepper current={currentStep - 1} total={3} />
                    : <div />
                  }
                  <div className="w-9" />
                </div>
              )}

              {/* Step content */}
              {isHook ? (
                /* Hook: PNG fills naturally, no padding, no chrome */
                <div className="overflow-hidden" style={{ borderRadius: 24 }}>
                  <StepComponent />
                </div>
              ) : (
                /* All other steps: height-bounded scrollable area */
                <div style={{ position: 'relative', height: '70vh', maxHeight: 640, overflow: 'hidden' }}>
                  <AnimatePresence mode="wait" custom={flowDirection} initial={false}>
                    <motion.div
                      key={currentStep}
                      custom={flowDirection}
                      variants={slideVariants}
                      initial={flowDirection === 'forward' ? 'enterForward' : 'enterBack'}
                      animate="center"
                      exit={flowDirection === 'forward' ? 'exitForward' : 'exitBack'}
                      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute inset-0 overflow-y-auto"
                      style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 24 }}
                    >
                      <StepComponent />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
