'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('info-collect');

  const sections = [
    { id: 'info-collect', label: '1. Information We Collect' },
    { id: 'info-usage', label: '2. How We Use Data' },
    { id: 'info-sharing', label: '3. Data Sharing & Disclosure' },
    { id: 'data-security', label: '4. Security & Storage' },
    { id: 'cookies-tracking', label: '5. Cookies & Tracking' },
    { id: 'student-rights', label: '6. Your Rights & Privacy Choices' },
    { id: 'grievance-contact', label: '7. Grievance Redressal' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-10">
      
      {/* Header Banner */}
      <section className="border-b border-outline-variant pb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-deep-green text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
            Legal &amp; Trust
          </div>
          <span className="text-xs font-medium text-on-surface-variant">Effective Date: September 1, 2026</span>
          <span className="text-xs font-medium text-on-surface-variant">• Version 2.4</span>
        </div>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-deep-green">
          PGFinder Privacy Policy
        </h1>
        <p className="text-base text-on-surface-variant max-w-[85ch] leading-relaxed">
          At PGFinder, we are committed to safeguarding student and property owner privacy. This Privacy Policy outlines how we collect, handle, protect, and process your personal information when you use our web platform and associated services.
        </p>
      </section>

      {/* Main Content Grid: Table of Contents + Policy Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-level-1 sticky top-28 flex flex-col gap-3">
            <h3 className="font-headline-md text-sm font-bold text-primary uppercase tracking-wider">
              Contents
            </h3>
            <nav className="flex flex-col gap-1.5">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-emerald-100/80 text-deep-green font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </nav>

            <hr className="border-outline-variant my-2" />
            <div className="bg-emerald-50 rounded-xl p-3 text-xs text-deep-green flex flex-col gap-1.5">
              <span className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                Data Promise
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                We never sell or rent your contact number or identity documents to third-party telemarketers or commercial advertisers.
              </p>
            </div>
          </div>
        </aside>

        {/* Legal Text Body */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-10 border border-outline-variant shadow-level-1 flex flex-col gap-12">
          
          {/* Section 1 */}
          <section id="info-collect" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">1</span>
              Information We Collect
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                We collect information directly from you when you register an account, browse PG listings, schedule in-person tours, or submit property listings for admin verification.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-primary">Student Account Details:</strong> Full name, university email address, contact phone number, college/institute name, and government ID for visit authorization.</li>
                <li><strong className="text-primary">Owner &amp; Property Documentation:</strong> Ownership title deeds, municipal NOC, electricity bills, property address, room photos, and bank account details for rental disbursement.</li>
                <li><strong className="text-primary">Platform Interaction Logs:</strong> Search filters (budget, food preference, AC/Non-AC), shortlisted properties, visit requests, and review ratings.</li>
                <li><strong className="text-primary">Technical Telemetry:</strong> Device IP address, browser type, operating system, and session cookies to ensure platform stability and session continuity.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="info-usage" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">2</span>
              How We Use Your Information
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>Your collected information is strictly utilized for the following operational requirements:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Facilitating direct, broker-free connections between genuine students and verified property owners.</li>
                <li>Executing mandatory 4-step physical and documentary verification for all new hostel/PG listings.</li>
                <li>Sending transactional booking confirmations, visit appointment reminders via SMS/email, and OTP authentication.</li>
                <li>Detecting and immediately terminating fraudulent listings, fake reviews, or spam accounts.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="info-sharing" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">3</span>
              Data Sharing &amp; Disclosure
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                We do not sell student or owner databases. Data is only shared in the following bounded contexts:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-primary">Confirmed Visit Requests:</strong> When a student books a tour slot, the property owner receives the student’s name and contact number solely for coordinate directions and gates entry.</li>
                <li><strong className="text-primary">Infrastructure Partners:</strong> Secure cloud hosting, SMS gateway providers (for OTPs), and CDN partners bound by strict confidentiality non-disclosure terms.</li>
                <li><strong className="text-primary">Legal Obligations:</strong> When strictly mandated by Indian law enforcement, court order, or national safety authorities.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="data-security" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">4</span>
              Security &amp; Storage
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                We implement industry-standard administrative, physical, and digital security measures to safeguard your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>All network communications are encrypted via 256-bit Transport Layer Security (TLS 1.3).</li>
                <li>Sensitive verification documents (e.g., Aadhaar, Land Deeds) are masked and stored in encrypted S3 buckets with strict short-lived signed URLs.</li>
                <li>Strict Role-Based Access Controls (RBAC) ensure only authorized compliance officers can review confidential owner documentation.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cookies-tracking" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">5</span>
              Cookies &amp; Tracking
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                PGFinder uses essential session cookies to remember your active persona, keep you logged into the dashboard, and store your shortlisted rooms. We do not use intrusive cross-site tracking cookies.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="student-rights" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">6</span>
              Your Rights &amp; Privacy Choices
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>You possess complete ownership over your data:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-primary">Right to Rectification:</strong> Edit your name, phone number, and preferences anytime in Account Settings.</li>
                <li><strong className="text-primary">Right to Deletion:</strong> Request permanent erasure of your account and associated visit logs by contacting privacy@pgfinder.com.</li>
                <li><strong className="text-primary">Data Export:</strong> Request a machine-readable archive of your saved listings and rental tour history.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="grievance-contact" className="flex flex-col gap-4 scroll-mt-28 bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
            <h2 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">7</span>
              Grievance Officer &amp; Contact
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              In accordance with the Information Technology Act 2000 and Digital Personal Data Protection Act, questions or grievances regarding data privacy may be directed to:
            </p>
            <div className="text-xs text-on-surface space-y-1 font-medium">
              <p><strong>Grievance Officer:</strong> Priyanshu Sharma</p>
              <p><strong>Email:</strong> privacy@pgfinder.com / grievance@pgfinder.com</p>
              <p><strong>Address:</strong> PGFinder Tech Hub, Sector 4, HSR Layout, Bengaluru, Karnataka - 560102</p>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
