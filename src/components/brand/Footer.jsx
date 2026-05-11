import { OrivaLogoWhite } from './Logo';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function TikTokIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.03-.09z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-800 text-cream-100">
      <div className="max-w-screen-xl mx-auto px-5 md:px-10 pt-10 pb-6 grid grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold mb-3">shop</div>
          <ul className="space-y-2 text-cream-100/70">
            <li>home</li>
            <li>about</li>
            <li>shop</li>
            <li>blog</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">policy</div>
          <ul className="space-y-2 text-cream-100/70">
            <li>terms & conditions</li>
            <li>privacy policy</li>
            <li>refund policy</li>
            <li>shipping policy</li>
            <li>accessibility statement</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">contact</div>
          <ul className="space-y-2 text-cream-100/70">
            <li>500 terry francine street</li>
            <li>san francisco, ca 94158</li>
            <li>info@mysite.com</li>
            <li>123-456-7890</li>
          </ul>
        </div>
      </div>

      {/* Bottom wordmark row */}
      <div className="border-t border-cream-100/10 px-5 md:px-10 pt-6 pb-8">
        <div className="flex items-center mb-4">
          <OrivaLogoWhite height={52} />
        </div>
        <div className="flex items-center gap-4 text-cream-100/70">
          <InstagramIcon size={18} />
          <FacebookIcon size={18} />
          <TikTokIcon size={17} />
        </div>
      </div>
    </footer>
  );
}
