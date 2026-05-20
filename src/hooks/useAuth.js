import { useState, useCallback, useEffect, useRef } from 'react';
import { initTokenClient, requestAccessToken, revokeToken, fetchUserInfo, isGISAvailable } from '../services/auth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function useAuth() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authState, setAuthState] = useState('idle'); // idle | loading | success | error
  const [authError, setAuthError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    let resolved = false;

    const handleResult = (email, status) => {
      if (resolved) return;
      resolved = true;
      if (status === 'success') {
        if (email) setUserInfo({ email });
        setToken('live-oauth-token');
        setAuthState('success');
      }
    };

    let bc;
    try {
      bc = new BroadcastChannel('oauth_channel');
      bc.onmessage = (e) => handleResult(e.data.email, e.data.status);
    } catch (_) {}

    const onStorage = (e) => {
      if (e.key === 'oauth_result' && e.newValue) {
        try {
          const { email, status } = JSON.parse(e.newValue);
          handleResult(email, status);
        } catch (_) {}
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Initialize GIS token client once GIS is ready
  const initClient = useCallback(() => {
    if (!CLIENT_ID) return;
    if (!isGISAvailable()) return;

    clientRef.current = initTokenClient(
      CLIENT_ID,
      async (tokenResponse) => {
        setToken(tokenResponse.access_token);
        setAuthState('success');
        try {
          const info = await fetchUserInfo(tokenResponse.access_token);
          setUserInfo(info);
        } catch (err) {
          console.warn('Could not fetch user info:', err);
        }
      },
      (error) => {
        console.error('OAuth error:', error);
        setAuthError(error.message || error.type || 'Authentication failed');
        setAuthState('error');
      }
    );
  }, []);

  useEffect(() => {
    if (isGISAvailable()) {
      initClient();
      return;
    }

    const interval = setInterval(() => {
      if (isGISAvailable()) {
        clearInterval(interval);
        initClient();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [initClient]);

  const login = useCallback(() => {
    if (!clientRef.current) {
      initClient();
      setTimeout(() => {
        if (clientRef.current) {
          setAuthState('loading');
          requestAccessToken();
        }
      }, 500);
      return;
    }
    setAuthState('loading');
    setAuthError(null);
    requestAccessToken();
  }, [initClient]);

  const loginWithLiveOAuth = useCallback((authorizeUrl) => {
    setAuthState('loading');
    setAuthError(null);

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      authorizeUrl,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );
  }, []);

  const logout = useCallback(() => {
    if (token && token !== 'live-oauth-token') {
      revokeToken(token, () => {});
    }
    setToken(null);
    setUserInfo(null);
    setAuthState('idle');
    setAuthError(null);
  }, [token]);

  return {
    token,
    userInfo,
    authState,
    authError,
    isAuthenticated: Boolean(token),
    login,
    loginWithLiveOAuth,
    logout,
  };
}
