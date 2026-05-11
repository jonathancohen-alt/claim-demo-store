// Brand catalog - 20 brands across categories with alias matching
export const BRAND_CATALOG = {
  // ORIVA — the demo store's own brand
  'toybox': {
    displayName: 'ORIVA',
    category: 'Skincare',
    pointsRate: 10,
    aliases: ['oriva', 'oriva skin', 'oriva beauty', 'vitamin c cleanser', 'hydrating gel', 'hydrating serum', 'repair cream', 'glow drops'],
    color: '#1F4F3D',
    emoji: '🌿',
  },

  // Kids & Toys
  'lego': {
    displayName: 'LEGO',
    category: 'Kids & Toys',
    pointsRate: 10,
    aliases: ['lego', 'lego group', 'lego set', 'lego duplo', 'lego technic', 'lego city', 'lego friends'],
    color: '#FFCF00',
    emoji: '🧱',
  },
  'hasbro': {
    displayName: 'Hasbro',
    category: 'Kids & Toys',
    pointsRate: 10,
    aliases: ['hasbro', 'nerf', 'play-doh', 'playdoh', 'transformers', 'my little pony', 'monopoly', 'battleship'],
    color: '#E31837',
    emoji: '🎲',
  },
  'mattel': {
    displayName: 'Mattel',
    category: 'Kids & Toys',
    pointsRate: 10,
    aliases: ['mattel', 'barbie', 'hot wheels', 'fisher-price', 'fisher price', 'uno'],
    color: '#E8192C',
    emoji: '🪆',
  },
  'melissa-doug': {
    displayName: 'Melissa & Doug',
    category: 'Kids & Toys',
    pointsRate: 10,
    aliases: ['melissa', 'melissa & doug', 'melissa and doug'],
    color: '#4CAF50',
    emoji: '🎨',
  },

  // Beauty & Skincare
  'rhode': {
    displayName: 'Rhode',
    category: 'Beauty',
    pointsRate: 8,
    aliases: ['rhode', 'rhode skin', 'rhode beauty'],
    color: '#C4A882',
    emoji: '✨',
  },
  'cerave': {
    displayName: 'CeraVe',
    category: 'Beauty',
    pointsRate: 8,
    aliases: ['cerave', 'cera ve'],
    color: '#0066CC',
    emoji: '🧴',
  },
  'the-ordinary': {
    displayName: 'The Ordinary',
    category: 'Beauty',
    pointsRate: 8,
    aliases: ['the ordinary', 'ordinary', 'deciem'],
    color: '#1A1A1A',
    emoji: '💊',
  },
  'olaplex': {
    displayName: 'Olaplex',
    category: 'Beauty',
    pointsRate: 8,
    aliases: ['olaplex'],
    color: '#000000',
    emoji: '💆',
  },

  // Athletic / Apparel
  'nike': {
    displayName: 'Nike',
    category: 'Athletic',
    pointsRate: 12,
    aliases: ['nike', 'nike air', 'air jordan', 'jordan', 'air force', 'air max', 'dri-fit'],
    color: '#111111',
    emoji: '👟',
  },
  'adidas': {
    displayName: 'Adidas',
    category: 'Athletic',
    pointsRate: 12,
    aliases: ['adidas', 'ultraboost', 'yeezy', 'stan smith', 'gazelle'],
    color: '#000000',
    emoji: '🏃',
  },
  'lululemon': {
    displayName: 'Lululemon',
    category: 'Athletic',
    pointsRate: 12,
    aliases: ['lululemon', 'lulu lemon', 'lulu'],
    color: '#8B1A1A',
    emoji: '🧘',
  },

  // Home & Lifestyle
  'dyson': {
    displayName: 'Dyson',
    category: 'Home',
    pointsRate: 8,
    aliases: ['dyson', 'dyson v', 'dyson airwrap'],
    color: '#C8A951',
    emoji: '🌀',
  },
  'yeti': {
    displayName: 'YETI',
    category: 'Lifestyle',
    pointsRate: 10,
    aliases: ['yeti', 'yeti rambler', 'yeti cooler'],
    color: '#4A90D9',
    emoji: '🧊',
  },
  'stanley': {
    displayName: 'Stanley',
    category: 'Lifestyle',
    pointsRate: 10,
    aliases: ['stanley', 'stanley cup', 'stanley quencher', 'stanley tumbler'],
    color: '#4CAF50',
    emoji: '🫗',
  },

  // Pet
  'kong': {
    displayName: 'KONG',
    category: 'Pet',
    pointsRate: 10,
    aliases: ['kong', 'kong classic', 'kong toy'],
    color: '#E31837',
    emoji: '🐾',
  },
  'blue-buffalo': {
    displayName: 'Blue Buffalo',
    category: 'Pet',
    pointsRate: 10,
    aliases: ['blue buffalo', 'blue wilderness', 'blue life protection', 'blue basics'],
    color: '#003087',
    emoji: '🐕',
  },

  // Electronics
  'apple': {
    displayName: 'Apple',
    category: 'Electronics',
    pointsRate: 1, // 1 point per $1 spent
    aliases: ['apple', 'iphone', 'ipad', 'macbook', 'airpods', 'apple watch', 'imac', 'mac mini', 'apple.com', 'apple store'],
    color: '#555555',
    emoji: '🍎',
  },
  'samsung': {
    displayName: 'Samsung',
    category: 'Electronics',
    pointsRate: 5,
    aliases: ['samsung', 'galaxy', 'samsung galaxy', 'galaxy s', 'galaxy a'],
    color: '#1428A0',
    emoji: '📱',
  },
  'sonos': {
    displayName: 'Sonos',
    category: 'Electronics',
    pointsRate: 8,
    aliases: ['sonos', 'sonos one', 'sonos beam', 'sonos arc'],
    color: '#000000',
    emoji: '🔊',
  },
  'bose': {
    displayName: 'Bose',
    category: 'Electronics',
    pointsRate: 8,
    aliases: ['bose', 'quietcomfort', 'bose qc', 'bose soundlink', 'bose sport'],
    color: '#000000',
    emoji: '🎧',
  },
  'apple': {
    displayName: 'Apple',
    category: 'Electronics',
    pointsRate: 8,
    aliases: ['apple', 'airpods', 'iphone', 'ipad', 'macbook', 'apple watch', 'imac', 'mac mini', 'apple tv', 'homepod', 'icloud'],
    color: '#555555',
    emoji: '🍎',
  },

  // Subscriptions & Productivity
  'linkedin': {
    displayName: 'LinkedIn',
    category: 'Subscriptions',
    pointsRate: 5,
    aliases: ['linkedin', 'linkedin premium', 'linkedin business', 'linkedin career', 'linkedin learning'],
    color: '#0A66C2',
    emoji: '💼',
  },
  'moleskine': {
    displayName: 'Moleskine',
    category: 'Subscriptions',
    pointsRate: 5,
    aliases: ['moleskine', 'timepage', 'timepage by moleskine', 'moleskine studio'],
    color: '#1A1A1A',
    emoji: '📓',
  },
};

