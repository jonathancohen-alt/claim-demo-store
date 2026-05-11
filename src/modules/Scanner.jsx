import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Mail, Cpu, Tag, CheckCircle, AlertCircle,
  Download, Bug, RefreshCw, ChevronRight, Inbox
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useScan } from '../hooks/useScan';
import { EmailCard } from '../components/EmailCard';
import { PointsCounter } from '../components/PointsCounter';
import { RetailerBadge } from '../components/RetailerBadge';
import { BRAND_CATALOG, RETAILER_CONFIG } from '../config/constants';

const STAGE_ICONS = {
  idle: <Search size={18} />,
  searching: <Search size={18} className="animate-pulse" />,
  fetching: <Mail size={18} className="animate-bounce" />,
  parsing: <Cpu size={18} className="animate-spin" />,
  matching: <Tag size={18} className="animate-pulse" />,
  complete: <CheckCircle size={18} className="text-emerald-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
};

function ProgressBar({ current, total, scanState }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const isActive = ['searching', 'fetching', 'parsing', 'matching'].includes(scanState);

  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full rounded-full transition-all ${
          scanState === 'complete' ? 'bg-emerald-500' :
          scanState === 'error' ? 'bg-red-500' :
          'bg-[#F97316]'
        }`}
        style={{ width: `${isActive && total === 0 ? 15 : pct}%` }}
        animate={isActive && total === 0 ? { width: ['5%', '30%', '5%'] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

function StatCard({ label, value, icon, color = '#F97316' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
      <div className="text-2xl mb-1" style={{ color }}>{value?.toLocaleString() || '0'}</div>
      <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
        {icon}
        {label}
      </div>
    </div>
  );
}

export function Scanner() {
  const navigate = useNavigate();
  const { token, isAuthenticated, debugMode, saveResults } = useApp();
  const { scanState, progress, processedEmails, scanError, isScanning, startScan, resetScan } = useScan();
  const [activeTab, setActiveTab] = useState('progress'); // progress | results | debug

  const hasResults = scanState === 'complete' && processedEmails.length > 0;
  const matchedReceipts = processedEmails.filter((r) => r.is_receipt && r.matchedItems?.length > 0);
  const otherBrands = getOtherBrands(processedEmails, matchedReceipts);

  // Auto-switch to results tab when scan completes
  useEffect(() => {
    if (scanState === 'complete') {
      setActiveTab('results');
    }
  }, [scanState]);

  function handleStartScan() {
    if (!isAuthenticated) {
      navigate('/connect');
      return;
    }
    startScan(token, (processed, aggregated) => {
      saveResults(processed, {
        emailsFound: aggregated.totalEmailsScanned,
        receiptsIdentified: aggregated.totalReceipts,
        brandsMatched: aggregated.brandsMatched,
        totalPoints: aggregated.totalPoints,
        totalSpend: aggregated.totalSpend,
      });
    });
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(processedEmails, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnichannel-scan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Idle / Start state */}
      {scanState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
        >
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            📬
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan Your Inbox</h1>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            We'll search your Gmail for purchase confirmation emails from Walmart, Target, Amazon, and more.
            AI will extract purchase data and match brands to your loyalty account.
          </p>

          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Gmail not connected</div>
                <div className="text-xs mt-0.5">Connect your Gmail first to scan real emails.</div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartScan}
            className="bg-[#F97316] hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-md text-base"
          >
            {isAuthenticated ? '🔍 Start Scanning' : 'Connect Gmail First →'}
          </button>

          {isAuthenticated && (
            <div className="mt-3 text-xs text-gray-400">
              Scanning up to 50 emails from the last year
            </div>
          )}
        </motion.div>
      )}

      {/* Active scan + results */}
      {scanState !== 'idle' && (
        <div className="space-y-4">
          {/* Status header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                scanState === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                scanState === 'error' ? 'bg-red-100 text-red-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {STAGE_ICONS[scanState]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {progress.stageLabel}
                </div>
                {progress.currentEmail && isScanning && (
                  <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                    {progress.currentEmail}
                  </div>
                )}
              </div>
              {scanState === 'complete' && (
                <button
                  onClick={() => { resetScan(); setActiveTab('progress'); }}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  Rescan
                </button>
              )}
            </div>

            <ProgressBar
              current={progress.current}
              total={progress.total}
              scanState={scanState}
            />

            {/* Running stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <StatCard label="Emails" value={progress.emailsFound} icon={<Mail size={10} />} color="#3B82F6" />
              <StatCard label="Receipts" value={progress.receiptsIdentified} icon={<CheckCircle size={10} />} color="#F97316" />
              <StatCard label="Brands" value={progress.brandsMatched} icon={<Tag size={10} />} color="#8B5CF6" />
              <StatCard label="Points" value={progress.totalPoints} icon={<span className="text-xs">⭐</span>} color="#10B981" />
            </div>
          </div>

          {/* Error */}
          {scanState === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Scan failed</div>
                <div className="text-xs mt-0.5 text-red-500">{scanError}</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {processedEmails.length > 0 && (
            <div>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-4">
                {[
                  { key: 'progress', label: '📡 Live Feed' },
                  { key: 'results', label: `🎯 Results (${matchedReceipts.length})` },
                  ...(debugMode ? [{ key: 'debug', label: '🐛 Debug' }] : []),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Live feed tab */}
                {activeTab === 'progress' && (
                  <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-2">
                      {[...processedEmails].reverse().slice(0, 20).map((r, i) => (
                        <EmailCard key={r._meta?.messageId || i} receipt={r} index={i} showDebug={false} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Results tab */}
                {activeTab === 'results' && (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {matchedReceipts.length === 0 && scanState === 'complete' ? (
                      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="font-semibold text-gray-700 mb-2">No catalog matches found</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                          We found {progress.receiptsIdentified} receipt{progress.receiptsIdentified !== 1 ? 's' : ''} but
                          none contained brands from our catalog. This is normal for a demo with a limited brand set.
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                          Catalog includes: LEGO, Nike, Adidas, Apple, Samsung, Dyson, YETI, and more
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Points summary */}
                        {scanState === 'complete' && matchedReceipts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-[#1E3A5F] to-[#2a4f82] rounded-2xl p-6 text-white text-center"
                          >
                            <div className="text-sm text-blue-200 mb-1">Total Points Earned</div>
                            <PointsCounter
                              value={progress.totalPoints}
                              size="xl"
                              className="text-white"
                              animated
                            />
                            <div className="text-sm text-blue-200 mt-1">across {matchedReceipts.length} receipts</div>
                            <button className="mt-4 bg-[#F97316] hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                              Claim Your Points →
                            </button>
                          </motion.div>
                        )}

                        {/* Matched receipts grouped by brand */}
                        <BrandGroupedResults receipts={matchedReceipts} />

                        {/* Network discovery */}
                        {otherBrands.length > 0 && (
                          <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-900 mb-1">Other Brands Found in Your Inbox</h3>
                            <p className="text-xs text-gray-500 mb-4">
                              We also found purchases from these brands. Join their rewards programs to earn points there too.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {otherBrands.map((brand) => (
                                <div key={brand.brandKey} className="bg-gray-50 rounded-xl p-3 text-center">
                                  <div className="text-2xl mb-1">{brand.emoji}</div>
                                  <div className="text-xs font-semibold text-gray-900">{brand.displayName}</div>
                                  <div className="text-xs text-gray-500">{brand.category}</div>
                                  <button className="mt-2 text-xs bg-[#F97316] text-white px-3 py-1 rounded-full font-medium hover:bg-orange-500 transition-colors">
                                    Join Rewards
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Debug tab */}
                {activeTab === 'debug' && (
                  <motion.div key="debug" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 text-sm">Raw Parse Data</h3>
                        <button
                          onClick={handleExportJSON}
                          className="flex items-center gap-1.5 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Download size={12} />
                          Export JSON
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {processedEmails.map((r, i) => (
                        <EmailCard key={r._meta?.messageId || i} receipt={r} index={i} showDebug />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA when done */}
          {scanState === 'complete' && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/monitor')}
                className="flex-1 bg-[#1E3A5F] hover:bg-[#2a4f82] text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                View Monitor Dashboard →
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors text-sm"
              >
                Merchant Analytics →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BrandGroupedResults({ receipts }) {
  // Group by brand
  const byBrand = {};
  for (const receipt of receipts) {
    for (const item of receipt.matchedItems || []) {
      if (!item.points) continue;
      if (!byBrand[item.brandKey]) {
        byBrand[item.brandKey] = {
          brandKey: item.brandKey,
          brandInfo: BRAND_CATALOG[item.brandKey],
          items: [],
          totalPoints: 0,
          totalSpend: 0,
        };
      }
      byBrand[item.brandKey].items.push({
        ...item,
        retailer: receipt.retailer,
        orderDate: receipt.order_date,
      });
      byBrand[item.brandKey].totalPoints += item.points || 0;
      byBrand[item.brandKey].totalSpend += item.price || 0;
    }
  }

  const brands = Object.values(byBrand).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-3">
      {brands.map((group) => (
        <div key={group.brandKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Brand header */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
            <span className="text-2xl">{group.brandInfo?.emoji || '🏷️'}</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{group.brandInfo?.displayName || group.brandKey}</div>
              <div className="text-xs text-gray-500">{group.brandInfo?.category} · {group.items.length} purchase{group.items.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-600">+{group.totalPoints.toLocaleString()} pts</div>
              <div className="text-xs text-gray-500">${group.totalSpend.toFixed(2)} spent</div>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-50">
            {group.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">{item.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.retailer && item.retailer !== 'unknown' && (
                      <RetailerBadge retailer={item.retailer} size="sm" />
                    )}
                    {item.orderDate && (
                      <span className="text-xs text-gray-400">{item.orderDate}</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-emerald-600">+{item.points} pts</div>
                  <div className="text-xs text-gray-400">${item.price?.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getOtherBrands(processedEmails, matchedReceipts) {
  const matchedBrandKeys = new Set(
    matchedReceipts.flatMap((r) => r.matchedBrands || [])
  );

  // Find brand mentions in unmatched items of receipts
  const others = {};
  for (const receipt of processedEmails) {
    if (!receipt.is_receipt) continue;
    for (const item of receipt.unmatchedItems || []) {
      // Try to find any brand mentions
      if (item.brand) {
        const normalized = item.brand.toLowerCase();
        for (const [key, brand] of Object.entries(BRAND_CATALOG)) {
          if (matchedBrandKeys.has(key)) continue;
          for (const alias of brand.aliases) {
            if (normalized.includes(alias)) {
              others[key] = { ...brand, brandKey: key };
              break;
            }
          }
        }
      }
    }
  }

  return Object.values(others).slice(0, 6);
}
