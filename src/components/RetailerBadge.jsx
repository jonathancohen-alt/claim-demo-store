import { RETAILER_CONFIG } from '../config/constants';

export function RetailerBadge({ retailer, size = 'md', showName = true }) {
  const config = RETAILER_CONFIG[retailer] || {
    displayName: retailer || 'Unknown',
    color: '#64748B',
    bgColor: '#F1F5F9',
    emoji: '🏪',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      <span>{config.emoji}</span>
      {showName && <span>{config.displayName}</span>}
    </span>
  );
}
