'use client';

import React, { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  /**
   * Change this number (for example count + 1) to get a fresh check. A captcha token can be used
   * only ONCE, so after any attempt the server has seen (even a failed one) the form must ask
   * for a new token.
   */
  resetSignal?: number;
}

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback': () => void;
  'expired-callback': () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(script);
  });
}

export default function TurnstileWidget({ onVerify, onError, onExpire, resetSignal }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const firstResetRun = useRef(true);

  // Keep the latest callbacks in a ref. The page creates new callback functions on every
  // redraw; if the widget depended on them it would be destroyed and rebuilt in a loop.
  const callbacksRef = useRef({ onVerify, onError, onExpire });
  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire };
  });

  // Build the widget ONCE (only rebuilt if the site key itself changes)
  useEffect(() => {
    if (!siteKey) return; // No key (e.g. local development): skip the check gracefully

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => callbacksRef.current.onVerify(token),
          'error-callback': () => callbacksRef.current.onError?.(),
          'expired-callback': () => callbacksRef.current.onExpire?.(),
        });
      })
      .catch(() => {
        callbacksRef.current.onError?.();
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore: the widget may already be gone
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  // Ask for a fresh token whenever the page bumps resetSignal (not on the very first render)
  useEffect(() => {
    if (firstResetRun.current) {
      firstResetRun.current = false;
      return;
    }
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore: the widget may already be gone
      }
    }
  }, [resetSignal]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
