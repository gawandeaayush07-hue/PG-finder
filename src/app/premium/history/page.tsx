'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PremiumHistoryPage() {
  const [invoices, setInvoices] = useState([
    {
      id: 'PGF-TXN-9482019',
      date: '29 Sep 2026',
      plan: 'Yearly Premium Pass (365 Days)',
      amount: '₹30.00',
      rail: 'UPI (Google Pay)',
      status: 'Active',
      validUntil: '29 Sep 2027',
    },
    {
      id: 'PGF-TXN-8824102',
      date: '15 Aug 2026',
      plan: 'Monthly Student Pass (30 Days)',
      amount: '₹10.00',
      rail: 'UPI (PhonePe)',
      status: 'Expired',
      validUntil: '14 Sep 2026',
    },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin-mobile lg:px-margin-desktop py-6 lg:py-10">
      {/* Top Breadcrumb & Indicator Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Account Dashboard</span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Aarav Sharma (STU-88210)</span>
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl text-primary font-bold tracking-tight">
            My Premium & Payment History
          </h1>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-1 max-w-2xl">
            Manage your active one-time access, track validity, and view past official tax receipts.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container/60 rounded-full border border-secondary-container">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-md text-xs text-primary font-bold">Active Full-Access</span>
          </div>
        </div>
      </div>

      {/* Active Subscription Card */}
      <section className="relative bg-surface-container-lowest rounded-2xl shadow-level-1 border border-outline-variant/40 p-6 lg:p-8 overflow-hidden mb-10">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary shadow-xs">
                <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-xl font-bold text-primary">Yearly Premium</h2>
                  <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold rounded-full">
                    Active • 365 Days Pass
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Full unlocked university housing privileges with prioritized direct landlord connects.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span className="font-label-sm text-xs text-secondary uppercase tracking-wider font-semibold">
                Remaining Validity
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display-lg text-3xl md:text-4xl text-primary font-bold tracking-tight">348</span>
                <span className="font-headline-md text-base text-secondary font-semibold">Days Left</span>
              </div>
            </div>
          </div>

          {/* 365-Day Validity Timeline */}
          <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-3 border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">timelapse</span>
                365-Day Validity Timeline
              </span>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span><strong>17 days</strong> elapsed (4.7%)</span>
                <span className="text-outline-variant">•</span>
                <span className="text-secondary font-semibold">95.3% remaining</span>
              </div>
            </div>

            <div className="w-full bg-surface-container-high rounded-full h-3 p-0.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '95.3%' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                <span className="font-label-sm text-xs text-on-surface-variant">Purchased On</span>
                <span className="font-body-md text-xs font-semibold text-primary mt-1">29 September 2026</span>
                <span className="font-label-sm text-[11px] text-outline">Verified instant activation</span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                <span className="font-label-sm text-xs text-on-surface-variant">Expiry Date</span>
                <span className="font-body-md text-xs font-semibold text-primary mt-1">29 September 2027</span>
                <span className="font-label-sm text-[11px] text-outline">Midnight (23:59 IST)</span>
              </div>
              <div className="flex flex-col bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/20">
                <span className="font-label-sm text-xs text-on-surface-variant">Billing Type</span>
                <span className="font-body-md text-xs font-semibold text-secondary mt-1">One-Time Non-Recurring</span>
                <span className="font-label-sm text-[11px] text-outline">Prepaid campus plan</span>
              </div>
            </div>
          </div>

          {/* Guarantee Callout + Extend CTA */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-surface-container-high/60 rounded-xl p-5 border border-outline-variant/30">
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-xs text-primary font-bold">One-Time Purchase Guarantee</span>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  This pass expires automatically on <strong>29 Sep 2027</strong>. There are strictly <strong>NO recurring subscriptions, auto-debits, or stored card mandates</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/premium"
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add More Days / Extend</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Official Payment Receipts Table */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-headline-md text-xl font-bold text-primary">Payment & Receipt Archive</h3>
            <p className="font-body-md text-xs text-on-surface-variant">
              Download GST-compliant tax invoices for campus reimbursements and student records.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-outline-variant/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-label-md uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Reference ID</th>
                  <th className="py-3.5 px-4 font-semibold">Plan Description</th>
                  <th className="py-3.5 px-4 font-semibold">Payment Rail</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 text-on-surface font-medium">{inv.date}</td>
                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">{inv.id}</td>
                    <td className="py-3.5 px-4 text-on-surface">{inv.plan}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{inv.rail}</td>
                    <td className="py-3.5 px-4 font-bold text-primary">{inv.amount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                          inv.status === 'Active'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-primary font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 border border-outline-variant/30"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-level-2 border border-outline-variant space-y-4 animate-pop-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-base font-bold text-primary">Tax Receipt • {selectedInvoice.id}</h3>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl text-xs space-y-2 font-mono border border-outline-variant/30">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Billed To:</span>
                <span>Aarav Sharma</span>
              </div>
              <div className="flex justify-between">
                <span>Item:</span>
                <span>{selectedInvoice.plan}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span>{selectedInvoice.rail}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-outline-variant/20 pt-1 text-primary">
                <span>Total Amount:</span>
                <span>{selectedInvoice.amount} (Taxes Paid)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Invoice ${selectedInvoice.id} downloaded.`);
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container cursor-pointer"
              >
                Download Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
