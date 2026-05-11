import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, ChevronDown, ChevronUp, Gift, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_BRAND, RETAILER_CONFIG } from '../config/constants';
import { PointsCounter } from '../components/PointsCounter';

const FAQS = [
  {
    q: 'What email data is accessed?',
    a: 'We only read purchase confirmation emails. We scan for emails from retailers like Walmart, Target, and Amazon — nothing else. We never read personal emails, attachments, or any other content.',
  },
  {
    q: 'Can I revoke access at any time?',
    a: 'Yes. You can disconnect your email at any time from your account settings. We immediately stop scanning and delete any stored data associated with your email.',
  },
  {
    q: 'Which retailers are supported?',
    a: 'We currently support Walmart, Target, Amazon, Best Buy, Kohl\'s, Sephora, Ulta, Chewy, Home Depot, and Lowe\'s. We\'re constantly adding new retailers.',
  },
  {
    q: 'How are my points calculated?',
    a: 'Points are calculated based on the brand purchased and the purchase amount. Different brands have different points rates (typically 5–12 points per dollar). You\'ll see the exact rate for each brand in the app.',
  },
];

const RETAILER_LOGOS = ['walmart', 'target', 'amazon', 'bestbuy', 'sephora', 'chewy'];

function TrustIndicators() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
        <Lock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-gray-900">Read-only access</div>
          <div className="text-xs text-gray-500 mt-0.5">We never modify, delete, or send emails from your account.</div>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-4">
        <Shield size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-gray-900">Encrypted & private</div>
          <div className="text-xs text-gray-500 mt-0.5">Your data is encrypted at rest and never sold to third parties.</div>
        </div>
      </div>
    </div>
  );
}

function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="space-y-2 mt-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Frequently Asked Questions</h3>
      {FAQS.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <span>{faq.q}</span>
            {openIdx === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function RetailerRow() {
  return (
    <div className="flex items-center gap-3 flex-wrap my-4">
      {RETAILER_LOGOS.map((key) => {
        const cfg = RETAILER_CONFIG[key];
        return (
          <span
            key={key}
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
          >
            {cfg.emoji} {cfg.displayName}
          </span>
        );
      })}
    </div>
  );
}

export function Enrollment() {
  const navigate = useNavigate();
  const { scenario } = useApp();
  const [omnichannelEnabled, setOmnichannelEnabled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <AnimatePresence mode="wait">
        {scenario === 'A' ? (
          <motion.div
            key="scenario-a"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scenario A: Retroactive existing member */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {DEMO_BRAND.existingMemberName[0]}
                </div>
                <div>
                  <div className="text-xs text-gray-500">Welcome back</div>
                  <div className="font-bold text-gray-900">{DEMO_BRAND.existingMemberName}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">{DEMO_BRAND.loyaltyProgram}</div>
                  <div className="flex items-baseline gap-1">
                    <PointsCounter value={DEMO_BRAND.existingMemberPoints} size="sm" className="text-[#F97316]" animated />
                    <span className="text-xs text-gray-500">pts</span>
                  </div>
                </div>
              </div>

              {/* Omnichannel announcement banner */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2a4f82] rounded-xl p-5 text-white mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎉</span>
                  <span className="text-xs font-semibold bg-orange-500 px-2 py-0.5 rounded-full">Just Launched</span>
                </div>
                <h2 className="font-bold text-lg mb-2">Earn rewards everywhere you shop</h2>
                <p className="text-blue-200 text-sm mb-4">
                  We found that many {DEMO_BRAND.name} fans also buy our products at Walmart, Target, and Amazon.
                  Now you can earn {DEMO_BRAND.loyaltyProgram} points on ALL those purchases — automatically.
                </p>
                <div className="flex items-center gap-2 text-blue-200 text-xs">
                  <Users size={12} />
                  <span>Join 10,000+ members already earning cross-retailer points</span>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-1">Works with your favorite retailers:</p>
                <RetailerRow />
              </div>

              <TrustIndicators />
              <FAQAccordion />

              <button
                onClick={() => navigate('/connect')}
                className="mt-6 w-full bg-[#F97316] hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-md"
              >
                Connect Your Email & Start Earning →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scenario-b"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scenario B: New signup */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-2xl mb-4 text-3xl">
                  🎁
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Join {DEMO_BRAND.loyaltyProgram}</h1>
                <p className="text-gray-500 text-sm">
                  Earn points on every {DEMO_BRAND.name} purchase — wherever you shop.
                </p>
              </div>

              {/* Sign-up form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                </div>
              </div>

              {/* Omnichannel toggle */}
              <div className="border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🔓</span>
                      <span className="text-sm font-semibold text-gray-900">Unlock Omnichannel Rewards</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Optional</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Connect your Gmail to automatically earn points on {DEMO_BRAND.name} purchases from any retailer.
                      Read-only access — we never modify your email.
                    </p>
                  </div>
                  <button
                    onClick={() => setOmnichannelEnabled((o) => !o)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                      omnichannelEnabled ? 'bg-[#F97316]' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        omnichannelEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {omnichannelEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 mb-2">Works with purchases from:</p>
                        <RetailerRow />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <TrustIndicators />
              <FAQAccordion />

              <button
                onClick={() => navigate(omnichannelEnabled ? '/connect' : '/scan')}
                className="mt-6 w-full bg-[#F97316] hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-md"
              >
                {omnichannelEnabled ? 'Create Account & Connect Email →' : 'Create Account →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
