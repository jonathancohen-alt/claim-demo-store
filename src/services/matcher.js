// Brand catalog matcher
// Two-pass matching:
// 1. If Claude identified a brand name, try matching against catalog aliases
// 2. Fallback: search product name string for any alias match

import { BRAND_CATALOG, calculatePoints, getRetailerFromEmail } from '../config/constants';

/**
 * Match all items in a parsed receipt against the brand catalog.
 * @param {object} parsedReceipt - Result from parser.js
 * @returns {object} - Enhanced receipt with matched items and totals
 */
export function matchReceiptItems(parsedReceipt) {
  if (!parsedReceipt.is_receipt || !parsedReceipt.items?.length) {
    return {
      ...parsedReceipt,
      matchedItems: [],
      unmatchedItems: [],
      totalPoints: 0,
      matchedBrands: [],
    };
  }

  const matchedItems = [];
  const unmatchedItems = [];

  // Fallback price: if an item has no price, spread the receipt total across items
  const receiptTotal = parsedReceipt.total || parsedReceipt.subtotal || 0;
  const itemCount = parsedReceipt.items.length || 1;
  const fallbackPrice = receiptTotal > 0 ? receiptTotal / itemCount : 0;

  for (const item of parsedReceipt.items) {
    // Use item price if available, otherwise fall back to prorated receipt total
    const priceToUse = (item.price && item.price > 0) ? item.price : fallbackPrice;
    const match = matchItem({ ...item, price: priceToUse });
    if (match) {
      matchedItems.push(match);
    } else {
      unmatchedItems.push({ ...item, matched: false });
    }
  }

  const totalPoints = matchedItems.reduce((sum, item) => sum + (item.points || 0), 0);
  const matchedBrands = [...new Set(matchedItems.map((i) => i.brandKey))];

  // Determine retailer from email metadata
  const retailer = parsedReceipt.retailer ||
    (parsedReceipt._meta
      ? getRetailerFromEmail(parsedReceipt._meta.from, parsedReceipt._meta.subject)
      : 'unknown');

  return {
    ...parsedReceipt,
    retailer,
    matchedItems,
    unmatchedItems,
    totalPoints,
    matchedBrands,
  };
}

/**
 * Attempt to match a single item against the brand catalog.
 * @param {object} item - { name, brand, quantity, price, category }
 * @returns {object|null} - Enhanced item with match info, or null if no match
 */
function matchItem(item) {
  // Pass 1: Use Claude's identified brand name
  if (item.brand) {
    const match = findBrandByAlias(item.brand);
    if (match) {
      const points = calculatePoints(match.brandKey, item.price || 0);
      return {
        ...item,
        matched: true,
        brandKey: match.brandKey,
        matchedBrand: match.brand.displayName,
        category: match.brand.category,
        points,
        matchMethod: 'llm_identified',
        matchConfidence: 0.95,
      };
    }
  }

  // Pass 2: Search the product name for alias matches
  if (item.name) {
    const match = findBrandByAlias(item.name);
    if (match) {
      const points = calculatePoints(match.brandKey, item.price || 0);
      return {
        ...item,
        matched: true,
        brandKey: match.brandKey,
        matchedBrand: match.brand.displayName,
        category: match.brand.category,
        points,
        matchMethod: 'name_match',
        matchConfidence: 0.75,
      };
    }
  }

  return null;
}

/**
 * Search the brand catalog for a matching alias.
 * @param {string} text - Brand name or product name to search
 * @returns {{ brandKey, brand } | null}
 */
function findBrandByAlias(text) {
  if (!text) return null;
  const normalized = text.toLowerCase().trim();

  for (const [brandKey, brand] of Object.entries(BRAND_CATALOG)) {
    for (const alias of brand.aliases) {
      if (normalized.includes(alias.toLowerCase())) {
        return { brandKey, brand };
      }
    }
  }

  return null;
}

/**
 * Aggregate scan results into summary stats.
 * @param {Array} processedReceipts - Array of matchReceiptItems results
 * @returns {object} - Summary stats
 */
export function aggregateResults(processedReceipts) {
  const allMatched = processedReceipts.flatMap((r) => r.matchedItems || []);
  const receipts = processedReceipts.filter((r) => r.is_receipt);

  // Points by brand
  const brandTotals = {};
  for (const item of allMatched) {
    if (!brandTotals[item.brandKey]) {
      brandTotals[item.brandKey] = {
        brandKey: item.brandKey,
        displayName: BRAND_CATALOG[item.brandKey]?.displayName || item.matchedBrand,
        category: item.category,
        totalPoints: 0,
        totalSpend: 0,
        itemCount: 0,
        purchases: [],
      };
    }
    brandTotals[item.brandKey].totalPoints += item.points || 0;
    brandTotals[item.brandKey].totalSpend += item.price || 0;
    brandTotals[item.brandKey].itemCount += 1;
    brandTotals[item.brandKey].purchases.push(item);
  }

  // Points by retailer
  const retailerTotals = {};
  for (const receipt of receipts) {
    const retailer = receipt.retailer || 'unknown';
    if (!retailerTotals[retailer]) {
      retailerTotals[retailer] = {
        retailer,
        totalSpend: 0,
        receiptCount: 0,
        matchedItems: 0,
        totalPoints: 0,
      };
    }
    retailerTotals[retailer].totalSpend += receipt.total || receipt.subtotal || 0;
    retailerTotals[retailer].receiptCount += 1;
    retailerTotals[retailer].matchedItems += (receipt.matchedItems || []).length;
    retailerTotals[retailer].totalPoints += receipt.totalPoints || 0;
  }

  const totalPoints = Object.values(brandTotals).reduce((s, b) => s + b.totalPoints, 0);
  const totalSpend = receipts.reduce((s, r) => s + (r.total || r.subtotal || 0), 0);

  return {
    totalReceipts: receipts.length,
    totalEmailsScanned: processedReceipts.length,
    totalPoints,
    totalSpend,
    brandsMatched: Object.keys(brandTotals).length,
    brandTotals,
    retailerTotals,
    receipts,
  };
}
