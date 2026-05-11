// Google OAuth using Google Identity Services (GIS)
// The GIS library is loaded in index.html via <script src="https://accounts.google.com/gsi/client">

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

let tokenClient = null;

/**
 * Initialize the GIS token client. Must be called after the GIS library loads.
 * @param {string} clientId - Google OAuth client ID from env
 * @param {function} onSuccess - Called with the token response on success
 * @param {function} onError - Called with error info on failure
 */
export function initTokenClient(clientId, onSuccess, onError) {
  if (!window.google?.accounts?.oauth2) {
    onError({ message: 'Google Identity Services library not loaded' });
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GMAIL_SCOPE,
    callback: (response) => {
      if (response.error) {
        onError(response);
      } else {
        onSuccess(response);
      }
    },
    error_callback: (error) => {
      onError(error);
    },
  });

  return tokenClient;
}

/**
 * Prompt the user for OAuth consent and get an access token.
 */
export function requestAccessToken() {
  if (!tokenClient) {
    throw new Error('Token client not initialized. Call initTokenClient first.');
  }
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 * Revoke the access token (logout).
 * @param {string} accessToken
 * @param {function} callback
 */
export function revokeToken(accessToken, callback) {
  if (!window.google?.accounts?.oauth2) return;
  window.google.accounts.oauth2.revoke(accessToken, callback);
}

/**
 * Fetch basic user info (name, email, picture) using the access token.
 * @param {string} accessToken
 * @returns {Promise<{name, email, picture}>}
 */
export async function fetchUserInfo(accessToken) {
  const response = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  const data = await response.json();
  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    given_name: data.given_name,
  };
}

/**
 * Check if GIS library is available in window.
 */
export function isGISAvailable() {
  return Boolean(window.google?.accounts?.oauth2);
}
