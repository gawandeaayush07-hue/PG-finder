'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '15,000+', label: 'Verified Student Beds', icon: 'bed' },
    { number: '45+', label: 'University Hubs Covered', icon: 'school' },
    { number: '0₹', label: 'Brokerage Charged Ever', icon: 'savings' },
    { number: '98.4%', label: 'Positive Student Rating', icon: 'thumb_up' },
  ];

  const values = [
    {
      title: 'Zero Brokerage Guarantee',
      desc: 'We strictly eliminate unfair agent fees. Students deserve to find shelter near campus without paying an entire month’s rent to a middleman.',
      icon: 'verified_user',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: '100% On-Ground Verification',
      desc: 'Every property on PGFinder undergoes mandatory physical inspection, geotagging, fire safety verification, and document scrutiny before going live.',
      icon: 'fact_check',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: 'Transparent Pricing & Amenities',
      desc: 'No hidden electricity multipliers, surprise maintenance fees, or false food menu promises. What you see on the listing is exactly what you get.',
      icon: 'visibility',
      color: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      title: 'Student Safety First',
      desc: 'Curfew clarity, biometric security standards, verified warden contacts, and direct panic escalation systems for student peace of mind.',
      icon: 'security',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  const team = [
    {
      name: 'Ayush Gawande',
      role: 'Founder',
      bio: 'Visionary behind PGFinder, dedicated to revolutionizing student housing discovery with zero brokerage, verified listings, and transparent pricing.',
      avatar: '/team/ayush-gawande.png',
    },
    {
      name: 'Makaranda Dharak',
      role: 'Co-Founder',
      bio: 'Co-architect of PGFinder’s mission, spearheading strategic partnerships, campus outreach programs, and regional growth initiatives.',
      avatar: '/team/makaranda-dharak.png',
    },
    {
      name: 'Rasika Patil',
      role: 'CEO',
      bio: 'Driving organizational vision, operational excellence, and a student-first company culture to make safe student living universally accessible.',
      avatar: '/team/rasika-patil.png',
    },
    {
      name: 'Masum Barsagade',
      role: 'CPO (Project Officer)',
      bio: 'Leading end-to-end product execution, cross-functional project delivery, on-ground verification protocols, and key platform milestones.',
      avatar: '/team/masum-barsagade.png',
    },
    {
      name: 'Amey Jadhav',
      role: 'CTO',
      bio: 'Engineering high-performance web architecture, immersive 3D virtual room tours, real-time booking pipelines, and robust platform security.',
      avatar: '/team/amey-jadhav.png',
    },
    {
      name: 'Athrava Shinde',
      role: 'CFO (Financer)',
      bio: 'Managing financial planning, capital allocation, investor relations, and ensuring long-term fiscal stability and sustainable business growth.',
      avatar: '/team/atharva-shinde.png',
    },
  ];

  return (
    <div className="w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-[80ch] mx-auto flex flex-col items-center gap-6 mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-deep-green text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          About PGFinder
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-deep-green font-bold leading-tight tracking-tight">
          Transforming How Students Find Their Home Away From Home
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
          Founded with a simple premise: no student should face unverified rooms, predatory middlemen, or false promises when moving away to build their future.
        </p>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white rounded-card p-8 shadow-level-1 border border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 p-2">
            <span className="material-symbols-outlined text-deep-green text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {item.icon}
            </span>
            <span className="font-display-lg text-3xl md:text-4xl font-extrabold text-primary">
              {item.number}
            </span>
            <span className="text-xs md:text-sm font-semibold text-on-surface-variant">
              {item.label}
            </span>
          </div>
        ))}
      </section>

      {/* Our Mission & Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            Our Mission
          </div>
          <h2 className="font-headline-md text-3xl md:text-4xl font-bold text-primary leading-snug">
            Safe, honest, and broker-free accommodations within 15 minutes of campus.
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Every year, millions of young scholars relocate to new cities for higher education and competitive examinations. Unfortunately, the traditional PG ecosystem is plagued by fake photos, unauthorized brokers demanding outrageous commissions, and zero accountability when issues arise.
          </p>
          <p className="text-on-surface-variant text-base leading-relaxed">
            PGFinder bridges the gap between conscientious property owners and aspiring students. By combining rigorous physical verification with smart digital discovery, 3D room explorations, and transparent owner agreements, we make renting a room as seamless as ordering a book.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link 
              href="/search" 
              className="bg-deep-green hover:bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-full shadow-sm transition-transform hover:scale-105 duration-200 cursor-pointer"
            >
              Explore Verified PGs
            </Link>
            <Link 
              href="/trust" 
              className="border border-deep-green text-deep-green hover:bg-deep-green hover:text-white font-bold text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
            >
              Our Safety Standards
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-200/50 to-teal-100/50 rounded-3xl filter blur-xl opacity-70"></div>
          <div className="relative rounded-2xl overflow-hidden border border-outline-variant shadow-level-2 bg-white">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80" 
              alt="Students studying and collaborating comfortably" 
              className="w-full h-[380px] object-cover"
            />
            <div className="p-6 bg-white flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The PGFinder Pledge</span>
              <p className="text-sm font-medium text-on-surface">
                “Every property listed on PGFinder must be a place we would proudly recommend to our own younger siblings.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-[60ch] mx-auto flex flex-col gap-2">
          <h2 className="font-headline-md text-3xl font-bold text-primary">Our Core Values</h2>
          <p className="text-sm text-on-surface-variant">The uncompromising principles guiding every listing, policy, and interaction on PGFinder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-7 border border-outline-variant shadow-level-1 flex gap-5 items-start hover:shadow-level-2 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${v.color}`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {v.icon}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-md text-lg font-bold text-primary">{v.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-[60ch] mx-auto flex flex-col gap-2">
          <h2 className="font-headline-md text-3xl font-bold text-primary">Meet the Team</h2>
          <p className="text-sm text-on-surface-variant">Engineers, community managers, and safety auditors passionate about campus housing.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-outline-variant shadow-level-1 flex flex-col items-center text-center gap-4 hover:translate-y-[-4px] transition-transform duration-200">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-24 h-24 rounded-full object-cover object-top border-4 border-emerald-100 shadow-sm"
              />
              <div>
                <h4 className="font-headline-md text-lg font-bold text-primary">{member.name}</h4>
                <p className="text-xs font-semibold text-emerald-700">{member.role}</p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-deep-green to-[#1b3a27] rounded-3xl p-8 md:p-12 text-white shadow-level-2 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-[50ch]">
          <h3 className="font-display-lg text-2xl md:text-3xl font-bold text-white">
            Have questions or want to partner with us?
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Whether you are a student searching for a room, a parent with safety questions, or an owner with a property, our team is always here for you.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 shrink-0">
          <Link 
            href="/contact" 
            className="bg-white text-deep-green font-bold text-sm px-6 py-3.5 rounded-full hover:bg-emerald-50 transition-colors cursor-pointer shadow-sm"
          >
            Contact Support Desk
          </Link>
          <Link 
            href="/faq" 
            className="border border-white/50 text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            Explore FAQs
          </Link>
        </div>
      </section>

    </div>
  );
}