// Retailers we scan for
export const RETAILER_CONFIG = {
  walmart: {
    displayName: 'Walmart',
    color: '#0071CE',
    bgColor: '#E8F4FD',
    emoji: '🛒',
    domains: ['walmart.com', 'walmart'],
    searchTerms: 'walmart',
  },
  target: {
    displayName: 'Target',
    color: '#CC0000',
    bgColor: '#FDEAEA',
    emoji: '🎯',
    domains: ['target.com', 'target'],
    searchTerms: 'target',
  },
  amazon: {
    displayName: 'Amazon',
    color: '#FF9900',
    bgColor: '#FFF3E0',
    emoji: '📦',
    domains: ['amazon.com', 'amazon'],
    searchTerms: 'amazon',
  },
  bestbuy: {
    displayName: 'Best Buy',
    color: '#0046BE',
    bgColor: '#E8EEF8',
    emoji: '🏪',
    domains: ['bestbuy.com', 'best buy'],
    searchTerms: 'bestbuy',
  },
  kohls: {
    displayName: "Kohl's",
    color: '#6D1F7A',
    bgColor: '#F3EAF5',
    emoji: '👗',
    domains: ['kohls.com', 'kohls'],
    searchTerms: 'kohls',
  },
  sephora: {
    displayName: 'Sephora',
    color: '#000000',
    bgColor: '#F0F0F0',
    emoji: '💄',
    domains: ['sephora.com', 'sephora'],
    searchTerms: 'sephora',
  },
  ulta: {
    displayName: 'Ulta',
    color: '#8B0000',
    bgColor: '#F5EAEA',
    emoji: '💅',
    domains: ['ulta.com', 'ulta'],
    searchTerms: 'ulta',
  },
  chewy: {
    displayName: 'Chewy',
    color: '#E21937',
    bgColor: '#FDEAED',
    emoji: '🐾',
    domains: ['chewy.com', 'chewy'],
    searchTerms: 'chewy',
  },
  'home-depot': {
    displayName: 'Home Depot',
    color: '#F96302',
    bgColor: '#FFF0E6',
    emoji: '🔨',
    domains: ['homedepot.com', 'home depot'],
    searchTerms: '"home depot"',
  },
  lowes: {
    displayName: "Lowe's",
    color: '#00457C',
    bgColor: '#E5EEF5',
    emoji: '🪚',
    domains: ['lowes.com', 'lowes'],
    searchTerms: 'lowes',
  },
  toybox: {
    displayName: 'ORIVA',
    color: '#1F4F3D',
    bgColor: '#F5EBDD',
    emoji: '🌿',
    domains: ['oriva.com'],
    searchTerms: 'oriva',
  },
};

