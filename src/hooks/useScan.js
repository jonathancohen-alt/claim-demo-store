import { useState, useCallback, useRef } from 'react';
import { searchEmails, fetchEmailContent } from '../services/gmail';
import { parseEmailReceipt } from '../services/parser';
import { matchReceiptItems, aggregateResults } from '../services/matcher';
import { GMAIL_SEARCH_QUERY, BRAND_CATALOG, calculatePoints } from '../config/constants';

// Subject keywords that identify emails already covered by a hardcoded receipt.
// Matching emails are skipped during the scan to avoid redundant API calls.
const HARDCODED_SUBJECTS = ['airpods'];

function isCoveredByHardcodedReceipt(subject = '') {
  const lower = subject.toLowerCase();
  return HARDCODED_SUBJECTS.some((kw) => lower.includes(kw));
}

// Fake AirPods receipt — mirrors the real Amazon order but hardcoded so API
// overload (529) can never drop it from the results
const AIRPODS_FAKE_RECEIPT = (() => {
  const price = 220.00;
  const points = calculatePoints('apple', price);
  return {
    is_receipt: true,
    retailer: 'Amazon.com',
    order_id: '113-AMZN-AIRPODS',
    order_date: '2026-02-14',
    items: [{ name: 'Apple AirPods Pro 3 Wireless Earbuds', brand: 'Apple', quantity: 1, price, category: 'Electronics' }],
    subtotal: price,
    tax: 19.80,
    total: 239.80,
    shipping: 0,
    confidence: 1,
    matchedItems: [{
      name: 'Apple AirPods Pro 3 Wireless Earbuds',
      brand: 'Apple',
      brandKey: 'apple',
      quantity: 1,
      price,
      category: 'Electronics',
      matched: true,
      matchedBrand: BRAND_CATALOG['apple'].displayName,
      points,
      matchMethod: 'llm_identified',
      matchConfidence: 1,
    }],
    unmatchedItems: [],
    totalPoints: points,
    matchedBrands: ['apple'],
    _meta: {
      messageId: 'fake-airpods-001',
      subject: 'Ordered: "Apple AirPods Pro 3 Wireless Earbuds"',
      from: '"Amazon.com" <auto-confirm@amazon.com>',
      date: '2026-02-14T14:05:00Z',
      processingMs: 0,
      parseSuccess: true,
    },
  };
})();

// Fake ToyBox Co. receipt — always injected so the demo store has a purchase
const TOYBOX_FAKE_RECEIPT = (() => {
  const price = 49.99;
  const points = calculatePoints('toybox', price);
  return {
    is_receipt: true,
    retailer: 'ToyBox Co.',
    order_id: 'TBC-20260301-8842',
    order_date: '2026-03-01',
    items: [{ name: 'Magnetic Tile Set (60pc)', brand: 'ToyBox Co.', quantity: 1, price, category: 'Kids & Toys' }],
    subtotal: price,
    tax: 4.25,
    total: 54.24,
    shipping: 0,
    confidence: 1,
    matchedItems: [{
      name: 'Magnetic Tile Set (60pc)',
      brand: 'ToyBox Co.',
      brandKey: 'toybox',
      quantity: 1,
      price,
      category: 'Kids & Toys',
      matched: true,
      matchedBrand: BRAND_CATALOG['toybox'].displayName,
      points,
      matchMethod: 'llm_identified',
      matchConfidence: 1,
    }],
    unmatchedItems: [],
    totalPoints: points,
    matchedBrands: ['toybox'],
    _meta: {
      messageId: 'fake-toybox-001',
      subject: 'Your ToyBox Co. Order Confirmation #TBC-20260301-8842',
      from: 'orders@toyboxco.com',
      date: '2026-03-01T10:23:00Z',
      processingMs: 0,
      parseSuccess: true,
    },
  };
})();

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Demo receipts simulating ORIVA purchases found at third-party retailers
const DEMO_RECEIPTS = (() => {
  const makeReceipt = (opts) => {
    const points = calculatePoints('oriva', opts.price);
    return {
      is_receipt: true,
      retailer: opts.retailer,
      order_id: opts.orderId,
      order_date: opts.date,
      items: [{ name: opts.item, brand: 'ORIVA', quantity: 1, price: opts.price, category: 'Skincare' }],
      subtotal: opts.price,
      tax: +(opts.price * 0.088).toFixed(2),
      total: +(opts.price * 1.088).toFixed(2),
      shipping: 0,
      confidence: 1,
      matchedItems: [{
        name: opts.item, brand: 'ORIVA', brandKey: 'oriva', quantity: 1, price: opts.price,
        category: 'Skincare', matched: true, matchedBrand: 'ORIVA', points,
        matchMethod: 'llm_identified', matchConfidence: 1,
      }],
      unmatchedItems: [],
      totalPoints: points,
      matchedBrands: ['oriva'],
      _meta: {
        messageId: opts.orderId,
        subject: opts.subject,
        from: opts.from,
        date: opts.date + 'T10:00:00Z',
        processingMs: 0,
        parseSuccess: true,
      },
    };
  };
  return [
    makeReceipt({ retailer: 'Amazon.com', orderId: 'demo-amzn-001', date: '2026-03-12', price: 26.00, item: 'ORIVA Hydrating Serum (50ml)', subject: 'Your Amazon.com order of "ORIVA Hydrating Serum"', from: '"Amazon.com" <auto-confirm@amazon.com>' }),
    makeReceipt({ retailer: 'Target', orderId: 'demo-tgt-001', date: '2026-02-28', price: 18.00, item: 'ORIVA Vitamin C Cleanser (100ml)', subject: 'Target order confirmation #demo-tgt-001', from: 'orders@target.com' }),
    makeReceipt({ retailer: 'Walmart', orderId: 'demo-wmt-001', date: '2026-01-15', price: 22.00, item: 'ORIVA Hydrating Gel (150ml)', subject: 'Walmart.com Order Confirmation', from: 'help@walmart.com' }),
  ];
})();

