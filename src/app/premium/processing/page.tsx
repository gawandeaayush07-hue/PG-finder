'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get('plan') || 'Yearly';
  const amount = searchParams.get('amount') || (plan.toLowerCase() === 'monthly' ? '10' : '30');
  const method = searchParams.get('method') || 'UPI (aarav.sharma@okaxis)';
  const orderId = `PGF-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const [timeLeft, setTimeLeft] = useState(6);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to success
          router.push(
            `/premium/success?plan=${encodeURIComponent(plan)}&amount=${amount}&orderId=${orderId}&method=${encodeURIComponent(
              method
            )}`
          );
          return 0;
        }
        return prev - 1;
      });

      setProgress((prev) => Math.min(100, prev + 15));
    }, 1000);

    return () => clearInterval(timer);
  }, [plan, amount, method, orderId, router]);

  const handleSimulateSuccess = () => {
    router.push(
      `/premium/success?plan=${encodeURIComponent(plan)}&amount=${amount}&orderId=${orderId}&method=${encodeURIComponent(
        method
      )}`
    );
  };

  const handleSimulateFailure = () => {
    router.push(
      `/premium/status?state=failed&orderId=${orderId}&amount=${amount}&method=${encodeURIComponent(method)}`
    );
  };

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center px-margin-mobile py-8 md:py-16 overflow-hidden">
      {/* Ambient background depth elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/40 p-6 md:p-8 flex flex-col items-center animate-pop-up">
        {/* Live Progress Bar */}
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-primary h-full transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Spinner + Shield Animation */}
        <div className="relative flex items-center justify-center w-28 h-28 my-2">
          {/* Dual Rings SVG Spinner */}
          <svg className="absolute inset-0 w-full h-full animate-spin [animation-duration:3s]" fill="none" viewBox="0 0 100 100">
            <circle className="text-secondary-fixed stroke-[5]" cx="50" cy="50" opacity="0.35" r="42" stroke="currentColor" />
            <circle className="text-secondary stroke-[5]" cx="50" cy="50" r="42" stroke="currentColor" strokeDasharray="70 190" strokeLinecap="round" />
          </svg>
          <svg
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-spin [animation-duration:1.8s] [animation-direction:reverse]"
            fill="none"
            viewBox="0 0 100 100"
          >
            <circle className="text-primary stroke-[4]" cx="50" cy="50" r="40" stroke="currentColor" strokeDasharray="110 140" strokeLinecap="round" />
          </svg>

          {/* Pulsating Inner Shield Core */}
          <div className="relative w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center shadow-inner animate-pulse">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </div>
        </div>

        {/* Header & Subtitle */}
        <div className="text-center mt-4 mb-6">
          <h1 className="font-headline-md text-xl md:text-2xl font-bold text-primary tracking-tight">
            Processing your payment...
          </h1>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1 max-w-sm">
            Please wait while we securely verify your payment with your bank / UPI provider.
          </p>
        </div>

        {/* Transaction Details Bento Panel */}
        <div className="w-full bg-surface-container-low rounded-xl p-4 flex flex-col gap-2.5 mb-5 border border-outline-variant/30 text-xs md:text-sm">
          <div className="flex items-center justify-between py-1">
            <span className="font-label-md text-on-surface-variant">Order ID</span>
            <span className="font-label-md text-on-surface font-semibold tracking-wider font-mono">{orderId}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-label-md text-on-surface-variant">Plan</span>
            <span className="font-label-md text-on-surface font-semibold">{plan} Premium</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-label-md text-on-surface-variant">Payment Method</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">account_balance_wallet</span>
              <span className="font-label-md text-on-surface truncate max-w-[180px]">{method}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 mt-1 bg-surface-container rounded-lg px-3">
            <span className="font-label-md text-primary font-semibold">Amount to Pay</span>
            <span className="font-headline-md text-lg text-primary font-bold">
              ₹{amount}{' '}
              <span className="font-label-sm text-xs font-normal text-on-surface-variant">One-Time</span>
            </span>
          </div>
        </div>

        {/* Warning Alert Banner */}
        <div className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 mb-4">
          <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <p className="font-label-md text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold">Please do not close, refresh,</strong> or navigate back while this transaction is being verified.
          </p>
        </div>

        {/* Live Step Counter & Timer Status */}
        <div className="w-full flex items-center justify-center gap-2 text-center py-2 px-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          <p className="font-label-sm text-xs text-on-surface-variant">
            Awaiting bank authorization • Redirecting in <span className="font-bold text-primary">{timeLeft}s</span>
          </p>
        </div>

        {/* Quick Testing Helper Controls */}
        <div className="mt-6 pt-4 border-t border-outline-variant/20 w-full flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSimulateSuccess}
            className="w-full py-2 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
          >
            ⚡ Complete Payment Now (Instant Success)
          </button>
          <button
            type="button"
            onClick={handleSimulateFailure}
            className="w-full py-1.5 px-3 rounded-lg text-rose-700 text-xs hover:underline cursor-pointer"
          >
            Test Failure / Decline State
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Processing transaction...</div>}>
      <PaymentProcessingContent />
    </Suspense>
  );
}
