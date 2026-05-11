import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Step1Hook } from './steps/Step1Hook';
import { Step2Trust } from './steps/Step2Trust';
import { Step4Scanning } from './steps/Step4Scanning';
import { Step5Results } from './steps/Step5Results';
import { StepRewards } from './steps/StepRewards';

// Step3OAuth removed — OAuth is now triggered directly from Step2Trust
const STEPS = [Step1Hook, Step2Trust, Step4Scanning, Step5Results, StepRewards];

// Dot stepper — only for the core flow steps (Trust → Scan → Results)
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

// Slide variants
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
  const isRewards = currentStep === STEPS.length - 1; // step 4

  const showBack    = currentStep === 1;
  const showClose   = isHook;
  // Stepper only visible on core steps 1–3 (Trust, Scan, Results)
  const showStepper = currentStep >= 1 && currentStep <= 3;
  // On rewards screen, hide the header entirely for a cleaner full-screen feel
  const showHeader  = !isRewards;

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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={isHook ? closeFlow : undefined}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div
              className="w-full flex flex-col overflow-hidden"
              style={{
                maxWidth: 430,
                borderRadius: '32px 32px 0 0',
                boxShadow: '0 -8px 40px rgba(14,20,16,0.20)',
                height: '92vh',
                maxHeight: 780,
                background: '#F5EBDD',
              }}
            >
              {/* Header row */}
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

                  {/* Dot stepper — centered, only core flow */}
                  {showStepper
                    ? <DotStepper current={currentStep - 1} total={3} />
                    : <div />
                  }

                  <div className="w-9">
                    {showClose && (
                      <button
                        onClick={closeFlow}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-90"
                      >
                        <X size={16} className="text-slate-700" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step content */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence
                  mode="wait"
                  custom={flowDirection}
                  initial={false}
                >
                  <motion.div
                    key={currentStep}
                    custom={flowDirection}
                    variants={slideVariants}
                    initial={flowDirection === 'forward' ? 'enterForward' : 'enterBack'}
                    animate="center"
                    exit={flowDirection === 'forward' ? 'exitForward' : 'exitBack'}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0 px-5 pb-6 overflow-y-auto"
                  >
                    <StepComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