// Gmail search query to find purchase receipts.
// Amazon uses a targeted sub-query: from:amazon subject:Ordered
// All other retailers use the broad subject match.
export const GMAIL_SEARCH_QUERY = `((from:(walmart OR target OR bestbuy OR kohls OR sephora OR ulta OR chewy OR "home depot" OR lowes) subject:(order OR receipt OR confirmation OR shipped OR delivered)) OR (from:amazon subject:(order OR ordered OR confirmation OR purchase) -subject:shipped -subject:delivered -subject:"out for delivery" -subject:"delivery attempt")) newer_than:2y`;

// Anthropic model to use for parsing
export const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

// Max chars to send to Claude for receipt parsing (to stay within token limits)
export const MAX_EMAIL_CHARS = 15000;

// Demo brand config (ORIVA cosmetics)
export const DEMO_BRAND = {
  name: 'ORIVA',
  tagline: 'Good Skin. No Drama.',
  description: 'Simple skincare that actually works. Hydrate, glow, repeat.',
  color: '#1F4F3D',     // forest
  navyColor: '#1F4F3D', // legacy alias
  cream: '#F5EBDD',
  loyaltyProgram: 'ORIVA Rewards',
  existingMemberName: 'Sarah',
  existingMemberPoints: 2340,
};

// Local storage keys
export const STORAGE_KEYS = {
  results: 'omnichannel_results',
  stats: 'omnichannel_stats',
  scanDate: 'omnichannel_scan_date',
  scenario: 'omnichannel_scenario',
};

// Points calculation helpers
export function calculatePoints(brandKey, price) {
  const brand = BRAND_CATALOG[brandKey];
  if (!brand) return 0;
  return Math.round(price * brand.pointsRate);
}

export function getRetailerFromEmail(fromAddress, subject) {
  const combined = `${fromAddress} ${subject}`.toLowerCase();
  for (const [key, config] of Object.entries(RETAILER_CONFIG)) {
    for (const domain of config.domains) {
      if (combined.includes(domain.toLowerCase())) {
        return key;
      }
    }
  }
  return 'unknown';
}