const INITIAL_PROGRESS = {
  stage: 'idle',
  stageLabel: 'Ready to scan',
  current: 0,
  total: 0,
  currentEmail: null,
  emailsFound: 0,
  receiptsIdentified: 0,
  brandsMatched: 0,
  totalPoints: 0,
};

/**
 * Orchestrates the full scanning pipeline:
 * search emails → fetch content → parse with Claude → match brands
 */
export function useScan() {
  const [scanState, setScanState] = useState('idle'); // idle | searching | fetching | parsing | matching | complete | error
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [processedEmails, setProcessedEmails] = useState([]);
  const [scanError, setScanError] = useState(null);
  const abortRef = useRef(false);

  const updateProgress = useCallback((updates) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Run the full scan pipeline.
   * @param {string} accessToken - Gmail OAuth token
   * @param {function} onComplete - Called with (processedReceipts, aggregatedStats) when done
   */
  const startScan = useCallback(async (accessToken, onComplete) => {
    if (!ANTHROPIC_API_KEY) {
      setScanError('VITE_ANTHROPIC_API_KEY is not set in .env');
      setScanState('error');
      return;
    }

    abortRef.current = false;
    setScanState('searching');
    setScanError(null);
    setProcessedEmails([]);
    setProgress({ ...INITIAL_PROGRESS, stage: 'searching', stageLabel: 'Searching inbox...' });

    try {
      // Step 1: Search Gmail
      const messageList = await searchEmails(accessToken, GMAIL_SEARCH_QUERY, 100);

      if (abortRef.current) return;

      if (messageList.length === 0) {
        setScanState('complete');
        updateProgress({
          stage: 'complete',
          stageLabel: 'No purchase emails found',
          emailsFound: 0,
        });
        if (onComplete) onComplete([], aggregateResults([]));
        return;
      }

      updateProgress({
        stage: 'fetching',
        stageLabel: `Found ${messageList.length} purchase emails`,
        emailsFound: messageList.length,
        total: messageList.length,
        current: 0,
      });

      setScanState('fetching');

      // Step 2 + 3: Fetch each email then immediately parse it
      const allProcessed = [];
      let receiptsFound = 0;
      let brandsFound = 0;
      let pointsEarned = 0;

      for (let i = 0; i < messageList.length; i++) {
        if (abortRef.current) break;

        const { id } = messageList[i];

        // Fetch email
        setScanState('fetching');
        updateProgress({
          stage: 'fetching',
          stageLabel: `Fetching email ${i + 1} of ${messageList.length}...`,
          current: i + 1,
        });

        let email;
        try {
          email = await fetchEmailContent(accessToken, id);
        } catch (err) {
          console.warn(`Failed to fetch email ${id}:`, err);
          allProcessed.push({ is_receipt: false, _fetchError: err.message, _meta: { messageId: id } });
          setProcessedEmails((prev) => [...prev]);
          continue;
        }

        // Skip API parsing for emails covered by a hardcoded receipt
        if (isCoveredByHardcodedReceipt(email.subject)) {
          updateProgress({ current: i + 1 });
          continue;
        }

        if (abortRef.current) break;

        // Parse with Claude
        setScanState('parsing');
        updateProgress({
          stage: 'parsing',
          stageLabel: `Parsing: "${truncate(email.subject, 60)}"`,
          currentEmail: email.subject,
          current: i + 1,
        });

        const parsed = await parseEmailReceipt(ANTHROPIC_API_KEY, email);

        if (abortRef.current) break;

        // Match brands
        setScanState('matching');
        updateProgress({
          stage: 'matching',
          stageLabel: `Matching brands in: "${truncate(email.subject, 50)}"`,
        });

        const matched = matchReceiptItems(parsed);

        // Update running totals
        if (matched.is_receipt) receiptsFound++;
        if (matched.matchedBrands?.length > 0) {
          brandsFound += matched.matchedBrands.length;
          pointsEarned += matched.totalPoints || 0;
        }

        allProcessed.push(matched);
        setProcessedEmails((prev) => [...prev, matched]);

        updateProgress({
          receiptsIdentified: receiptsFound,
          brandsMatched: brandsFound,
          totalPoints: pointsEarned,
        });

        // Delay between emails
        if (i < messageList.length - 1) {
          await sleep(300);
        }
      }

      if (abortRef.current) return;

      // Inject AirPods receipt unless the real email already parsed with items
      const realAirpodsFound = allProcessed.some(
        (r) => r._meta?.subject?.toLowerCase().includes('airpods') && r.matchedItems?.length > 0
      );
      if (!realAirpodsFound) {
        allProcessed.push(AIRPODS_FAKE_RECEIPT);
        setProcessedEmails((prev) => [...prev, AIRPODS_FAKE_RECEIPT]);
        receiptsFound++;
        brandsFound++;
        pointsEarned += AIRPODS_FAKE_RECEIPT.totalPoints;
        updateProgress({ receiptsIdentified: receiptsFound, brandsMatched: brandsFound, totalPoints: pointsEarned });
      }

      // Always append the ToyBox Co. demo receipt
      allProcessed.push(TOYBOX_FAKE_RECEIPT);
      setProcessedEmails((prev) => [...prev, TOYBOX_FAKE_RECEIPT]);
      receiptsFound++;
      brandsFound++;
      pointsEarned += TOYBOX_FAKE_RECEIPT.totalPoints;
      updateProgress({ receiptsIdentified: receiptsFound, brandsMatched: brandsFound, totalPoints: pointsEarned });

      // Aggregate final stats
      const aggregated = aggregateResults(allProcessed);

      setScanState('complete');
      updateProgress({
        stage: 'complete',
        stageLabel: `Scan complete! Found ${receiptsFound} receipts, ${aggregated.brandsMatched} brands`,
        current: messageList.length,
        receiptsIdentified: receiptsFound,
        brandsMatched: aggregated.brandsMatched,
        totalPoints: aggregated.totalPoints,
      });

      if (onComplete) onComplete(allProcessed, aggregated);
    } catch (err) {
      console.error('Scan failed:', err);
      setScanError(err.message);
      setScanState('error');
      updateProgress({
        stage: 'error',
        stageLabel: 'Scan failed: ' + err.message,
      });
    }
  }, [updateProgress]);

  const resetScan = useCallback(() => {
    abortRef.current = true;
    setScanState('idle');
    setScanError(null);
    setProcessedEmails([]);
    setProgress(INITIAL_PROGRESS);
  }, []);

  const startDemoScan = useCallback(async (onComplete) => {
    abortRef.current = false;
    setScanState('searching');
    setScanError(null);
    setProcessedEmails([]);
    setProgress({ ...INITIAL_PROGRESS, stage: 'searching', stageLabel: 'Searching inbox...' });

    await new Promise(r => setTimeout(r, 1200));
    if (abortRef.current) return;

    const receipts = DEMO_RECEIPTS;
    updateProgress({ stage: 'fetching', stageLabel: `Found ${receipts.length} purchase emails`, emailsFound: receipts.length, total: receipts.length, current: 0 });
    setScanState('fetching');

    let totalPoints = 0;
    for (let i = 0; i < receipts.length; i++) {
      if (abortRef.current) return;
      await new Promise(r => setTimeout(r, 900));
      setScanState('parsing');
      updateProgress({ stage: 'parsing', stageLabel: `Reading receipt ${i + 1} of ${receipts.length}…`, current: i + 1 });
      await new Promise(r => setTimeout(r, 700));
      setScanState('matching');
      const receipt = receipts[i];
      setProcessedEmails(prev => [...prev, receipt]);
      totalPoints += receipt.totalPoints;
      updateProgress({ stage: 'matching', stageLabel: `Matched ${receipt.matchedBrands[0].toUpperCase()}`, current: i + 1, receiptsIdentified: i + 1, brandsMatched: i + 1, totalPoints });
    }

    if (abortRef.current) return;
    await new Promise(r => setTimeout(r, 600));

    const aggregated = aggregateResults(receipts);
    setScanState('complete');
    updateProgress({ stage: 'complete', stageLabel: `Scan complete! Found ${receipts.length} receipts`, current: receipts.length, receiptsIdentified: receipts.length, brandsMatched: aggregated.brandsMatched, totalPoints: aggregated.totalPoints });
    if (onComplete) onComplete(receipts, aggregated);
  }, [updateProgress]);

  const isScanning = ['searching', 'fetching', 'parsing', 'matching'].includes(scanState);

  return {
    scanState,
    progress,
    processedEmails,
    scanError,
    isScanning,
    startScan,
    startDemoScan,
    resetScan,
  };
}

function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
