'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  q: string;
  a: string;
  category: 'Students' | 'Owners' | 'Safety' | 'Payments';
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Is PGFinder 100% free for students?',
      a: 'Yes, PGFinder is completely free for students. There are zero brokerage charges, no platform fees, and booking in-person or virtual tours is 100% free.',
      category: 'Students',
    },
    {
      q: 'How does PGFinder physically verify each PG?',
      a: 'Our field compliance team visits every property on-ground before approving its listing. We check room dimensions, ventilation, fire extinguisher presence, CCTV camera placement, water purifier quality, and verify landlord identity documents.',
      category: 'Safety',
    },
    {
      q: 'How do I schedule a physical tour of a PG?',
      a: 'Go to Find a PG, click on any property that suits your requirements, select your preferred date and time in the booking widget, and click "Confirm Visit". You will receive instant confirmation and can manage your visits from your Student Dashboard.',
      category: 'Students',
    },
    {
      q: 'Can I list my own PG accommodation?',
      a: 'Yes! Switch your role to Owner via the top navbar, log into the Owner Portal, and submit your property details along with proof of ownership and fire NOC. Your listing will go live once verified by our admin team.',
      category: 'Owners',
    },
    {
      q: 'What should I do if an owner asks for offline brokerage?',
      a: 'PGFinder strictly prohibits brokerage fees. If any owner or caretaker demands extra brokerage or agent fees, please report them immediately via our Trust & Safety page or contact our 24/7 helpline.',
      category: 'Safety',
    },
    {
      q: 'What is the policy regarding security deposits and refunds?',
      a: 'Security deposits are paid directly to property owners under written rental receipts. In our listings, owners must specify exact deposit terms, lock-in periods, and refund timelines clearly to prevent deductions.',
      category: 'Payments',
    },
    {
      q: 'Are food and electricity charges included in the listed rent?',
      a: 'Each listing card explicitly breaks down amenities: meal frequency (2 or 3 meals/day, veg/non-veg), Wi-Fi speeds, and whether electricity is included or sub-metered. There are no hidden multipliers.',
      category: 'Students',
    },
    {
      q: 'How do owners manage tour appointments from students?',
      a: 'Owners get an integrated Tour Calendar and Meeting Requests portal in their Owner Dashboard where they can approve, reschedule, or manage student visits with a single click.',
      category: 'Owners',
    },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-12">
      
      {/* Hero Header & Search Bar */}
      <section className="text-center max-w-[80ch] mx-auto flex flex-col items-center gap-6 mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-deep-green text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
          Help Center
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-deep-green leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="font-body-lg text-base md:text-lg text-on-surface-variant">
          Find instant answers to common questions about student bookings, owner verification, pricing transparency, and campus safety.
        </p>

        {/* Live Search Bar */}
        <div className="w-full max-w-xl relative mt-2">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. brokerage, verification, visits, meals)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-outline-variant shadow-sm focus:border-deep-green outline-none text-sm"
          />
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {['All', 'Students', 'Owners', 'Safety', 'Payments'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-deep-green text-white shadow-sm'
                : 'bg-white border border-outline-variant text-on-surface-variant hover:border-deep-green hover:text-primary'
            }`}
          >
            {cat === 'All' ? 'All Questions' : cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-outline-variant">
            <p className="text-on-surface-variant font-medium">No questions found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-3 text-xs font-bold text-deep-green hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-outline-variant shadow-level-1 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left font-bold text-base text-primary hover:bg-surface-container-low transition-colors cursor-pointer gap-4"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-deep-green shrink-0">
                    {faq.category}
                  </span>
                  {faq.q}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                  {openIdx === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>
              {openIdx === idx && (
                <div className="px-5 md:px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/40 pt-4 bg-emerald-50/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions CTA */}
      <section className="bg-white rounded-3xl p-8 md:p-12 max-w-3xl mx-auto w-full text-center border border-outline-variant shadow-level-1 flex flex-col items-center gap-5 hover:shadow-level-2 transition-shadow">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-deep-green flex items-center justify-center border border-emerald-200">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        </div>
        <div className="flex flex-col gap-2 max-w-[550px] w-full mx-auto">
          <h3 className="font-headline-md text-2xl md:text-3xl font-bold text-primary">Still have questions?</h3>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            Our friendly support team is available 7 days a week to help you with accommodations, tours, and owner verifications.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="bg-deep-green hover:bg-primary text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-sm transition-transform hover:scale-105 duration-200 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">mail</span>
            Contact Support Desk
          </Link>
          <Link
            href="/trust"
            className="border border-deep-green text-deep-green hover:bg-deep-green hover:text-white text-sm font-bold px-7 py-3.5 rounded-full transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">verified_user</span>
            Trust &amp; Safety
          </Link>
        </div>
      </section>

    </div>
  );
}
