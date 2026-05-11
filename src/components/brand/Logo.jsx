// ORIVA logo — uses the real brand asset when available, falls back to SVG mark.

// White version — for dark nav / dark footer
export function OrivaLogoWhite({ height = 22, className = '' }) {
  return (
    <img
      src="/images/logo-white.png"
      alt="ORIVA"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
      className={className}
    />
  );
}

// OrivaMark — kept as SVG fallback / small icon contexts
export function OrivaMark({ size = 28, color = '#1F4F3D', accent = '#F5EBDD' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={color} />
      <path
        d="M9 16 C 9 9, 16 6, 22 8 C 22 8, 21 17, 14 22 C 11 24, 9 21, 9 16 Z"
        fill={accent}
      />
    </svg>
  );
}

// OrivaLogo — text wordmark using Instrument Serif italic (matches brand on product)
export function OrivaLogo({ size = 28, color = '#1F4F3D', textColor, className = '' }) {
  const tc = textColor || color;
  return (
    <span
      className={`oriva-wordmark ${className}`}
      style={{ fontSize: size, color: tc, lineHeight: 1 }}
    >
      oriva
    </span>
  );
}
