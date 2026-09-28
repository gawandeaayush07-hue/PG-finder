'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactSupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('student_inquiry');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = 'SUP-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(newTicket);
  };

  const offices = [
    {
      city: 'Pune Campus Operations Hub',
      address: 'Pimpri Chinchwad College of Engineering, Sector No 26, Pradhikaran, Nigdi, Pune, Maharashtra 411044',
      phone: '+91 20 6719 3300',
      email: 'pune-hub@pgfinder.com',
    },
  ];

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-16">
      
      {/* Page Header */}
      <section className="text-center max-w-[80ch] mx-auto flex flex-col items-center gap-6 mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-deep-green text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          Support Desk
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-deep-green leading-tight">
          How Can We Help You Today?
        </h1>
        <p className="font-body-lg text-base md:text-lg text-on-surface-variant">
          Whether you need assistance booking a room tour, reporting a property discrepancy, or onboarding your PG accommodation, our support crew is ready to assist.
        </p>
      </section>

      {/* Main Grid: Contact Channels + Interactive Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Contact Channels & Quick Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant shadow-level-1 flex flex-col gap-6">
            <h2 className="font-headline-md text-2xl font-bold text-primary">Direct Assistance</h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-deep-green flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-primary">24/7 Student Hotline</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Toll-free student help &amp; visit coordination</p>
                  <p className="text-sm font-mono font-bold text-deep-green mt-1">+91 1800-743-4633</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-deep-green flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-primary">Official Support Inbox</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">General queries &amp; document submissions</p>
                  <p className="text-sm font-bold text-deep-green mt-1">support@pgfinder.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-deep-green flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-primary">WhatsApp Student Desk</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Quick chat for location map sharing</p>
                  <p className="text-sm font-mono font-bold text-deep-green mt-1">+91 98765 12345</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-deep-green flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Verified Response Times
              </span>
              <p className="text-[11px] text-on-surface-variant">
                Average ticket resolution under 3 hours on business days. Emergency safety escalations answered within 30 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Message / Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 border border-outline-variant shadow-level-1 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Support Ticket</span>
            <h2 className="font-headline-md text-2xl font-bold text-primary mt-1">Send a Message</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Fill out the form below and our team will get back to your registered contact.
            </p>
          </div>

          {!ticketId ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-deep-green">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-deep-green">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-deep-green">Query Category *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white"
                >
                  <option value="student_inquiry">Student Housing / Tour Scheduling</option>
                  <option value="owner_listing">PG Owner Listing &amp; Verification</option>
                  <option value="technical_bug">Technical Bug / App Feedback</option>
                  <option value="billing_deposit">Deposit or Rent Clarification</option>
                  <option value="press_partnership">Campus Partnership &amp; Media</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-deep-green">Message Details *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help? Please provide any listing names or booking dates if applicable..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant focus:border-deep-green outline-none text-sm bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-deep-green hover:bg-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Submit Support Request
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-headline-md text-2xl font-bold text-deep-green">Support Ticket Generated!</h3>
              <p className="text-sm text-on-surface-variant max-w-[420px] w-full mx-auto">
                Thank you <strong className="text-primary">{name}</strong>. Your inquiry has been routed to our student support team.
              </p>
              <div className="bg-emerald-50 border border-emerald-300 px-5 py-2.5 rounded-xl text-sm font-mono font-bold text-deep-green">
                Ticket ID: {ticketId}
              </div>
              <p className="text-xs text-on-surface-variant">
                A confirmation has been sent to <strong className="text-primary">{email}</strong>. We will respond shortly.
              </p>
              <button
                onClick={() => { setTicketId(null); setName(''); setEmail(''); setMessage(''); }}
                className="bg-deep-green text-white font-bold text-sm px-6 py-2.5 rounded-xl mt-2 cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Office Locations */}
      <section className="flex flex-col gap-8 items-center">
        <div className="text-center max-w-[60ch] mx-auto flex flex-col gap-2">
          <h2 className="font-headline-md text-3xl font-bold text-primary">Our Campus Operations Center</h2>
          <p className="text-sm text-on-surface-variant">Drop by our physical hub for in-person owner onboarding, document verification, and student assistance.</p>
        </div>

        <div className="w-full max-w-[700px] mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant shadow-level-1 flex flex-col gap-6 hover:shadow-level-2 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-deep-green font-bold text-xs uppercase tracking-wider border border-emerald-300">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                Pune Campus Operations Hub
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Open Mon – Sat (9:00 AM – 6:30 PM)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center p-5 bg-surface-container-low rounded-2xl border border-outline-variant">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-deep-green flex items-center justify-center shrink-0 border border-emerald-200">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base sm:text-lg text-primary">
                  Pimpri Chinchwad College of Engineering (PCCOE)
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Sector No. 26, Pradhikaran, Nigdi, Pune, Maharashtra 411044
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-outline-variant">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-deep-green flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">call</span>
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase">Contact Desk</p>
                  <p className="text-xs sm:text-sm font-mono font-bold text-deep-green">+91 20 6719 3300</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-outline-variant">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-deep-green flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase">Official Hub Mail</p>
                  <p className="text-xs sm:text-sm font-bold text-deep-green">pune-hub@pgfinder.com</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/60">
              <a
                href="https://maps.google.com/?q=Pimpri+Chinchwad+College+of+Engineering+Nigdi+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-deep-green hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                Open on Google Maps
              </a>
              <span className="text-xs text-on-surface-variant font-medium">
                Nigdi, Pune
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
