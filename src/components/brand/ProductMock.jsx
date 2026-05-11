// SVG product mocks rendered in CSS — used in place of photography.
// All accept { color, label, sub } props and render with a soft drop shadow.

function Wordmark({ x, y, size = 14, color = '#fff', children, rotate = 0 }) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontFamily="'Instrument Serif', Georgia, serif"
      fontStyle="italic"
      fontWeight="400"
      letterSpacing="0.01em"
      textAnchor="middle"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    >
      {children}
    </text>
  );
}

// Squeeze tube — used for cleansers, gels, serums
export function Tube({ color = '#D9532D', label = 'oriva', textColor = '#fff', sub, capColor = '#F5EBDD' }) {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`tube-shade-${color}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        <filter id="tube-shadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.18" />
        </filter>
      </defs>
      <g filter="url(#tube-shadow)">
        {/* Crimped top */}
        <path d="M48 36 L152 36 L152 50 L48 50 Z" fill={color} opacity="0.85" />
        <path
          d="M48 36 L152 36 L152 42 L48 42 Z"
          fill="rgba(0,0,0,0.18)"
        />
        {/* Body */}
        <path
          d="M48 50 Q44 60 44 90 L44 230 Q44 252 70 252 L130 252 Q156 252 156 230 L156 90 Q156 60 152 50 Z"
          fill={color}
        />
        {/* Glossy sheen */}
        <path
          d="M48 50 Q44 60 44 90 L44 230 Q44 252 70 252 L130 252 Q156 252 156 230 L156 90 Q156 60 152 50 Z"
          fill={`url(#tube-shade-${color})`}
        />
        {/* Cap */}
        <rect x="68" y="252" width="64" height="14" rx="3" fill={capColor} />
        <rect x="68" y="262" width="64" height="4" rx="2" fill="rgba(0,0,0,0.15)" />

        {/* Wordmark */}
        <Wordmark x={100} y={150} size={26} color={textColor}>{label}</Wordmark>
        {sub && (
          <text
            x="100" y="172" textAnchor="middle"
            fill={textColor} opacity="0.85"
            fontSize="8" fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500" letterSpacing="0.08em"
          >
            {sub.toUpperCase()}
          </text>
        )}
      </g>
    </svg>
  );
}

// Pump bottle — used for serums / lotions
export function PumpBottle({ color = '#F5EBDD', label = 'oriva', textColor = '#1F4F3D', sub, accentColor = '#A8C4B0' }) {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`pump-shade-${color}-${accentColor}`} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="0.6" stopColor="rgba(255,255,255,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>
        <filter id="pump-shadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.18" />
        </filter>
      </defs>
      <g filter="url(#pump-shadow)">
        {/* Pump head */}
        <rect x="86" y="20" width="36" height="16" rx="3" fill="#FAFAF6" />
        <rect x="80" y="34" width="48" height="10" rx="2" fill="#E8E8DE" />
        {/* Collar */}
        <rect x="68" y="44" width="64" height="28" rx="4" fill={accentColor} />
        <rect x="68" y="44" width="64" height="6" fill="rgba(255,255,255,0.25)" />
        {/* Body */}
        <rect x="44" y="72" width="112" height="180" rx="14" fill={color} />
        <rect x="44" y="72" width="112" height="180" rx="14" fill={`url(#pump-shade-${color}-${accentColor})`} />

        {/* Wordmark */}
        <Wordmark x={100} y={170} size={24} color={textColor}>{label}</Wordmark>
        {sub && (
          <text
            x="100" y="192" textAnchor="middle"
            fill={textColor} opacity="0.7"
            fontSize="7" fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500" letterSpacing="0.08em"
          >
            {sub.toUpperCase()}
          </text>
        )}
      </g>
    </svg>
  );
}

// Wide jar — used for creams
export function Jar({ color = '#E8A98C', label = 'oriva', textColor = '#7A2E1A', sub }) {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`jar-shade-${color}`} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="0.6" stopColor="rgba(255,255,255,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
        <filter id="jar-shadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.18" />
        </filter>
      </defs>
      <g filter="url(#jar-shadow)">
        {/* Lid */}
        <rect x="28" y="70" width="144" height="60" rx="10" fill={color} />
        <rect x="28" y="70" width="144" height="14" rx="6" fill="rgba(255,255,255,0.18)" />
        <rect x="28" y="124" width="144" height="6" rx="2" fill="rgba(0,0,0,0.18)" />
        {/* Base */}
        <rect x="36" y="130" width="128" height="120" rx="8" fill={color} opacity="0.88" />
        <rect x="36" y="130" width="128" height="120" rx="8" fill={`url(#jar-shade-${color})`} />

        {/* Wordmark on lid */}
        <Wordmark x={100} y={108} size={26} color={textColor}>{label}</Wordmark>
        {sub && (
          <text
            x="100" y="200" textAnchor="middle"
            fill={textColor} opacity="0.7"
            fontSize="7" fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500" letterSpacing="0.08em"
          >
            {sub.toUpperCase()}
          </text>
        )}
      </g>
    </svg>
  );
}

// Generic dispatcher
export function ProductMock({ shape, ...rest }) {
  if (shape === 'jar') return <Jar {...rest} />;
  if (shape === 'pump') return <PumpBottle {...rest} />;
  return <Tube {...rest} />;
}
