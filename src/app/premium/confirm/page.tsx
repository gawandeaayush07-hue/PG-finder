'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmPurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'Yearly';
  const isMonthly = planParam.toLowerCase() === 'monthly';

  const planTitle = isMonthly ? 'Monthly Premium' : 'Yearly Premium';
  const durationText = isMonthly ? '30 days' : '365 days';
  const price = isMonthly ? 10 : 30;
  const originalPrice = isMonthly ? 49 : 120;
  const discount = originalPrice - price;
  
  const today = new Date();
  const expiryDate = new Date();
  if (isMonthly) {
    expiryDate.setDate(today.getDate() + 30);
  } else {
    expiryDate.setFullYear(today.getFullYear() + 1);
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleProceed = () => {
    if (!agreedToTerms) {
      alert('Please accept the student terms to proceed.');
      return;
    }
    router.push(`/premium/checkout?plan=${encodeURIComponent(isMonthly ? 'Monthly' : 'Yearly')}&amount=${price}`);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop py-6 lg:py-10">
      {/* Breadcrumb & Top Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 font-label-md text-sm text-on-surface-variant">
          <Link href="/premium" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Premium Plans</span>
          </Link>
          <span className="text-outline-variant font-headline-md leading-none">/</span>
          <span className="text-primary font-semibold">Confirm Order</span>
        </nav>
        <div className="flex items-center gap-1.5 bg-secondary-container/60 px-4 py-1.5 rounded-full border border-outline-variant/30">
          <span className="material-symbols-outlined text-on-secondary-container text-[16px]">lock</span>
          <span className="font-label-sm text-xs text-on-secondary-container font-medium">
            End-to-End Secure Transaction
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-1.5 text-secondary font-label-sm text-xs uppercase tracking-widest font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          Final Step Before Activation
        </div>
        <h1 className="font-display-lg text-3xl md:text-4xl text-primary font-bold tracking-tight">
          Confirm your Premium purchase
        </h1>
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-1">
          Review your selected one-time plan and access details before moving to secure checkout.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Plan Review & Features (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Selected Plan Review Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-outline-variant/40 p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-10">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs tracking-wide uppercase font-semibold">
                {isMonthly ? '30 Days Access' : 'Best Value • 365 Days'}
              </span>
              <div className="flex items-center gap-1 text-secondary font-label-sm text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Student Subsidized Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 relative z-10 mb-5">
              <div>
                <h2 className="font-headline-lg text-2xl lg:text-3xl text-primary font-bold tracking-tight">
                  {planTitle}
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                  {durationText} of uninterrupted Premium access
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-3xl lg:text-4xl font-extrabold text-primary">₹{price}</span>
                <span className="font-label-md text-sm text-on-surface-variant">/ {isMonthly ? 'month' : 'year'}</span>
              </div>
            </div>

            {/* Validity Timeline Capsule */}
            <div className="bg-surface-container-low rounded-xl p-4 mb-4 flex items-start gap-3.5 relative z-10 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-medium">
                  Access Duration
                </span>
                <span className="font-body-md text-sm text-on-surface font-semibold mt-0.5">
                  Active from today until {formatDate(expiryDate)}
                </span>
                <span className="font-label-sm text-xs text-secondary mt-0.5 font-medium">
                  Instant unlock upon successful payment
                </span>
              </div>
            </div>

            {/* Access Stacking Notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface-container-high/60 relative z-10 border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                layers
              </span>
              <p className="font-label-md text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface font-semibold">Already have active days?</strong> This purchase adds{' '}
                <span className="text-primary font-bold">+{durationText}</span> to your existing expiry date without losing any remaining access.
              </p>
            </div>
          </div>

          {/* Included Features Checklist */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-outline-variant/40 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline-md text-lg font-bold text-primary">Included Features</h3>
              <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-medium">
                5 Exclusive Perks
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-semibold">Advanced housing search filters</p>
                  <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Filter instantly by meal menus, night curfew, furnishing tier, and generator power backup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-semibold">Unlimited saved residences & comparisons</p>
                  <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Compare security deposits, meal inclusion, and gate timings side-by-side without limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-semibold">3-Hour pre-release notification drops</p>
                  <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Receive instant alerts when seniors vacate high-demand single rooms before public listing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-semibold">Direct verified landlord mobile contacts</p>
                  <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    No middlemen brokers or commission cuts. Contact landlords and property wardens directly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
                <div>
                  <p className="font-body-md text-sm text-on-surface font-semibold">Student safety advocate & deposit mediation</p>
                  <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                    Dedicated support desk to resolve check-in disputes and ensure full deposit return integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Payment Gateway CTA (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/50 p-6 lg:p-7 sticky top-24">
            <h3 className="font-headline-md text-xl font-bold text-primary mb-4 pb-3 border-b border-outline-variant/30">
              Order Summary
            </h3>

            <div className="space-y-3 font-label-md text-sm">
              <div className="flex justify-between items-center text-on-surface">
                <span className="font-medium">{planTitle} ({durationText})</span>
                <span className="font-semibold">₹{originalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_offer</span>
                  Student Subsidy Rebate
                </span>
                <span className="font-semibold">-₹{discount}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Platform & Gateway Fee</span>
                <span className="text-secondary font-medium">₹0 (Waived)</span>
              </div>
            </div>

            <div className="my-4 pt-4 border-t border-outline-variant/40 flex justify-between items-baseline">
              <div>
                <span className="font-headline-md text-base font-bold text-primary block">Total Amount</span>
                <span className="font-label-sm text-xs text-on-surface-variant">One-Time Non-Recurring</span>
              </div>
              <div className="text-right">
                <span className="font-display-lg text-3xl font-extrabold text-primary">₹{price}</span>
                <span className="font-label-sm text-xs text-on-surface-variant block">All taxes included</span>
              </div>
            </div>

            {/* Student ID Verification Pill */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 mb-5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">Billed to:</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-semibold">
                  Verified Student
                </span>
              </div>
              <div className="font-label-md text-sm font-semibold text-primary">Aarav Sharma</div>
              <div className="font-label-sm text-xs text-on-surface-variant">aarav.sharma@dtu.ac.in</div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer mb-5 text-xs text-on-surface-variant">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-primary accent-primary focus:ring-primary"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-primary underline hover:text-secondary">
                  Terms of Service
                </Link>{' '}
                and understand this is a prepaid one-time pass with no recurring fees.
              </span>
            </label>

            {/* Main Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Proceed to Secure Gateway</span>
              </button>

              <Link
                href="/premium"
                className="w-full py-2.5 rounded-xl border border-outline-variant text-center font-label-md text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors block"
              >
                Choose a different plan
              </Link>
            </div>

            {/* Security Guarantee Micro-badges */}
            <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-center gap-4 text-on-surface-variant font-label-sm text-xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">encrypted</span>
                256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                NPCI / RBI Rail
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPurchasePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Loading purchase details...</div>}>
      <ConfirmPurchaseContent />
    </Suspense>
  );
}
