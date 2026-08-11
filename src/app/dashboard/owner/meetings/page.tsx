'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function OwnerMeetings() {
  const { bookings, updateBookingStatus } = usePersona();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Rescheduled': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200'; // Pending
    }
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Meeting &amp; Visit Requests</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Review and manage scheduled tour requests from student applicants.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div 
              key={booking.id}
              className="border border-outline-variant rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-low/20 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-primary text-sm">{booking.studentName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-on-surface-variant">
                  <p className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">home</span>
                    PG: <strong className="text-primary">{booking.listingTitle}</strong>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                    Date: {booking.date}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    Time: {booking.timeSlot}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    Phone: {booking.studentPhone}
                  </p>
                </div>
              </div>

              {booking.status === 'Pending' && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'Declined')}
                    className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                    className="px-4 py-2 bg-deep-green hover:bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Approve Visit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline-variant">notifications_off</span>
            <p className="text-sm text-on-surface-variant">No visit requests received yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
