'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function StatusContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('state') === 'pending' ? 'pending' : 'failed';
  const orderId = searchParams.get('orderId') || 'PGF-ORD-892410';
  const amount = searchParams.get('amount') || '30';
  const method = searchParams.get('method') || 'UPI (Google Pay Express)';

  const [activeTab, setActiveTab] = useState<'failed' | 'pending'>(initialTab);
  const [checkingPending, setCheckingPending] = useState(false);
  const [pendingStatusMsg, setPendingStatusMsg] = useState<string | null>(null);

  const handleCheckPending = () => {
    setCheckingPending(true);
    setTimeout(() => {
      setCheckingPending(false);
      setPendingStatusMsg('Bank settlement query polled. Bank acknowledges transaction hold; resolution expected shortly.');
    }, 1200);
  };

  return (
    <div className="relative w-full overflow-hidden pb-12">
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
      <div className="absolute top-48 -right-24 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] w-full mx-auto px-margin-mobile lg:px-margin-desktop py-6 lg:py-10">
        {/* Top Header & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 text-secondary font-label-sm text-xs uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Transaction Clearance Desk
            </div>
            <h1 className="font-headline-lg text-2xl md:text-4xl font-bold text-primary tracking-tight">
              Transaction Status
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-2xl mt-0.5">
              Review the real-time outcome of your payment, diagnose authorization flags, or track pending bank settlement status.
            </p>
          </div>

          {/* Interactive State Toggle */}
          <div className="inline-flex p-1 bg-surface-container-high rounded-xl self-start md:self-auto border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setActiveTab('failed')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'failed'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-rose-600">error</span>
              <span>Payment Failed State</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-amber-700">hourglass_top</span>
              <span>Verification Pending State</span>
            </button>
          </div>
        </div>

        {/* STATE A: PAYMENT FAILED */}
        {activeTab === 'failed' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start animate-pop-up">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-level-1 border border-outline-variant/40 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-100/50 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 shadow-xs">
                    <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      cancel
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-label-sm text-[11px] rounded-md uppercase font-bold tracking-wide">
                        Transaction Declined
                      </span>
                      <span className="font-label-sm text-xs text-outline font-mono">Code: E-8902</span>
                    </div>
                    <h2 className="font-headline-lg text-xl md:text-2xl font-bold text-on-surface mt-1">
                      Payment Could Not Be Completed
                    </h2>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Your issuing bank could not complete authorization. No amount has been claimed by PGFinder, and Premium room access holds remain inactive.
                    </p>
                  </div>
                </div>

                {/* Failure Diagnostic Summary */}
                <div className="bg-surface-container-low rounded-xl p-4 md:p-6 mb-6 border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/20">
                    <span className="font-label-md text-xs font-bold text-on-surface tracking-wide">
                      Failure Diagnostic Summary
                    </span>
                    <span className="font-label-sm text-[11px] px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant font-mono">
                      GATEWAY_ACK_ERR
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="font-label-sm text-outline">Detected Reason</span>
                      <span className="font-label-md text-rose-700 font-semibold mt-1">
                        Bank authorization timeout or user cancelled in UPI app
                      </span>
                    </div>
                    <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="font-label-sm text-outline">Order Reference ID</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-body-md text-on-surface font-mono font-semibold">{orderId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(orderId);
                            alert('Order ID copied to clipboard!');
                          }}
                          className="text-secondary hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="font-label-sm text-outline">Attempted Sum</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-headline-md text-base font-bold text-primary">₹{amount}</span>
                        <span className="font-label-sm text-outline">(Instant Student Pass)</span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="font-label-sm text-outline">Payment Rail</span>
                      <div className="flex items-center gap-1.5 mt-1 text-on-surface font-label-md">
                        <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
                        <span>{method}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-secondary-container/40 rounded-lg flex items-start gap-2 border border-secondary-container">
                    <span className="material-symbols-outlined text-secondary shrink-0 text-[18px] mt-0.5">
                      verified_user
                    </span>
                    <p className="font-body-md text-xs text-on-secondary-fixed-variant leading-relaxed">
                      <strong className="font-semibold text-primary">Deposit Safety Guarantee:</strong> If money was deducted from your account, banks automatically reverse charges within 2–4 business days via NPCI clearance routines.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href="/premium/checkout"
                    className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-bold rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    <span>Try Again (Retry Payment)</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-2 border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    <span>Contact Payment Support</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border border-outline-variant/40">
                <h3 className="font-headline-md text-base font-bold text-primary mb-3">Quick Troubleshooting</h3>
                <ul className="space-y-2.5 text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check</span>
                    <span>Check that your bank's UPI server is responsive.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check</span>
                    <span>Ensure you approve the push notification inside Google Pay/PhonePe within 5 minutes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check</span>
                    <span>Try using Debit Card / Net Banking if UPI continues to experience bank downtime.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* STATE B: VERIFICATION PENDING */}
        {activeTab === 'pending' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start animate-pop-up">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-level-1 border border-outline-variant/40 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700 shadow-xs">
                    <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      hourglass_top
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-label-sm text-[11px] rounded-md uppercase font-bold tracking-wide">
                        Pending Bank Settlement
                      </span>
                      <span className="font-label-sm text-xs text-outline font-mono">Status: AWAITING_GATEWAY_SYNC</span>
                    </div>
                    <h2 className="font-headline-lg text-xl md:text-2xl font-bold text-on-surface mt-1">
                      Payment Verification in Progress
                    </h2>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Your bank has received your request. Final clearance confirmation is currently being polled from the payment rail.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-4 md:p-6 mb-6 border border-outline-variant/30 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="text-on-surface-variant block">Order ID</span>
                      <span className="font-mono font-bold text-primary text-sm mt-0.5 block">{orderId}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                      <span className="text-on-surface-variant block">Expected Settlement</span>
                      <span className="font-bold text-amber-800 text-sm mt-0.5 block">Within 10–15 minutes</span>
                    </div>
                  </div>

                  {pendingStatusMsg && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 mb-4">
                      {pendingStatusMsg}
                    </div>
                  )}

                  <p className="text-on-surface-variant leading-relaxed">
                    Once the bank transmits the clearance webhook, your Premium features will be enabled instantly without requiring another payment.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCheckPending}
                    disabled={checkingPending}
                    className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-bold rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${checkingPending ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                    <span>{checkingPending ? 'Polling Bank Server...' : 'Check Status Now'}</span>
                  </button>
                  <Link
                    href="/premium/history"
                    className="px-6 py-3 bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-2 border border-outline-variant/30"
                  >
                    <span>View Subscription History</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border border-outline-variant/40">
                <h3 className="font-headline-md text-base font-bold text-primary mb-3">Live WhatsApp Helpline</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Need immediate student clearance support? Send your Order ID directly to our 24/7 student billing desk.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hi%20PGFinder,%20I%20need%20help%20with%20Order%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Open WhatsApp Support</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Loading transaction status...</div>}>
      <StatusContent />
    </Suspense>
  );
}
