'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrustAndSafetyPage() {
  const [reportCategory, setReportCategory] = useState('brokerage_demand');
  const [pgName, setPgName] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportedTicket, setReportedTicket] = useState<string | null>(null);

  const pillars = [
    {
      step: '01',
      title: 'Physical On-Ground Inspection',
      desc: 'Our certified field officers visit every PG in person to inspect room ventilation, clean water purifiers, washroom hygiene, Wi-Fi speed, and actual room dimensions.',
      icon: 'pin_drop',
    },
    {
      step: '02',
      title: 'Landlord & Document Verification',
      desc: 'Owners must furnish government-issued ID proofs, municipal property tax receipts, electricity bills, and fire department NOCs before listing approval.',
      icon: 'verified',
    },
    {
      step: '03',
      title: 'Safety & Surveillance Standards',
      desc: 'Mandatory operational CCTV in public entryways, functional fire extinguishers on every floor, secure main gate locks, and 24/7 warden availability for student hostels.',
      icon: 'videocam',
    },
    {
      step: '04',
      title: 'Continuous Resident Auditing',
      desc: 'Only students who have booked visits or lived in a PG can submit verified reviews. Listings with sub-standard ratings trigger immediate spot audits.',
      icon: 'rate_review',
    },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = 'TRT-' + Math.floor(100000 + Math.random() * 900000);
    setReportedTicket(ticketId);
  };

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-[80ch] mx-auto flex flex-col items-center gap-6 mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-deep-green text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          Trust &amp; Safety Hub
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-deep-green font-bold leading-tight tracking-tight">
          Your Safety &amp; Peace of Mind Is Our Highest Standard
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
          From mandatory on-ground inspections to zero-brokerage enforcement, explore how PGFinder creates India’s most reliable student accommodation network.
        </p>
      </section>

      {/* 4 Pillars of Verification */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-[60ch] mx-auto flex flex-col gap-2">
          <h2 className="font-headline-md text-3xl font-bold text-primary">The 4-Pillar Verification Pipeline</h2>
          <p className="text-sm text-on-surface-variant">Every single property goes through our rigorous 4-step compliance check.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-outline-variant shadow-level-1 flex flex-col gap-4 relative overflow-hidden group hover:shadow-level-2 transition-all">
              <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md w-fit">
                STAGE {p.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-deep-green border border-emerald-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {p.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-primary">{p.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Student Safety Guarantees & Hotline */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-outline-variant shadow-level-1 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Student Protection</span>
          <h2 className="font-headline-md text-3xl font-bold text-primary leading-snug">
            Immediate Action Against Fraud, Harassment, or False Listings
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We maintain zero tolerance for predatory behavior. If an owner attempts to charge hidden broker fees, misrepresents room amenities, or engages in inappropriate behavior, our dedicated Trust Team intervenes within 4 hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-700 text-2xl">lock</span>
              <div>
                <h4 className="text-xs font-bold text-primary">Identity Masking</h4>
                <p className="text-[11px] text-on-surface-variant">Your docs are never shared publicly</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-700 text-2xl">support_agent</span>
              <div>
                <h4 className="text-xs font-bold text-primary">24/7 Rapid Escalation</h4>
                <p className="text-[11px] text-on-surface-variant">Toll-free student helpline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-[#173822] text-white rounded-2xl p-8 flex flex-col gap-6 shadow-level-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </span>
            <div>
              <h3 className="font-bold text-lg text-white">Emergency Student Helpline</h3>
              <p className="text-xs text-white/70">Available 24 hours a day, 7 days a week</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-2 border border-white/15">
            <span className="text-xs text-white/80 font-medium">Toll-Free Priority Line</span>
            <span className="text-2xl md:text-3xl font-mono font-bold text-emerald-200">
              1800-743-4633
            </span>
            <span className="text-[11px] text-white/60">Press 1 for immediate emergency response, Press 2 for fraud escalation.</span>
          </div>

          <div className="flex flex-col gap-1 text-xs text-white/80">
            <span>Direct Email: <strong className="text-white">safety@pgfinder.com</strong></span>
            <span>Response SLA: <strong>Within 30 minutes for emergency flags</strong></span>
          </div>
        </div>
      </section>

      {/* Incident / Suspicious Listing Reporting Form */}
      <section id="report" className="bg-white rounded-3xl p-8 md:p-10 border border-outline-variant shadow-level-1 flex flex-col gap-6 max-w-3xl mx-auto w-full scroll-mt-24">
        <div className="border-b border-outline-variant pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Grievance &amp; Redressal</span>
          <h2 className="font-headline-md text-2xl font-bold text-primary mt-1">
            Report a Suspicious PG or Safety Concern
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            All reports are strictly confidential. Our trust officers immediately investigate reported properties.
          </p>
        </div>

        {!reportedTicket ? (
          <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-deep-green">Reason for Report *</label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
              >
                <option value="brokerage_demand">Demanding Unlawful Brokerage Commission</option>
                <option value="fake_photos">Photos / Amenities Do Not Match Reality</option>
                <option value="unauthorized_owner">Unverified or Suspicious Landlord Identity</option>
                <option value="hygiene_fire">Severe Fire / Hygiene Safety Violation</option>
                <option value="harassment">Harassment or Inappropriate Behavior</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-deep-green">PG Name &amp; Location *</label>
              <input
                type="text"
                required
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                placeholder="e.g. Green Valley PG, Near North Campus"
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-deep-green">Describe the Incident / Evidence *</label>
              <textarea
                required
                rows={4}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide details about what happened, phone numbers involved, or discrepancy noted..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-deep-green">Your Phone / Email (for investigation updates)</label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="you@university.edu or +91 98765..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer mt-2"
            >
              Submit Safety Report
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-deep-green">Incident Logged Securely</h3>
            <p className="text-sm text-on-surface-variant max-w-sm w-full mx-auto">
              Thank you for keeping our community safe. Your report for <strong className="text-primary">{pgName}</strong> has been escalated to our Trust &amp; Safety Officers.
            </p>
            <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-lg text-xs font-mono font-bold text-deep-green">
              Tracking Ticket: {reportedTicket}
            </div>
            <p className="text-xs text-on-surface-variant">
              An on-ground compliance officer will inspect the property within 4 business hours.
            </p>
            <button
              onClick={() => { setReportedTicket(null); setPgName(''); setReportDetails(''); }}
              className="bg-deep-green text-white font-bold text-sm px-6 py-2.5 rounded-xl mt-2 cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
