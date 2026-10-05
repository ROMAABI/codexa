import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import { AlertCircle, Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  className?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => { requestAccessToken: () => void };
          initCodeClient: (config: any) => { requestCode: () => void };
        };
      };
    };
  }
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  mode = 'signin',
  className = '',
  onSuccess,
  onError,
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const tokenClientRef = useRef<any>(null);

  const clientId =
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
    '1081498184089-1l006vfl3375iuhs04c86g0v44fqud3j.apps.googleusercontent.com';

  // Initialize Google Identity Services SDK on mount
  useEffect(() => {
    const initGoogleServices = () => {
      if (!window.google?.accounts) return;

      try {
        // 1. Initialize Google ID Token / One Tap client
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response?.credential) {
              await handleAuthSuccess({ credential: response.credential });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // 2. Initialize Google OAuth2 Access Token Client (Standard Google Popup)
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              setLoading(false);
              setErrorMsg(tokenResponse.error_description || 'Google sign-in was cancelled');
              if (onError) onError(tokenResponse.error_description || 'Google sign-in was cancelled');
              return;
            }

            if (tokenResponse?.access_token) {
              await handleAuthSuccess({ accessToken: tokenResponse.access_token });
            }
          },
        });
      } catch (err) {
        console.warn('Google Identity Services init notice:', err);
      }
    };

    // If script already loaded
    if (window.google?.accounts) {
      initGoogleServices();
    } else {
      // Poll briefly for GIS script readiness
      const interval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(interval);
          initGoogleServices();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [clientId]);

  const handleAuthSuccess = async (payload: { credential?: string; accessToken?: string }) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      login(data.token, data.user);
      if (onSuccess) onSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Google authentication failed';
      setErrorMsg(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setErrorMsg(null);
    setLoading(true);

    // 1. If Google OAuth token client is initialized, launch official Google popup
    if (tokenClientRef.current) {
      try {
        tokenClientRef.current.requestAccessToken();
        return;
      } catch (e) {
        console.warn('Failed to launch Google token client:', e);
      }
    }

    // 2. Fallback to Google ID One Tap prompt
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setLoading(false);
          }
        });
        return;
      } catch (e) {
        console.warn('Failed to launch Google One Tap prompt:', e);
      }
    }

    // 3. Fallback to Google OAuth 2.0 Web Authorization Popup
    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;

    const popup = window.open(authUrl, 'google_oauth_popup', 'width=500,height=600,menubar=no,toolbar=no');
    if (!popup) {
      setLoading(false);
      setErrorMsg('Popup was blocked by your browser. Please enable popups for this site.');
      return;
    }

    // Poll popup for OAuth access token hash
    const pollTimer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(pollTimer);
          setLoading(false);
          return;
        }

        if (popup.location.href.includes(redirectUri)) {
          const hash = popup.location.hash;
          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            if (accessToken) {
              clearInterval(pollTimer);
              popup.close();
              handleAuthSuccess({ accessToken });
            }
          }
        }
      } catch (e) {
        // Cross-origin security error expected while on accounts.google.com
      }
    }, 500);
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/[0.12] hover:border-sky-500/50 dark:hover:border-sky-400/50 hover:bg-slate-50 dark:hover:bg-[#161f33] text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:shadow-[0_0_18px_rgba(56,189,248,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none group ${className}`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-sky-500 shrink-0" />
        ) : (
          /* Official Google 4-Color Vector Logo */
          <svg className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}

        <span>
          {loading
            ? 'CONNECTING TO GOOGLE...'
            : mode === 'signup'
            ? 'Sign up with Google'
            : 'Continue with Google'}
        </span>
      </button>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] font-mono text-rose-500 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;

