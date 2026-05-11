import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants';

const DEFAULT_STATS = {
  emailsFound: 0,
  receiptsIdentified: 0,
  brandsMatched: 0,
  totalPoints: 0,
  totalSpend: 0,
};

/**
 * Manages scan results with localStorage persistence.
 */
export function useResults() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [scanDate, setScanDate] = useState(null);
  const [hasStoredResults, setHasStoredResults] = useState(false);

  // Load persisted results on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.results);
      const storedStats = localStorage.getItem(STORAGE_KEYS.stats);
      const storedDate = localStorage.getItem(STORAGE_KEYS.scanDate);

      if (stored) {
        setResults(JSON.parse(stored));
        setHasStoredResults(true);
      }
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      if (storedDate) {
        setScanDate(storedDate);
      }
    } catch (err) {
      console.warn('Failed to load stored results:', err);
    }
  }, []);

  const saveResults = useCallback((newResults, newStats) => {
    const date = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(newResults));
      localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(newStats));
      localStorage.setItem(STORAGE_KEYS.scanDate, date);
    } catch (err) {
      console.warn('Failed to persist results:', err);
    }

    setResults(newResults);
    setStats(newStats);
    setScanDate(date);
    setHasStoredResults(true);
  }, []);

  const clearResults = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.results);
      localStorage.removeItem(STORAGE_KEYS.stats);
      localStorage.removeItem(STORAGE_KEYS.scanDate);
    } catch (_) {}

    setResults([]);
    setStats(DEFAULT_STATS);
    setScanDate(null);
    setHasStoredResults(false);
  }, []);

  // Compute derived data for display
  const matchedReceipts = results.filter((r) => r.is_receipt && r.matchedItems?.length > 0);
  const allMatchedItems = matchedReceipts.flatMap((r) =>
    (r.matchedItems || []).map((item) => ({
      ...item,
      retailer: r.retailer,
      orderDate: r.order_date,
      orderId: r.order_id,
      emailSubject: r._meta?.subject,
    }))
  );

  // Group matched items by brand
  const itemsByBrand = allMatchedItems.reduce((acc, item) => {
    const key = item.brandKey;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Other catalog brands found (unmatched but present)
  const unmatchedBrands = results
    .filter((r) => r.is_receipt)
    .flatMap((r) => r.unmatchedItems || [])
    .reduce((acc, item) => {
      // Just collect for display purposes
      return acc;
    }, {});

  return {
    results,
    stats,
    scanDate,
    hasStoredResults,
    matchedReceipts,
    allMatchedItems,
    itemsByBrand,
    saveResults,
    clearResults,
  };
}
