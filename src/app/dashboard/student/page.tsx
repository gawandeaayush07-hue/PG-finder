'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import Link from 'next/link';

export default function StudentDashboard() {
  const { bookings, shortlist, listings, updateBookingStatus, user, profile } = usePersona();

  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Real user: filter out mock seed bookings/shortlist
  const displayBookings = isDemo
    ? bookings
    : bookings.filter((b) => b.id !== 'booking-1' && b.id !== 'booking-2');

  const displayShortlist = isDemo
    ? shortlist
    : shortlist.filter((id) => id !== 'listing-2' || !isPlaceholderMode);

  // Stats: Real zeros for real authenticated user
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingToursCount = displayBookings.filter(
    (b) => (b.status === 'Confirmed' || b.status === 'Pending') && b.date >= todayStr
  ).length;
  const shortlistedCount = displayShortlist.length;
  const reviewsCount = isDemo
    ? 2
    : listings.reduce((acc, l) => {
        const authored = (l.reviews || []).filter(
          (r) => profile?.full_name && r.author === profile.full_name
        ).length;
        return acc + authored;
      }, 0);

  // Welcome heading: use the first word of profile.full_name from the real profile. Never fall back to "Aarav" for real users.
  const getFirstName = () => {
    if (profile?.full_name?.trim()) {
      return profile.full_name.trim().split(/\s+/)[0];
    }
    if (user?.user_metadata?.full_name?.trim()) {
      return user.user_metadata.full_name.trim().split(/\s+/)[0];
    }
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return isDemo ? 'Aarav' : 'Student';
  };

  const firstName = getFirstName();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Rescheduled': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200'; // Pending
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Welcome back, {firstName}!</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Keep track of your scheduled visits, shortlist, and profile settings here.
          </p>
        </div>
        <Link
          href="/search"
          className="bg-deep-green hover:bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
        >
          Explore More PGs
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Upcoming Visits</span>
          <span className="text-3xl font-bold text-primary">{upcomingToursCount}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Shortlisted PGs</span>
          <span className="text-3xl font-bold text-primary">{shortlistedCount}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Reviews Written</span>
          <span className="text-3xl font-bold text-primary">{reviewsCount}</span>
        </div>
      </div>

      {/* Scheduled Visits */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[#333333]">Scheduled Tours</h2>

        {displayBookings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {displayBookings.map((booking) => (
              <div 
                key={booking.id}
                className="border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant shrink-0 bg-surface-container-low">
                    <img 
                      src={booking.listingImage} 
                      alt={booking.listingTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">{booking.listingTitle}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {booking.date}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {booking.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                      className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-outline-variant">event_busy</span>
            <p className="text-sm font-medium text-on-surface-variant">No tours scheduled yet</p>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Find a PG that suits your needs and schedule a visit to inspect the rooms and amenities.
            </p>
            <Link
              href="/search"
              className="bg-deep-green hover:bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer mt-1"
            >
              Explore PGs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
