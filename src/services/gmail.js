// Gmail REST API service
// Uses Bearer token from Google OAuth to call the Gmail API directly from the browser.
// No backend server required.

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/**
 * Search for receipt emails matching our query.
 * @param {string} accessToken - OAuth access token
 * @param {string} query - Gmail search query
 * @param {number} maxResults - Max number of messages to return
 * @returns {Promise<Array<{id, threadId}>>}
 */
export async function searchEmails(accessToken, query, maxResults = 50) {
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
  });

  const response = await fetch(`${GMAIL_API_BASE}/messages?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gmail search failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.messages || [];
}

/**
 * Fetch the full content of a single email message.
 * @param {string} accessToken
 * @param {string} messageId
 * @returns {Promise<{messageId, subject, from, date, body, snippet}>}
 */
export async function fetchEmailContent(accessToken, messageId) {
  const response = await fetch(
    `${GMAIL_API_BASE}/messages/${messageId}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch email ${messageId}: ${response.status}`);
  }

  const message = await response.json();

  // Extract headers
  const headers = message.payload?.headers || [];
  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  const subject = getHeader('Subject');
  const from = getHeader('From');
  const date = getHeader('Date');

  // Extract body (prefer HTML, fallback to plain text)
  const body = extractBody(message.payload);

  return {
    messageId,
    subject,
    from,
    date,
    body,
    snippet: message.snippet || '',
  };
}

/**
 * Recursively extract email body from MIME payload.
 * Prefers text/html, falls back to text/plain.
 * @param {object} payload - Gmail message payload
 * @returns {string} - Decoded body text
 */
function extractBody(payload) {
  if (!payload) return '';

  // Direct body (no parts)
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Multipart: search through parts
  if (payload.parts) {
    let htmlPart = null;
    let textPart = null;

    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        htmlPart = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/plain' && part.body?.data) {
        textPart = decodeBase64Url(part.body.data);
      } else if (part.mimeType?.startsWith('multipart/')) {
        // Recursively handle nested multipart
        const nested = extractBody(part);
        if (nested) {
          // Use nested result if we don't have a better one yet
          if (!htmlPart && !textPart) {
            textPart = nested;
          }
        }
      }
    }

    // Prefer plain text for parser clarity; fall back to HTML if needed
    return textPart || htmlPart || '';
  }

  return '';
}

/**
 * Decode base64url encoded string (Gmail uses base64url, not standard base64).
 * @param {string} encoded
 * @returns {string}
 */
function decodeBase64Url(encoded) {
  try {
    // Convert base64url to standard base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    // Decode UTF-8
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    console.warn('Failed to decode base64url:', e);
    return '';
  }
}

/**
 * Batch fetch multiple emails with progress callbacks.
 * @param {string} accessToken
 * @param {Array<{id}>} messageList - List from searchEmails
 * @param {function} onProgress - Called with (index, total, email) as each email is fetched
 * @param {number} delayMs - Delay between requests (default 300ms)
 * @returns {Promise<Array>}
 */
export async function fetchEmailBatch(accessToken, messageList, onProgress, delayMs = 300) {
  const results = [];

  for (let i = 0; i < messageList.length; i++) {
    const { id } = messageList[i];

    try {
      const email = await fetchEmailContent(accessToken, id);
      results.push(email);
      if (onProgress) onProgress(i + 1, messageList.length, email);
    } catch (err) {
      console.warn(`Failed to fetch email ${id}:`, err);
      results.push({ messageId: id, error: err.message, subject: 'Failed to fetch', from: '', date: '', body: '' });
      if (onProgress) onProgress(i + 1, messageList.length, null);
    }

    // Delay between requests to respect rate limits
    if (i < messageList.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  return results;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
