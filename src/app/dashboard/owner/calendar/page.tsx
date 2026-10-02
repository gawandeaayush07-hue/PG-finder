'use client';

import React, { useState } from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function OwnerCalendar() {
  const { bookings, user } = usePersona();
  const [successMsg, setSuccessMsg] = useState('');
  
  const isPlaceholderMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder');

  const isDemo = process.env.NODE_ENV === 'development' && isPlaceholderMode && !user;

  // Real user: filter out mock seed bookings
  const ownerBookings = isDemo
    ? bookings
    : bookings.filter((b) => b.id !== 'booking-1' && b.id !== 'booking-2');

  // Slot states
  const [morningOpen, setMorningOpen] = useState(true);
  const [afternoonOpen, setAfternoonOpen] = useState(true);
  const [eveningOpen, setEveningOpen] = useState(false);

  const handleSlotSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Tour availability slots updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Mock days in August 2026 (1st is Saturday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: 5 }, (_, i) => null); // padding before Saturday (Mon-Fri)
  const calendarCells = [...paddingDays, ...daysInMonth];

  // Helper to find bookings for a specific day in August 2026
  const getBookingsForDay = (day: number) => {
    const dateString = `2026-08-${day < 10 ? '0' + day : day}`;
    return ownerBookings.filter((b) => b.date === dateString && (b.status === 'Confirmed' || b.status === 'Pending'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      
      {/* Calendar Grid (Left, span 8) */}
      <section className="lg:col-span-8 bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-outline-variant pb-4">
          <h1 className="text-lg font-bold text-primary">August 2026</h1>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center hover:bg-surface-container-low cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center hover:bg-surface-container-low cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#7A8F7A]">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1 border-t border-l border-outline-variant">
          {calendarCells.map((cell, idx) => {
            if (cell === null) {
              return <div key={`pad-${idx}`} className="aspect-square bg-surface-container-low border-b border-r border-outline-variant"></div>;
            }
            
            const cellBookings = getBookingsForDay(cell);
            
            return (
              <div 
                key={`day-${cell}`} 
                className="aspect-square p-1.5 border-b border-r border-outline-variant hover:bg-light-sage/10 transition-colors flex flex-col gap-1 relative group"
              >
                <span className="text-xs font-bold text-on-surface">{cell}</span>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  {cellBookings.slice(0, 2).map((b) => (
                    <span 
                      key={b.id} 
                      className={`text-[8px] px-1 rounded truncate leading-tight block ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.listingTitle.split(' ')[0]}
                    </span>
                  ))}
                  {cellBookings.length > 2 && (
                    <span className="text-[8px] text-on-surface-variant font-bold text-center block leading-none">
                      +{cellBookings.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {ownerBookings.length === 0 && (
          <div className="py-3 px-4 rounded-xl bg-surface-container-low/50 border border-outline-variant flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">event_busy</span>
            <span>No scheduled tours yet for this month. Scheduled student visit requests will appear on their respective dates.</span>
          </div>
        )}
      </section>

      {/* Slots Sidebar (Right, span 4) */}
      <section className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-card p-6 shadow-level-1 border border-[#B8D9B0] flex flex-col gap-4">
          <h2 className="text-sm font-bold text-primary">Manage Tour Slots</h2>
          <p className="text-xs text-on-surface-variant">
            Toggle which daily slots are available for students to schedule visit requests.
          </p>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded text-xs font-semibold text-deep-green">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSlotSave} className="flex flex-col gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group p-2 border border-outline-variant rounded-lg bg-surface-container-low/20">
                <input
                  type="checkbox"
                  checked={morningOpen}
                  onChange={() => setMorningOpen(!morningOpen)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-primary block">Morning Slot</span>
                  <span className="text-[10px] text-on-surface-variant">10:00 AM - 12:00 PM</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-2 border border-outline-variant rounded-lg bg-surface-container-low/20">
                <input
                  type="checkbox"
                  checked={afternoonOpen}
                  onChange={() => setAfternoonOpen(!afternoonOpen)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-primary block">Afternoon Slot</span>
                  <span className="text-[10px] text-on-surface-variant">01:00 PM - 04:00 PM</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-2 border border-outline-variant rounded-lg bg-surface-container-low/20">
                <input
                  type="checkbox"
                  checked={eveningOpen}
                  onChange={() => setEveningOpen(!eveningOpen)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-primary block">Evening Slot</span>
                  <span className="text-[10px] text-on-surface-variant">05:00 PM - 07:00 PM</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-deep-green hover:bg-primary text-on-primary font-bold text-xs py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Available Slots
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
