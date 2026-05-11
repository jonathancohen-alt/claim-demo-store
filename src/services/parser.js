// Anthropic Claude API receipt parser
// NOTE: The API key is intentionally exposed in the browser for this local demo tool.
// This is acceptable for a demo that runs locally. Do NOT deploy this to production
// without moving the API call to a backend server.
//
// The anthropic-dangerous-direct-browser-access header is required for browser-side API calls
// as it explicitly opts in to bypassing CORS restrictions for demo purposes.

import { ANTHROPIC_MODEL, MAX_EMAIL_CHARS } from '../config/constants';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are a receipt parser. Extract structured purchase data from email content.
Return ONLY valid JSON with this exact structure:
{
  "is_receipt": boolean,
  "retailer": string or null,
  "order_id": string or null,
  "order_date": string or null (YYYY-MM-DD),
  "items": [
    {
      "name": string,
      "brand": string or null (if identifiable),
      "quantity": number,
      "price": number,
      "category": string or null
    }
  ],
  "subtotal": number or null,
  "tax": number or null,
  "total": number or null,
  "shipping": number or null,
  "confidence": number (0-1, how confident you are this is a real receipt)
}
If the email is not a purchase receipt/confirmation, set is_receipt to false and leave other fields null.
Extract brand names when identifiable from product names. Be specific: "Nike Air Max 90" brand is "Nike", "LEGO Duplo Classic" brand is "LEGO".`;

// Patterns that reliably identify an email as a purchase receipt before calling the AI.
// Sender domain → array of subject patterns (lowercase, partial match).
const RECEIPT_PRESCREENS = [
  { senderPattern: 'amazon.com',  subjectPatterns: ['ordered:', 'your amazon.com order', 'order confirmation', 'your order of'] },
  { senderPattern: 'walmart.com', subjectPatterns: ['order confirmation', 'your order', 'receipt'] },
  { senderPattern: 'target.com',  subjectPatterns: ['order confirmation', 'your order', 'receipt'] },
  { senderPattern: 'bestbuy.com', subjectPatterns: ['order confirmation', 'your order', 'receipt'] },
  { senderPattern: 'apple.com',   subjectPatterns: ['your receipt', 'subscription confirmation', 'order confirmation'] },
];

/**
 * Returns true if the email can be confidently identified as a receipt
 * based on sender + subject alone, without calling the AI.
 */
function preScreenReceipt(from = '', subject = '') {
  const fromLower = from.toLowerCase();
  const subjectLower = subject.toLowerCase();
  for (const { senderPattern, subjectPatterns } of RECEIPT_PRESCREENS) {
    if (fromLower.includes(senderPattern)) {
      if (subjectPatterns.some((p) => subjectLower.includes(p))) return true;
    }
  }
  return false;
}

/**
 * Parse an email body using Claude to extract receipt data.
 * @param {string} apiKey - Anthropic API key (from env)
 * @param {object} email - { messageId, subject, from, date, body }
 * @returns {Promise<object>} - Parsed receipt data
 */
export async function parseEmailReceipt(apiKey, email) {
  const startTime = Date.now();

  // Strip HTML tags if body looks like HTML, then truncate
  const cleanBody = looksLikeHTML(email.body) ? stripHTML(email.body) : email.body;
  const truncatedBody = cleanBody.slice(0, MAX_EMAIL_CHARS);

  const isPreScreened = preScreenReceipt(email.from, email.subject);

  const emailContent = `Subject: ${email.subject}
From: ${email.from}
Date: ${email.date}

${truncatedBody}`;

  const userPrompt = isPreScreened
    ? `This email has been confirmed as a purchase receipt based on its sender and subject. Set is_receipt to true and extract all items and pricing.\n\n${emailContent}`
    : `Parse this email and extract purchase data:\n\n${emailContent}`;

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;

  let lastError;
  let rawText = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      }

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      // Retry on overload (529) or server errors (5xx)
      if (response.status === 529 || (response.status >= 500 && response.status < 600)) {
        lastError = new Error(`Anthropic API error (${response.status}): overloaded`);
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${text}`);
      }

      const data = await response.json();
      rawText = data.content?.[0]?.text || '';
      break; // success — exit retry loop
    } catch (err) {
      lastError = err;
      // On last attempt let it fall through to the JSON-parsing block below
      // which has its own catch/fallback — don't re-throw here.
    }
  }

  try {
    if (!rawText && lastError) throw lastError;

    const parsed = extractJSON(rawText);
    const processingMs = Date.now() - startTime;

    // If pre-screened, we KNOW this is a receipt — don't let the AI override it
    if (isPreScreened) {
      parsed.is_receipt = true;
    }

    return {
      ...parsed,
      _meta: {
        messageId: email.messageId,
        subject: email.subject,
        from: email.from,
        date: email.date,
        rawResponse: rawText,
        processingMs,
        parseSuccess: true,
        preScreened: isPreScreened,
      },
    };
  } catch (err) {
    console.error('Receipt parsing failed:', err);
    // If this email was pre-screened we still mark it as a receipt so it
    // isn't silently dropped — items will be empty but the receipt is real.
    return {
      is_receipt: isPreScreened,
      retailer: isPreScreened ? (email.from || null) : null,
      order_id: null,
      order_date: null,
      items: [],
      subtotal: null,
      tax: null,
      total: null,
      shipping: null,
      confidence: isPreScreened ? 0.5 : 0,
      _meta: {
        messageId: email.messageId,
        subject: email.subject,
        from: email.from,
        date: email.date,
        error: err.message,
        processingMs: Date.now() - startTime,
        parseSuccess: false,
        preScreened: isPreScreened,
      },
    };
  }
}

/**
 * Returns true if the string appears to be HTML content.
 */
function looksLikeHTML(text) {
  return /<html|<body|<table|<div|<td/i.test(text.slice(0, 500));
}

/**
 * Strip HTML tags and decode common entities to produce clean plain text.
 */
function stripHTML(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extract JSON from Claude's response, handling markdown code fences.
 * @param {string} text
 * @returns {object}
 */
function extractJSON(text) {
  // Try to parse directly
  try {
    return JSON.parse(text.trim());
  } catch (_) {}

  // Try to extract from markdown code blocks
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch (_) {}
  }

  // Try to find JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_) {}
  }

  // Return a parse error result
  return {
    is_receipt: false,
    retailer: null,
    order_id: null,
    order_date: null,
    items: [],
    subtotal: null,
    tax: null,
    total: null,
    shipping: null,
    confidence: 0,
    _parseError: true,
    _rawText: text.slice(0, 500),
  };
}
