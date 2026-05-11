import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RetailerBadge } from './RetailerBadge';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { BRAND_CATALOG } from '../config/constants';

export function EmailCard({ receipt, index = 0, showDebug = false }) {
  const [expanded, setExpanded] = useState(false);
  const meta = receipt._meta || {};
  const isReceipt = receipt.is_receipt;
  const hasMatches = (receipt.matchedItems || []).length > 0;

  const statusIcon = hasMatches
    ? <CheckCircle size={16} className="text-emerald-500" />
    : isReceipt
    ? <Clock size={16} className="text-amber-500" />
    : <XCircle size={16} className="text-slate-400" />;

  const statusText = hasMatches
    ? `${receipt.matchedItems.length} brand match${receipt.matchedItems.length !== 1 ? 'es' : ''}`
    : isReceipt
    ? 'Receipt — no catalog matches'
    : 'Not a receipt';

  const formattedDate = meta.date
    ? new Date(meta.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : receipt.order_date || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-shrink-0">{statusIcon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
              {meta.subject || receipt.order_id || 'Email'}
            </span>
            {receipt.retailer && receipt.retailer !== 'unknown' && (
              <RetailerBadge retailer={receipt.retailer} size="sm" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{statusText}</span>
            {formattedDate && (
              <span className="text-xs text-gray-400">· {formattedDate}</span>
            )}
            {receipt.total && (
              <span className="text-xs text-gray-500 font-medium">
                · ${receipt.total.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {hasMatches && (
          <div className="flex-shrink-0 text-right">
            <span className="text-sm font-bold text-emerald-600">
              +{receipt.totalPoints?.toLocaleString()} pts
            </span>
          </div>
        )}

        <div className="flex-shrink-0 text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 p-4 space-y-4">
              {/* Matched items */}
              {hasMatches && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Matched Brands
                  </h4>
                  <div className="space-y-2">
                    {receipt.matchedItems.map((item, i) => {
                      const brand = BRAND_CATALOG[item.brandKey];
                      return (
                        <div key={i} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{brand?.emoji || '🏷️'}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.matchedBrand} · {item.category}
                                {item.matchMethod === 'llm_identified' ? (
                                  <span className="ml-1 text-blue-500">AI matched</span>
                                ) : (
                                  <span className="ml-1 text-gray-400">name match</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-600">+{item.points} pts</div>
                            <div className="text-xs text-gray-500">${item.price?.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Confidence */}
              {isReceipt && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Parse Confidence
                    </h4>
                  </div>
                  <ConfidenceIndicator confidence={receipt.confidence} />
                </div>
              )}

              {/* Debug view */}
              {showDebug && (
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Debug / Raw Data
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">
                      {JSON.stringify(
                        {
                          meta: {
                            subject: meta.subject,
                            from: meta.from,
                            processingMs: meta.processingMs,
                            parseSuccess: meta.parseSuccess,
                          },
                          extraction: {
                            is_receipt: receipt.is_receipt,
                            retailer: receipt.retailer,
                            order_id: receipt.order_id,
                            order_date: receipt.order_date,
                            items: receipt.items,
                            total: receipt.total,
                            confidence: receipt.confidence,
                          },
                          matching: {
                            matchedCount: receipt.matchedItems?.length || 0,
                            unmatchedCount: receipt.unmatchedItems?.length || 0,
                            totalPoints: receipt.totalPoints,
                            matchedBrands: receipt.matchedBrands,
                          },
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
