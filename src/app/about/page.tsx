'use client';

import React, { useState } from 'react';

export default function AboutContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'Is PGFinder completely free for students?',
      a: 'Yes, PGFinder is completely free for students. There are no brokerage charges, no platform fees, and booking visits is free of cost.',
    },
    {
      q: 'How does PGFinder verify listings?',
      a: 'Every listing undergoes verification. Owners are required to submit government-issued IDs, land title deeds, and fire NOCs. Our admin panel reviews all documents before listing approval.',
    },
    {
      q: 'How do I schedule a visit to a PG?',
      a: 'Simply click "Find a PG", click "View Details" on any property, pick a preferred date and time slot in the booking widget, and click "Confirm Visit". You can track your tour approvals in your Student Dashboard.',
    },
    {
      q: 'Can I list my own PG property?',
      a: 'Absolutely! Switch your profile role to Owner, complete your Owner Authentication, and start listing properties via the Owner Portal. Your property will go live once verified by our admin team.',
    },
  ];

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
      
      {/* Page Header */}
      <section className="text-center max-w-[65ch] mx-auto flex flex-col gap-4 mt-4">
        <h1 className="font-display-lg text-4xl md:text-5xl text-deep-green font-bold leading-tight">
          About PGFinder &amp; Support
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          We are committed to making student housing safe, reliable, and broker-free. Find home-style comforts near campus with absolute transparency.
        </p>
      </section>

      {/* Main Grid: Contact Form & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* Contact Form Section */}
        <section className="bg-white rounded-card p-6 md:p-8 shadow-level-1 border border-outline-variant flex flex-col gap-6">
          <div>
            <h2 className="font-headline-md text-2xl font-bold text-primary mb-1">Get in Touch</h2>
            <p className="text-sm text-on-surface-variant">
              Have questions, feedback, or need help? Send us a message and our support team will respond within 24 hours.
            </p>
          </div>

          {submitted && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <h4 className="font-bold text-deep-green">Message Sent Successfully!</h4>
                <p className="text-xs text-on-secondary-container">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#7A8F7A]">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#B8D9B0] focus:border-primary focus:ring-0 outline-none text-sm bg-white resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-deep-green hover:bg-primary text-on-primary font-bold text-sm py-3 rounded-lg shadow-sm transition-colors mt-2 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* FAQs Accordion Section */}
        <section className="bg-white rounded-card p-6 md:p-8 shadow-level-1 border border-outline-variant flex flex-col gap-6">
          <div>
            <h2 className="font-headline-md text-2xl font-bold text-primary mb-1">Frequently Asked Questions</h2>
            <p className="text-sm text-on-surface-variant">
              Quick answers to the most common queries about using our platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-outline-variant rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-bold text-sm text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  {faq.q}
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {activeFaq === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
