'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';
import Link from 'next/link';

export default function StudentDashboard() {
  const { bookings, shortlist, listings, updateBookingStatus } = usePersona();

  // Stats
  const upcomingToursCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  const shortlistedCount = shortlist.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Rescheduled': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200'; // Pending
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Welcome back, Aarav!</h1>
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
          <span className="text-3xl font-bold text-primary">2</span>
        </div>
      </div>

      {/* Scheduled Visits */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[#333333]">Scheduled Tours</h2>

        {bookings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
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
                  
                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'Declined')}
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
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-outline-variant">event_busy</span>
            <p className="text-sm text-on-surface-variant">No scheduled tours. Find a PG and book a visit slot!</p>
            <Link href="/search" className="text-xs text-deep-green font-bold hover:underline">
              Search Properties Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
