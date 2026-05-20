import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email') || '';
    const status = searchParams.get('status') || 'success';

    localStorage.setItem('oauth_result', JSON.stringify({ email, status }));

    try {
      const bc = new BroadcastChannel('oauth_channel');
      bc.postMessage({ email, status });
      bc.close();
    } catch (_) {}

    setTimeout(() => window.close(), 300);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
      <p className="text-gray-600 text-sm font-medium">Authentication complete</p>
      <p className="text-gray-400 text-xs">You can close this window.</p>
    </div>
  );
}
