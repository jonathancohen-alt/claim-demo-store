import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function OAuthFlow() {
  const navigate = useNavigate();
  const { login, authState, authError, userInfo, isAuthenticated } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-advance after successful auth
  useEffect(() => {
    if (isAuthenticated && authState === 'success') {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate('/scan');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authState, navigate]);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gmail Connected!</h2>
            {userInfo && (
              <div className="flex items-center gap-3 justify-center mb-4">
                {userInfo.picture && (
                  <img src={userInfo.picture} alt="" className="w-8 h-8 rounded-full" />
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{userInfo.name}</div>
                  <div className="text-xs text-gray-500">{userInfo.email}</div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Great! We'll now scan your inbox for purchase confirmations from Walmart, Target, Amazon, and more.
            </p>
            <div className="bg-emerald-50 rounded-xl p-4 text-left mb-6">
              <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-2">
                <Lock size={14} />
                What we have access to:
              </div>
              <ul className="text-xs text-emerald-600 space-y-1">
                <li>✓ Read purchase confirmation emails from retailers</li>
                <li>✓ Extract order items and brand information</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-emerald-200">
                <div className="flex items-center gap-2 text-red-500 font-medium text-sm mb-1">
                  <Lock size={14} />
                  What we never access:
                </div>
                <ul className="text-xs text-red-400 space-y-1">
                  <li>✗ Personal or social emails</li>
                  <li>✗ Attachments or financial documents</li>
                  <li>✗ Ability to send or modify email</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Redirecting to scanner...
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Gmail</h1>
              <p className="text-sm text-gray-500">
                Grant read-only access to scan for purchase confirmation emails.
                You can revoke access at any time.
              </p>
            </div>

            {/* How it works */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">How it works:</h3>
              {[
                { icon: '🔍', step: 'We search for emails from retailers like Walmart, Target & Amazon' },
                { icon: '🤖', step: 'AI reads the receipts to identify brand purchases' },
                { icon: '🎁', step: 'Matched purchases earn points in your loyalty account' },
                { icon: '🔒', step: 'Read-only access — we never modify your email' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.step}</span>
                </div>
              ))}
            </div>

            {/* Trust */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 bg-blue-50 rounded-lg p-3">
              <Lock size={12} className="text-blue-500 flex-shrink-0" />
              <span>
                Uses Google's official OAuth 2.0 — your Gmail password is never shared with us.
                Scope: <code className="bg-blue-100 text-blue-700 px-1 rounded text-xs">gmail.readonly</code>
              </span>
            </div>

            {/* Error state */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700"
                >
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Connection failed</div>
                    <div className="text-xs mt-0.5 text-red-500">{authError}</div>
                    {authError.includes('VITE_GOOGLE_CLIENT_ID') && (
                      <div className="text-xs mt-1 text-red-400">
                        Add <code>VITE_GOOGLE_CLIENT_ID=your_client_id</code> to your .env file
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connect button */}
            <button
              onClick={login}
              disabled={authState === 'loading'}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {authState === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect with Google
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
            >
              Skip for now (demo without real data)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
