'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'Yearly';
  const isMonthly = planParam.toLowerCase() === 'monthly';

  const basePrice = isMonthly ? 10 : 30;
  const originalPrice = isMonthly ? 49 : 120;
  const planTitle = isMonthly ? 'Monthly Premium' : 'Yearly Premium';
  const durationText = isMonthly ? '30 Days' : '365 Days';

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cards' | 'netbanking' | 'wallets'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('Google Pay');
  const [upiId, setUpiId] = useState('aarav.sharma@okaxis');
  const [upiVerified, setUpiVerified] = useState(true);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4892');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState('Aarav Sharma');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallets State
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CAMPUS10' || promoCode.trim().toUpperCase() === 'FRESHER') {
      setPromoApplied(true);
      setPromoDiscount(2);
    } else if (promoCode.trim() !== '') {
      alert('Code is invalid or expired. Try "CAMPUS10" for campus discount!');
    }
  };

  const finalAmount = Math.max(1, basePrice - promoDiscount);

  const handlePayment = () => {
    router.push(
      `/premium/processing?plan=${encodeURIComponent(isMonthly ? 'Monthly' : 'Yearly')}&amount=${finalAmount}&method=${encodeURIComponent(
        paymentMethod === 'upi' ? `${selectedUpiApp} (${upiId})` : paymentMethod === 'cards' ? 'Debit/Credit Card' : paymentMethod === 'netbanking' ? selectedBank : selectedWallet
      )}`
    );
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop py-6 lg:py-10">
      {/* Stepper Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-xs">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold">1</span>
          <span className="text-primary font-semibold">Student Verification</span>
          <span className="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold">2</span>
          <span className="text-primary font-semibold">Plan Pick</span>
          <span className="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">3</span>
          <span className="text-on-surface font-bold">Secure Payment</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-secondary font-label-sm text-xs shadow-xs border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
          <span>Encrypted Gateway Active</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs mb-2 font-semibold">
          <span>Student Subsidized Rate</span>
          <span className="w-1 h-1 rounded-full bg-secondary" />
          <span>Valid for AY 2026-27</span>
        </div>
        <h1 className="font-display-lg text-3xl md:text-4xl text-primary font-bold tracking-tight">
          Secure Checkout
        </h1>
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-1">
          Complete your one-time payment of ₹{finalAmount} for {durationText} of PGFinder Premium.
        </p>
      </div>

      {/* Main Layout: 65% Left, 35% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left: Payment Methods (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Payment Selector Tabs Bar */}
          <div className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl shadow-level-1 border border-outline-variant/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
                <span className="font-headline-md text-lg font-bold text-primary">Select Payment Method</span>
              </div>
              <span className="font-label-sm text-xs text-secondary font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
                Instant Activation
              </span>
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
                <span>UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cards')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'cards'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
                <span>Net Banking</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wallets')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-label-md text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'wallets'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">wallet</span>
                <span>Wallets</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: UPI PANEL */}
          {paymentMethod === 'upi' && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-level-1 border border-outline-variant/40 flex flex-col gap-6 animate-pop-up">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">UPI Instant Checkout</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                    Zero transaction charges via any UPI certified mobile app.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold rounded-md">
                  Fastest
                </span>
              </div>

              {/* Popular UPI Apps */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface-variant mb-2.5">
                  Popular UPI Apps
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Google Pay', tag: 'One-tap flow', iconColor: 'text-blue-500' },
                    { name: 'PhonePe', tag: 'Recommended', iconColor: 'text-purple-600' },
                    { name: 'Paytm UPI', tag: 'Direct Link', iconColor: 'text-cyan-600' },
                    { name: 'BHIM', tag: 'Govt. Verified', iconColor: 'text-emerald-700' },
                  ].map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.name)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all text-center cursor-pointer border ${
                        selectedUpiApp === app.name
                          ? 'bg-secondary-container/30 border-secondary ring-2 ring-secondary/20'
                          : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-xs flex items-center justify-center mb-2 font-bold text-sm">
                        {app.name === 'Google Pay' && <span className="text-blue-600 font-bold">G</span>}
                        {app.name === 'PhonePe' && <span className="text-purple-600 font-bold">पे</span>}
                        {app.name === 'Paytm UPI' && <span className="text-cyan-600 font-bold text-xs">Paytm</span>}
                        {app.name === 'BHIM' && <span className="material-symbols-outlined text-emerald-700 text-[20px]">payments</span>}
                      </div>
                      <span className="font-label-md text-xs text-on-surface font-semibold">{app.name}</span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">{app.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual UPI ID Enter */}
              <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2.5 border border-outline-variant/30">
                <label className="font-label-md text-xs text-on-surface font-semibold flex items-center justify-between" htmlFor="upi-id-input">
                  <span>Or Enter VPA / UPI ID</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant font-normal">e.g. yourname@okhdfcbank</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                      alternate_email
                    </span>
                    <input
                      id="upi-id-input"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@bank"
                      className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-xl font-body-md text-sm text-on-surface outline-none border border-outline-variant/40 focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (upiId.includes('@')) {
                        setUpiVerified(true);
                      } else {
                        alert('Please enter a valid UPI VPA format (e.g. name@bank)');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold whitespace-nowrap hover:bg-primary-container transition-all shadow-xs cursor-pointer"
                  >
                    Verify & Save
                  </button>
                </div>
                {upiVerified && (
                  <div className="flex items-center gap-1.5 text-secondary font-label-sm text-xs mt-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Verified: Aarav Sharma (Axis Bank) - Ready for instant payment</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* METHOD 2: CARDS PANEL */}
          {paymentMethod === 'cards' && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-level-1 border border-outline-variant/40 flex flex-col gap-4 animate-pop-up">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">Debit / Credit Card</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                    RuPay, Visa, MasterCard, Maestro accepted. Zero convenience charges.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono">RuPay</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono">Visa</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono">MC</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• ••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-mono text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-mono text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 font-mono text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as on card"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* METHOD 3: NET BANKING PANEL */}
          {paymentMethod === 'netbanking' && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-level-1 border border-outline-variant/40 flex flex-col gap-4 animate-pop-up">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">Net Banking</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                    Direct redirection to your bank’s official secure login portal.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold rounded-md">
                  50+ Banks
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  'HDFC Bank',
                  'State Bank of India',
                  'ICICI Bank',
                  'Axis Bank',
                  'Kotak Mahindra',
                  'Punjab National Bank',
                ].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedBank === bank
                        ? 'bg-secondary-container/30 border-secondary ring-2 ring-secondary/20'
                        : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <span className="font-label-md text-xs font-bold text-primary block">{bank}</span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">Instant Link</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* METHOD 4: WALLETS PANEL */}
          {paymentMethod === 'wallets' && (
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-level-1 border border-outline-variant/40 flex flex-col gap-4 animate-pop-up">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">Digital Wallets</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                    Pay seamlessly using saved balances and student wallet vouchers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWallet(w)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedWallet === w
                        ? 'bg-secondary-container/30 border-secondary ring-2 ring-secondary/20'
                        : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <span className="font-label-md text-xs font-bold text-primary block">{w}</span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">One-click connect</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/50 p-6 sticky top-24">
            <h3 className="font-headline-md text-lg font-bold text-primary mb-4 pb-3 border-b border-outline-variant/30">
              Payment Summary
            </h3>

            <div className="space-y-3 font-label-md text-sm">
              <div className="flex justify-between items-center text-on-surface">
                <span className="font-medium">{planTitle}</span>
                <span className="font-semibold">₹{originalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  Student Rebate
                </span>
                <span className="font-semibold">-₹{originalPrice - basePrice}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span>
                    Promo ({promoCode.toUpperCase()})
                  </span>
                  <span className="font-semibold">-₹{promoDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-on-surface-variant">
                <span>GST & Gateway charges</span>
                <span className="text-secondary font-medium">₹0 (Included)</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="mt-4 pt-3 border-t border-outline-variant/30">
              <label className="block font-label-sm text-xs font-semibold text-on-surface-variant mb-1.5">
                Have a College Coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CAMPUS10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded-lg text-xs uppercase font-mono border border-outline-variant/30 outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-secondary-container text-on-secondary-container font-label-md text-xs font-semibold rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            </form>

            <div className="my-4 pt-4 border-t border-outline-variant/40 flex justify-between items-baseline">
              <div>
                <span className="font-headline-md text-base font-bold text-primary block">Total Payable</span>
                <span className="font-label-sm text-xs text-on-surface-variant">One-Time Non-Recurring</span>
              </div>
              <div className="text-right">
                <span className="font-display-lg text-3xl font-extrabold text-primary">₹{finalAmount}</span>
                <span className="font-label-sm text-xs text-secondary font-medium block">Instant activation</span>
              </div>
            </div>

            {/* Complete Payment CTA Button */}
            <button
              type="button"
              onClick={handlePayment}
              className="w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Pay ₹{finalAmount} Securely</span>
            </button>

            {/* Trust Badges */}
            <div className="mt-5 pt-4 border-t border-outline-variant/30 space-y-2 text-on-surface-variant text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span>RBI Authorized payment processor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">block</span>
                <span>Zero auto-debit guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-on-surface-variant">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
