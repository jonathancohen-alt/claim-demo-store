import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Bell, Calendar, TrendingUp, Package, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RETAILER_CONFIG, BRAND_CATALOG } from '../config/constants';
import { RetailerBadge } from '../components/RetailerBadge';
import { PointsCounter } from '../components/PointsCounter';

function formatDate(isoString) {
  if (!isoString) return 'Never';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Monitor() {
  const navigate = useNavigate();
  const { scanDate, stats, hasStoredResults, allMatchedItems, matchedReceipts } = useApp();

  const topBrands = Object.entries(
    allMatchedItems.reduce((acc, item) => {
      if (!acc[item.brandKey]) acc[item.brandKey] = { points: 0, count: 0 };
      acc[item.brandKey].points += item.points || 0;
      acc[item.brandKey].count += 1;
      return acc;
    }, {})
  )
    .map(([key, val]) => ({ key, ...val, brand: BRAND_CATALOG[key] }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const topRetailers = Object.entries(
    allMatchedItems.reduce((acc, item) => {
      const r = item.retailer || 'unknown';
      if (!acc[r]) acc[r] = { spend: 0, count: 0 };
      acc[r].spend += item.price || 0;
      acc[r].count += 1;
      return acc;
    }, {})
  )
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Simulated notification email
  const notificationEmail = generateNotificationEmail(stats, topBrands);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your ongoing rewards activity</p>
        </div>
        <button
          onClick={() => navigate('/scan')}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          <RefreshCw size={14} />
          New Scan
        </button>
      </div>

      {/* Last scan summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">Last scan: </span>
          <span className="text-sm font-medium text-gray-900">{formatDate(scanDate)}</span>
          {scanDate && (
            <span className="ml-auto">
              <CheckCircle size={14} className="text-emerald-500" />
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Emails Scanned', value: stats.emailsFound, icon: '📬', color: '#3B82F6' },
            { label: 'Receipts Found', value: stats.receiptsIdentified, icon: '🧾', color: '#F97316' },
            { label: 'Brands Matched', value: stats.brandsMatched, icon: '🏷️', color: '#8B5CF6' },
            { label: 'Points Earned', value: stats.totalPoints, icon: '⭐', color: '#10B981' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {!hasStoredResults && (
          <div className="mt-4 bg-amber-50 rounded-xl p-4 text-center text-sm text-amber-700">
            No scan data yet. <button onClick={() => navigate('/scan')} className="underline font-medium">Run your first scan →</button>
          </div>
        )}
      </motion.div>

      {/* Top brands */}
      {topBrands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#F97316]" />
            <h2 className="font-semibold text-gray-900">Top Earning Brands</h2>
          </div>
          <div className="space-y-2">
            {topBrands.map((b, i) => (
              <div key={b.key} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-4 text-right">{i + 1}</span>
                <span className="text-xl">{b.brand?.emoji || '🏷️'}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{b.brand?.displayName || b.key}</div>
                  <div className="text-xs text-gray-500">{b.count} purchase{b.count !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-sm font-bold text-emerald-600">+{b.points.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top retailers */}
      {topRetailers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#3B82F6]" />
            <h2 className="font-semibold text-gray-900">Purchase Activity by Retailer</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {topRetailers.map(({ key, count, spend }) => (
              <div key={key} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <RetailerBadge retailer={key} size="sm" />
                <span className="text-xs text-gray-500">{count} items</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notification email preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 p-5 border-b border-gray-100">
          <Bell size={16} className="text-[#F97316]" />
          <h2 className="font-semibold text-gray-900">Notification Email Preview</h2>
          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Simulated</span>
        </div>
        <div className="p-5">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-[#1E3A5F] p-4 text-white text-sm">
              <div className="flex justify-between items-center">
                <div className="font-bold">🎁 ToyBox Rewards</div>
                <div className="text-blue-200 text-xs">notifications@toyboxco.com</div>
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="text-sm text-gray-500 mb-1">To: member@email.com</div>
              <div className="font-semibold text-gray-900 mb-4">
                🎉 You earned {stats.totalPoints?.toLocaleString() || 0} new points from your recent purchases!
              </div>
              <div dangerouslySetInnerHTML={{ __html: notificationEmail }} className="text-sm text-gray-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/scan')}
          className="flex-1 bg-[#F97316] hover:bg-orange-500 text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Run Another Scan →
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 bg-[#1E3A5F] hover:bg-[#2a4f82] text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Merchant Dashboard →
        </button>
      </div>
    </div>
  );
}

function generateNotificationEmail(stats, topBrands) {
  if (!stats.totalPoints) {
    return '<p>Your inbox scan is complete. No new purchases found from catalog brands this time.</p>';
  }

  const brandList = topBrands.length > 0
    ? `<ul style="margin: 8px 0; padding-left: 16px;">${topBrands
        .map((b) => `<li><strong>${b.brand?.displayName || b.key}</strong>: +${b.points} points</li>`)
        .join('')}</ul>`
    : '';

  return `
    <p>Great news! We scanned your recent purchases and found <strong>${stats.brandsMatched} brand matches</strong> earning you points:</p>
    ${brandList}
    <p style="margin-top: 12px;">Your total earnings from cross-retailer purchases: <strong style="color: #10B981;">${stats.totalPoints?.toLocaleString()} points</strong></p>
    <p style="margin-top: 8px; font-size: 12px; color: #9CA3AF;">You can view your full purchase history and manage your connected email in your account settings.</p>
  `;
}
