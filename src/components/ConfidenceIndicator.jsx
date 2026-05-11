export function ConfidenceIndicator({ confidence, showLabel = true }) {
  const pct = Math.round((confidence || 0) * 100);

  const color =
    pct >= 80 ? '#10B981' :
    pct >= 50 ? '#F59E0B' :
    '#EF4444';

  const label =
    pct >= 80 ? 'High' :
    pct >= 50 ? 'Medium' :
    'Low';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {label} ({pct}%)
        </span>
      )}
    </div>
  );
}
