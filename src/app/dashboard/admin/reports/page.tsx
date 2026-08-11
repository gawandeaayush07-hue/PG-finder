'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function AdminReports() {
  const { reports, updateReportStatus } = usePersona();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Dismissed': return 'bg-zinc-50 text-zinc-600 border-zinc-200';
      default: return 'bg-rose-50 text-rose-700 border-rose-200'; // Open
    }
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Reports &amp; Flags</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Review spam reports, abusive comments, or duplicate properties flagged by students.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {reports.length > 0 ? (
          reports.map((item) => (
            <div 
              key={item.id}
              className="border border-outline-variant rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-low/20 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-primary text-sm">{item.targetName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-on-surface-variant">
                  <p>Reporter: <strong className="text-primary">{item.reporterName}</strong></p>
                  <p>Target Type: {item.targetType}</p>
                  <p className="sm:col-span-2">Reason: <span className="italic text-rose-700 font-semibold">"{item.reason}"</span></p>
                  <p>Flagged date: {item.date}</p>
                </div>
              </div>

              {item.status === 'Open' && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => updateReportStatus(item.id, 'Dismissed')}
                    className="px-4 py-2 border border-[#B8D9B0] hover:bg-surface-container-low text-on-surface rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Dismiss Flag
                  </button>
                  <button
                    onClick={() => updateReportStatus(item.id, 'Resolved')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Take Down / Resolve
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline-variant">assignment_turned_in</span>
            <p className="text-sm text-on-surface-variant">No reports flagged.</p>
          </div>
        )}
      </div>

    </div>
  );
}
