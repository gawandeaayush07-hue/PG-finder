'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import Link from 'next/link';

export default function OwnerAnalytics() {
  const { listings, bookings, user } = usePersona();

  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Real user: filter out mock seed listings and bookings
  const ownerListings = isDemo
    ? listings
    : listings.filter((l) => l.id !== 'listing-1' && l.id !== 'listing-2' && l.id !== 'listing-3');

  const ownerBookings = isDemo
    ? bookings
    : bookings.filter((b) => b.id !== 'booking-1' && b.id !== 'booking-2');

  const activeListingsCount = ownerListings.length;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const pendingVisits = ownerBookings.filter((b) => b.status === 'Pending' && b.date >= today).length;

  const monthlyRevenue = isDemo
    ? '₹56,500'
    : (ownerListings.length > 0 ? `₹${ownerListings.reduce((sum, l) => sum + l.price, 0).toLocaleString()}` : '₹0');

  const ownerReviews = ownerListings.flatMap((l) =>
    (l.reviews || []).map((r) => ({ ...r, pgTitle: l.title }))
  );

  const averageRating = isDemo
    ? '4.5 ★'
    : (ownerReviews.length > 0
        ? `${(ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length).toFixed(1)} ★`
        : '—');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Banner */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Owner Analytics</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Overview of your PG performance, active tenant visits, and monthly earnings.
          </p>
        </div>
        <Link
          href="/dashboard/owner/listings"
          className="bg-deep-green hover:bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          Add New PG Listing
        </Link>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Monthly Revenue</span>
          <span className="text-2xl font-bold text-primary">{monthlyRevenue}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Active Properties</span>
          <span className="text-2xl font-bold text-primary">{activeListingsCount}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Pending Visits</span>
          <span className="text-2xl font-bold text-primary">{pendingVisits}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Average Rating</span>
          <span className="text-2xl font-bold text-primary">{averageRating}</span>
        </div>
      </div>

      {/* Visitors Chart */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-outline-variant pb-4">
          <h2 className="text-sm font-bold text-[#333333]">Traffic &amp; Visits Over View</h2>
          <span className="text-xs text-on-surface-variant">Last 7 Days</span>
        </div>
        
        {isDemo ? (
          /* Simple mock bar chart */
          <div className="flex items-end justify-between h-48 pt-4 px-2">
            {[
              { day: 'Mon', val: '40%' },
              { day: 'Tue', val: '65%' },
              { day: 'Wed', val: '50%' },
              { day: 'Thu', val: '85%' },
              { day: 'Fri', val: '70%' },
              { day: 'Sat', val: '95%' },
              { day: 'Sun', val: '60%' },
            ].map((bar, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-grow">
                <div className="w-8 sm:w-12 bg-light-sage/60 hover:bg-light-sage rounded-t-md transition-all duration-300 relative group cursor-pointer" style={{ height: bar.val }}>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-semibold">{bar.day}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-outline-variant">bar_chart</span>
            <p className="text-sm font-medium">No visits yet</p>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Visit statistics and traffic insights will appear here once students view your listings.
            </p>
          </div>
        )}
      </div>

      {/* Recent Reviews Summary */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant">
        <h2 className="text-sm font-bold text-[#333333] mb-4 border-b border-outline-variant pb-4">Recent Student Reviews</h2>
        
        {ownerReviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {ownerReviews.slice(0, 2).map((rev, idx) => (
              <div key={idx} className="border-b border-outline-variant last:border-b-0 pb-4 last:pb-0 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary">{rev.author} on <span className="underline">{rev.pgTitle}</span></span>
                  <span className="text-xs text-amber-500 font-bold">{rev.rating} ★</span>
                </div>
                <p className="text-xs text-on-surface-variant italic">&quot;{rev.comment}&quot;</p>
                <span className="text-[10px] text-on-surface-variant">{rev.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-outline-variant">rate_review</span>
            <p className="text-sm font-medium">No reviews yet</p>
          </div>
        )}
      </div>

    </div>
  );
}
