import { useState, useCallback, useEffect, useRef } from 'react';
import { initTokenClient, requestAccessToken, revokeToken, fetchUserInfo, isGISAvailable } from '../services/auth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function useAuth() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authState, setAuthState] = useState('idle'); // idle | loading | success | error
  const [authError, setAuthError] = useState(null);
  const clientRef = useRef(null);

  // Initialize GIS token client once GIS is ready
  const initClient = useCallback(() => {
    if (!CLIENT_ID) {
      setAuthError('VITE_GOOGLE_CLIENT_ID is not set in .env');
      return;
    }

    if (!isGISAvailable()) {
      // GIS not loaded yet, retry shortly
      return;
    }

    clientRef.current = initTokenClient(
      CLIENT_ID,
      async (tokenResponse) => {
        setToken(tokenResponse.access_token);
        setAuthState('success');
        // Fetch user info
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

  // Poll for GIS availability after mount
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

  const logout = useCallback(() => {
    if (token) {
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
    logout,
  };
}
