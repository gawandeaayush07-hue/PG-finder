'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PremiumPlansPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState({ name: 'Yearly', amount: 30, duration: '365 Days' });
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  const openCheckout = (planName: 'Monthly' | 'Yearly', amount: number, duration: string) => {
    setModalPlan({ name: planName, amount, duration });
    setCheckoutModalOpen(true);
  };

  const handleProceedToCheckout = () => {
    setCheckoutModalOpen(false);
    router.push(`/premium/confirm?plan=${encodeURIComponent(modalPlan.name)}&amount=${modalPlan.amount}`);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero & Value Proposition */}
      <section className="relative w-full overflow-hidden py-8 md:py-16">
        {/* Subtle Ambient Green Blurs */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-[480px] h-[480px] rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
          {/* Top Title Area */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-sm font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              Verified Student Accommodations
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tight">
              Unlock PGFinder Premium
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
              Get more from PGFinder and make finding your next PG easier. Transparent student housing with direct landlord connections and zero hidden commissions.
            </p>

            {/* Guarantee Notice Pill */}
            <div className="w-full mt-4 p-5 lg:p-6 rounded-2xl bg-surface-container-lowest shadow-level-1 border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock_reset</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-base text-primary font-semibold">
                  One-Time Transparent Student Pass
                </span>
                <span className="font-body-md text-sm text-on-surface-variant">
                  Single payment only. Strictly no recurring billing, no auto-debit renewals, and absolutely zero surprise charges.
                </span>
              </div>
              <div className="sm:ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-xs font-medium">
                <span className="material-symbols-outlined text-[16px] text-secondary">shield_locked</span>
                Zero Auto-Renewal
              </div>
            </div>
          </div>

          {/* Pricing Cards Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">
            {/* CARD 1: Monthly Plan */}
            <div className="group relative rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-level-1 border border-outline-variant/50 hover:shadow-level-2 transition-all duration-300 flex flex-col justify-between">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-xs text-secondary uppercase tracking-wider font-semibold">
                    Flexible Short Stay
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs">
                    30 days access
                  </span>
                </div>
                <h2 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold mt-2">
                  Monthly Premium
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Single one-time payment of ₹10 for 30 full days.
                </p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display-lg text-4xl lg:text-5xl font-extrabold text-primary">₹10</span>
                  <span className="font-label-md text-sm text-on-surface-variant">/ flat one-off</span>
                </div>

                {/* Features Checklist */}
                <div className="mt-6 pt-5 bg-surface-container-low/60 -mx-6 lg:-mx-8 px-6 lg:px-8 rounded-xl space-y-3">
                  <div className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Included Perks:
                  </div>
                  <ul className="space-y-2.5 text-on-surface text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Full premium search access & smart filter suite</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Instant alerts for new listings 3 hours before public</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Unlimited saves & custom comparisons</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Direct verified owner phone access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => openCheckout('Monthly', 10, '30 Days')}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Premium</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <p className="text-center font-label-sm text-xs text-on-surface-variant mt-2.5">
                  No credit card auto-debit required
                </p>
              </div>
            </div>

            {/* CARD 2: Yearly Plan (Best Value) */}
            <div className="relative rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-level-2 border-2 border-emerald-600/30 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary to-primary rounded-t-2xl" />

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    Best Value
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-xs font-bold">
                    365 days access (Save 75%)
                  </span>
                </div>
                <h2 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold mt-2">
                  Yearly Premium
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Single one-time payment of ₹30 for an entire academic year.
                </p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display-lg text-4xl lg:text-5xl font-extrabold text-primary">₹30</span>
                  <span className="font-label-md text-sm text-on-surface-variant">/ full year (₹2.5/mo)</span>
                </div>

                {/* Features Checklist */}
                <div className="mt-6 pt-5 bg-surface-container-low/70 -mx-6 lg:-mx-8 px-6 lg:px-8 rounded-xl space-y-3">
                  <div className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Everything in Monthly, Plus:
                  </div>
                  <ul className="space-y-2.5 text-on-surface text-sm">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified_user
                      </span>
                      <span>Year-round PG move-in and room-switch insurance protection</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        support_agent
                      </span>
                      <span>Dedicated student concierge support & dispute mediation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        calendar_month
                      </span>
                      <span>Priority landlord inquiries & offline walkthrough bookings</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        description
                      </span>
                      <span>Official room inspection checklist & house rules repo</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => openCheckout('Yearly', 30, '365 Days')}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary-container text-on-primary font-label-md text-sm font-semibold shadow-lg hover:bg-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Get Premium Access</span>
                </button>
                <p className="text-center font-label-sm text-xs text-on-surface-variant mt-2.5">
                  Covers semester transitions & exam stay switches
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action / Active Plan Note */}
          <div className="mt-8 text-center flex items-center justify-center gap-6 flex-wrap">
            <Link
              href="/premium/history"
              className="inline-flex items-center gap-1.5 font-label-md text-sm text-secondary hover:text-primary transition-colors underline underline-offset-4"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              Have an active plan? View payment history & validity
            </Link>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <Link
              href="/premium/status"
              className="inline-flex items-center gap-1.5 font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">help_center</span>
              Payment troubleshooting desk
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Feature Showcase Bento Grid */}
      <section className="w-full py-12 lg:py-16 bg-surface-container-low rounded-3xl mt-8">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-semibold">
                Elevated Student Living
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold mt-1">
                Curated Exclusively for University Life
              </h2>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md">
              Avoid scams, broker fees, and noisy accommodations with verified student housing signals and direct owner connections.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-4">
                  <span className="material-symbols-outlined text-[24px]">tune</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Smart Student Filters</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  Pinpoint zero-brokerage stays, strict or flexible curfew hours, weekly mess menu varieties, and guaranteed 24/7 power backup.
                </p>
              </div>
              <div className="mt-6 pt-4 bg-surface rounded-xl p-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-medium">No Brokerage</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-medium">Veg/Non-Veg Mess</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-medium">Quiet Hours 10PM</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-medium">High-speed Wi-Fi</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-4">
                  <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Comparison Matrices</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  Save unlimited shortlisted residencies and align room sqft, electricity sub-meter policies, laundry charges, and food ratings side-by-side.
                </p>
              </div>
              <div className="mt-6 bg-surface rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant">
                  <span>Security Deposit</span>
                  <span className="font-semibold text-primary">1 Month vs 3 Months</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-3/4" />
                </div>
                <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant pt-1">
                  <span>Campus Distance</span>
                  <span className="font-semibold text-secondary">0.4 km vs 2.8 km</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed-variant mb-4">
                  <span className="material-symbols-outlined text-[24px]">pin_drop</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Campus Proximity Index</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  Verified walking distances, safe-route night walks, and campus transit shuttle stop scores mapped specifically for university scholars.
                </p>
              </div>
              <div className="mt-6 p-3.5 rounded-xl bg-surface flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">directions_walk</span>
                </div>
                <div>
                  <div className="font-label-md text-sm text-primary font-semibold">6 mins to University Gate #2</div>
                  <div className="font-label-sm text-xs text-on-surface-variant">Well-lit safe corridor route verified</div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-4">
                  <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Pre-Release Alerts</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  Receive automated WhatsApp and SMS drops the moment a senior vacates a high-demand single occupancy room before it is listed openly.
                </p>
              </div>
              <div className="mt-6 p-3.5 rounded-xl bg-surface flex items-center justify-between">
                <span className="font-label-sm text-xs text-on-surface-variant">Early Access Advantage</span>
                <span className="font-label-sm text-xs font-semibold text-secondary">3 Hours Headstart</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-4">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Direct Owner Dial</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  No middleman brokers or agency fees. Access the actual landlord or property warden’s direct mobile line along with scanned house rule handbooks.
                </p>
              </div>
              <div className="mt-6 p-3.5 rounded-xl bg-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-md text-xs text-primary font-medium">Aadhaar-verified property deeds</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-1 border border-outline-variant/40 flex flex-col justify-between hover-lift">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed-variant mb-4">
                  <span className="material-symbols-outlined text-[24px]">support</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-primary">Student Concierge</h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-2">
                  Have issues during check-in or recovering your security deposit? Our student advocates step in directly with your lease resolution.
                </p>
              </div>
              <div className="mt-6 p-3.5 rounded-xl bg-surface flex items-center justify-between">
                <span className="font-label-sm text-xs text-on-surface-variant">Deposit Mediation</span>
                <span className="px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                  Included
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo & Experience Showcase */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="rounded-2xl bg-surface-container-lowest p-6 lg:p-10 shadow-level-1 border border-outline-variant/40 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
                Campus Verified
              </div>
              <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold text-primary">
                Every PG visited in person. No bait-and-switch.
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Our campus scouts personally photograph rooms, measure ambient study noise levels, sample mess meals, and audit bathroom sanitization so you can reserve your spot with pure peace of mind.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="font-display-lg text-3xl font-extrabold text-primary">1,400+</div>
                  <div className="font-label-sm text-xs text-on-surface-variant font-medium mt-1">Verified Rooms</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="font-display-lg text-3xl font-extrabold text-primary">₹0</div>
                  <div className="font-label-sm text-xs text-on-surface-variant font-medium mt-1">Brokerage Paid</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md h-64 group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Sunlit minimalist student study room with large window"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCe8kFJ-IuglSUE2Hon68inNLhgPIyM_ys3H5QCUswoftEh-OHGWFqoyMnKW1H71Etn0CC_NCs4z6-yZkI2C6caG320IPCUwb96LMJMWKA7tE8sPvcY8hEwzIXU_yklIi4iaWxJkmL133V4H1fI52yZgxQdb2j12yymAcv9tUrgaK_P0PnUrMM3EU5KsJLIzv84XPzc8VxR0CmjI1KafpxZV1wqYmmNMtEY6u8hI0Wz_87MvbBt-D"
                />
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg font-label-sm text-xs text-primary font-semibold shadow-xs">
                  North Campus Study Room
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md h-64 group sm:-mt-4">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Warm welcoming shared student living room lounge"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdRFzyqXlcSGjv_S74cXIDkRK-J_ic-kQCfXAsDhDBwFCxuB6EyjsiE2wYbh57TEGWtLYyelforAT-yFAXyOc_v25Q_vD54iW3TwIekBSJ9dUyruu8MyTlYBAgcCjuXy8ljVAZ6Lgg-ZcscWLt2x_1nziaJbE5whwIGz7qhKxdM_wsghQ7oOvg88tZhO9AtKQ5MX9h0ONBZx9JuaRMepBC7lpI_OgNb66NUmZbtt-S8g55di0JZISU"
                />
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg font-label-sm text-xs text-primary font-semibold shadow-xs">
                  Community Common Room
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust, RBI Gateways & Security Section */}
      <section className="w-full py-12 lg:py-16 bg-surface-container-low rounded-3xl mb-8">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="rounded-2xl bg-surface-container-lowest p-6 lg:p-10 shadow-level-1 border border-outline-variant/40">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="material-symbols-outlined text-[36px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <h2 className="font-headline-lg text-2xl lg:text-3xl text-primary font-bold mt-2">
                100% Safe, Direct & Transparent
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-2">
                We built PGFinder so students never have to endure greedy brokers or suspicious payment links.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-surface border border-outline-variant/30">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <h4 className="font-label-md text-sm text-primary font-semibold">RBI-Authorized Gateways</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Processed via secure Indian payment channels: UPI (Google Pay, PhonePe, Paytm), RuPay/Visa/MasterCard, and NetBanking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-surface border border-outline-variant/30">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div>
                  <h4 className="font-label-md text-sm text-primary font-semibold">Instant Activation</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Your premium dashboard unlocks immediately upon checkout confirmation. No waiting, no manual activation token.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-surface border border-outline-variant/30">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed-variant shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </div>
                <div>
                  <h4 className="font-label-md text-sm text-primary font-semibold">Zero Surprise Renewals</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    We never store your card tokens for auto-debit. When your plan completes, your account simply pauses without cost.
                  </p>
                </div>
              </div>
            </div>

            {/* History and Extension Banner */}
            <div className="mt-8 pt-6 bg-surface-container-low/80 -mx-6 lg:-mx-10 px-6 lg:px-10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">receipt_long</span>
                <span className="font-body-md text-sm text-on-surface">Existing member or looking for tax invoice?</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/premium/history"
                  className="font-label-md text-sm text-secondary hover:text-primary transition-colors font-semibold"
                >
                  View past payment history
                </Link>
                <span className="text-outline-variant">•</span>
                <button
                  type="button"
                  onClick={() => openCheckout('Yearly', 30, '365 Days')}
                  className="font-label-md text-sm text-primary hover:text-primary-container transition-colors font-semibold cursor-pointer"
                >
                  Extend plan without losing days
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 md:p-8 shadow-level-2 border border-outline-variant text-center space-y-4 animate-pop-up">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <div>
              <h3 className="font-headline-md text-xl font-bold text-primary">
                Complete {modalPlan.name} Activation
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                One-time student pass with zero auto-renewal.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low text-left space-y-2 border border-outline-variant/30">
              <div className="flex justify-between font-label-md text-sm">
                <span className="text-on-surface-variant">Selected Tier:</span>
                <span className="font-semibold text-primary">{modalPlan.name} Student Pass</span>
              </div>
              <div className="flex justify-between font-label-md text-sm">
                <span className="text-on-surface-variant">Duration:</span>
                <span className="font-semibold text-primary">{modalPlan.duration}</span>
              </div>
              <div className="flex justify-between font-label-md text-sm">
                <span className="text-on-surface-variant">Amount Payable:</span>
                <span className="font-bold text-lg text-primary">₹{modalPlan.amount}</span>
              </div>
              <div className="flex justify-between font-label-sm text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
                <span>Billing Schedule:</span>
                <span className="font-semibold text-secondary">One-time (No recurring)</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Proceed to Secure Checkout
              </button>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="w-full py-2 rounded-xl font-label-md text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
