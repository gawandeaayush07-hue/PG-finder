'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('terms-accept');

  const sections = [
    { id: 'terms-accept', label: '1. Acceptance & Eligibility' },
    { id: 'terms-scope', label: '2. Role of PGFinder' },
    { id: 'terms-students', label: '3. Student Tenant Terms' },
    { id: 'terms-owners', label: '4. Owner & Landlord Rules' },
    { id: 'terms-bookings', label: '5. Visits & Token Advances' },
    { id: 'terms-conduct', label: '6. Prohibited Activities' },
    { id: 'terms-liability', label: '7. Limitation of Liability' },
    { id: 'terms-disputes', label: '8. Governing Law & Disputes' },
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
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            Terms of Agreement
          </div>
          <span className="text-xs font-medium text-on-surface-variant">Effective Date: September 1, 2026</span>
          <span className="text-xs font-medium text-on-surface-variant">• Version 2.1</span>
        </div>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-deep-green">
          PGFinder Terms of Service
        </h1>
        <p className="text-base text-on-surface-variant max-w-[85ch] leading-relaxed">
          Please read these Terms of Service carefully before utilizing PGFinder. By accessing or using our website, listing properties, or booking student accommodations, you agree to be bound by these provisions.
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-level-1 sticky top-28 flex flex-col gap-3">
            <h3 className="font-headline-md text-sm font-bold text-primary uppercase tracking-wider">
              Clauses Overview
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
                <span className="material-symbols-outlined text-[16px]">handshake</span>
                Fair Platform Rules
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Zero brokerage fees, mandatory owner document verification, and strict anti-discrimination enforcement across all listings.
              </p>
            </div>
          </div>
        </aside>

        {/* Legal Text Body */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 md:p-10 border border-outline-variant shadow-level-1 flex flex-col gap-12">
          
          {/* Section 1 */}
          <section id="terms-accept" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">1</span>
              Acceptance &amp; Eligibility
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                By registering on PGFinder or booking a PG tour, you represent and warrant that you are at least 18 years of age, or an enrolled college/university student acting with parent/guardian consent.
              </p>
              <p>
                If you are registering on behalf of a property, hostel, or coliving entity, you warrant that you have full legal authority to bind that entity to these Terms.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="terms-scope" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">2</span>
              Role of PGFinder &amp; Zero Brokerage
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                PGFinder provides an online discovery, verification, and scheduling marketplace connecting students seeking accommodations with verified PG owners.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-primary">Zero Brokerage:</strong> PGFinder never acts as a middleman broker and never demands brokerage fees from students.</li>
                <li><strong className="text-primary">Direct Agreements:</strong> The rental agreement, tenancy rules, and deposit terms are entered into directly between the student (or guardian) and the property owner.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="terms-students" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">3</span>
              Student Tenant Obligations
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>As a student user, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide accurate personal identity information during tour booking and owner interactions.</li>
                <li>Respect scheduled tour timings and cancel visits at least 2 hours in advance if unable to attend.</li>
                <li>Leave genuine, objective reviews based on firsthand visits or actual residency.</li>
                <li>Refrain from sharing owner contact information with unverified third parties.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="terms-owners" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">4</span>
              Owner &amp; Landlord Responsibilities
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>Property owners listing on PGFinder must adhere to strict quality and legal standards:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-primary">Truth in Advertising:</strong> Pricing, room dimensions, security deposit, meal plans, and AC policies must be 100% accurate.</li>
                <li><strong className="text-primary">Mandatory Verification:</strong> Submit proof of ownership, fire safety compliance, and government ID before listing approval.</li>
                <li><strong className="text-primary">Non-Discrimination:</strong> Refuse accommodations based solely on race, caste, religion, or dietary lifestyle in violation of constitutional safeguards.</li>
                <li><strong className="text-primary">Safety Measures:</strong> Maintain operational CCTV in common corridors, working fire extinguishers, and emergency first-aid kits.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="terms-bookings" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">5</span>
              Visits &amp; Token Advances
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                Scheduling physical or virtual tours on PGFinder is 100% free of charge. If a student chooses to pay a token deposit to reserve a room, it must be documented through an official written receipt with clear refund clauses provided by the property owner.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="terms-conduct" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">6</span>
              Prohibited Conduct &amp; Account Suspension
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>PGFinder reserves the right to immediately deactivate accounts and remove listings involved in:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Posting fake property images, stock photographs, or fabricated reviews.</li>
                <li>Demanding unauthorized off-platform brokerage commissions.</li>
                <li>Harassment, threats, or stalking of students, wardens, or staff.</li>
                <li>Attempting to circumvent or tamper with the platform security or verification workflows.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="terms-liability" className="flex flex-col gap-4 scroll-mt-28">
            <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">7</span>
              Limitation of Liability
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 leading-relaxed">
              <p>
                While PGFinder conducts rigorous physical and document verifications, students and guardians are strongly encouraged to inspect accommodations in person before paying substantial advance sums. PGFinder is not liable for private tenancy disputes arising post move-in.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="terms-disputes" className="flex flex-col gap-4 scroll-mt-28 bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
            <h2 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-deep-green flex items-center justify-center text-sm font-bold shrink-0">8</span>
              Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
            </p>
            <div className="text-xs text-on-surface pt-2">
              Questions regarding these Terms? Email us at <strong className="text-deep-green">legal@pgfinder.com</strong>.
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
