import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function PointsCounter({ value = 0, className = '', size = 'lg', animated = true }) {
  const [displayed, setDisplayed] = useState(animated ? 0 : value);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (!animated) {
      setDisplayed(value);
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const startVal = displayed;
    startValueRef.current = startVal;
    const endVal = value;
    const duration = Math.min(1500, Math.abs(endVal - startVal) * 3 + 400);

    function animate(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayed(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, animated]);

  const sizes = {
    sm: 'text-2xl font-bold',
    md: 'text-4xl font-bold',
    lg: 'text-5xl font-bold',
    xl: 'text-7xl font-bold',
  };

  return (
    <motion.span
      className={`${sizes[size]} tabular-nums ${className}`}
      initial={{ scale: 1 }}
      animate={{ scale: value > 0 ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayed.toLocaleString()}
    </motion.span>
  );
}
