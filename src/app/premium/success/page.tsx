'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Yearly';
  const amount = searchParams.get('amount') || (plan.toLowerCase() === 'monthly' ? '10' : '30');
  const method = searchParams.get('method') || 'UPI (Google Pay)';
  const txnId = searchParams.get('orderId')
    ? searchParams.get('orderId')!.replace('ORD', 'TXN')
    : `PGF-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

  const isMonthly = plan.toLowerCase() === 'monthly';
  const validityDays = isMonthly ? 30 : 365;

  const today = new Date();
  const expiry = new Date();
  if (isMonthly) {
    expiry.setDate(today.getDate() + 30);
  } else {
    expiry.setFullYear(today.getFullYear() + 1);
  }

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  return (
    <div className="relative w-full overflow-hidden pb-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[480px] pointer-events-none -z-10">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-gradient-to-b from-secondary-container/40 via-primary-fixed/20 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop pt-6 lg:pt-10">
        {/* Top Celebratory Hero */}
        <section className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center shadow-lg relative z-10 transition-transform duration-500 hover:scale-105">
              <span className="material-symbols-outlined text-primary text-[52px]" style={{ fontVariationSettings: "'wght' 600, 'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="absolute -inset-2 bg-secondary-fixed/50 rounded-full blur-md animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            <span>Order Confirmed • Instant Access Granted</span>
          </div>

          <h1 className="font-display-lg text-3xl md:text-5xl text-primary font-bold tracking-tight mb-2">
            Premium Activated!
          </h1>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-lg mb-4">
            Your PGFinder Premium student access is now active and ready to use.
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container-low text-secondary font-label-md text-xs font-medium border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            <span>One-time purchase — no automatic renewals or surprise deductions.</span>
          </div>
        </section>

        {/* Purchase Summary Card */}
        <section className="mt-10 max-w-xl mx-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/50 p-6 md:p-8 transition-all">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/30">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
                  Official Confirmation
                </span>
                <h2 className="font-headline-md text-lg font-bold text-primary mt-0.5">
                  Payment Receipt & Access Details
                </h2>
              </div>
              <div className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Completed • Verified</span>
              </div>
            </div>

            {/* Structured Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs md:text-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Selected Plan</span>
                <span className="font-headline-md text-base font-bold text-primary mt-0.5">{plan} Premium</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Amount Paid</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-md text-base font-bold text-primary">₹{amount}</span>
                  <span className="font-label-sm text-xs text-on-surface-variant font-mono">({method.split(' ')[0]})</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Access Validity</span>
                <span className="font-body-md text-sm font-semibold text-on-surface mt-0.5 flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-secondary text-[16px]">timelapse</span>
                  {validityDays} Days Unlocked
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Transaction Reference</span>
                <span className="font-body-md text-xs font-mono font-bold text-primary mt-0.5 truncate">{txnId}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Purchase Date</span>
                <span className="font-body-md text-xs text-on-surface font-medium mt-0.5">{formatDate(today)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-xs text-on-surface-variant">Expiry Date</span>
                <span className="font-body-md text-xs text-on-surface font-medium mt-0.5">{formatDate(expiry)}</span>
              </div>
            </div>

            {/* Access Extension Note */}
            <div className="mt-4 p-4 rounded-xl bg-primary-container/10 border border-primary-container/20 flex items-start gap-3">
              <div className="p-1 rounded-lg bg-primary-container text-on-primary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Your account now has <strong className="text-primary font-semibold">{validityDays} full days</strong> of priority search, direct landlord contact details, and custom comparisons unlocked across all campus zones.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/search"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Explore Verified PGs with Premium Perks</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>

              <button
                type="button"
                onClick={() => setReceiptModalOpen(true)}
                className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>View / Download GST Tax Receipt</span>
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/premium/history"
                  className="font-label-md text-xs text-secondary hover:text-primary transition-colors underline underline-offset-4"
                >
                  View My Premium Dashboard & Payment History
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Tax Receipt Modal */}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 md:p-8 shadow-level-2 border border-outline-variant text-left space-y-4 animate-pop-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
                <h3 className="font-headline-md text-lg font-bold text-primary">Official Tax Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-outline-variant/20 pb-1">
                <span>Invoice No:</span>
                <span className="font-bold">{txnId}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>Aarav Sharma (STU-88210)</span>
              </div>
              <div className="flex justify-between">
                <span>College:</span>
                <span>Delhi Tech Univ</span>
              </div>
              <div className="flex justify-between">
                <span>Item:</span>
                <span>{plan} Student Pass ({validityDays} Days)</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-1 font-bold text-primary">
                <span>Total Paid:</span>
                <span>₹{amount}.00 (Incl. 18% GST)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Receipt PDF downloaded to device storage.');
                  setReceiptModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Loading receipt...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
