'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function AdminOverview() {
  const { listings, verificationPipeline, reports } = usePersona();

  // Metrics
  const totalPgs = listings.length;
  const verifiedPgs = listings.filter((l) => l.verified).length;
  const pendingApprovals = verificationPipeline.filter((v) => v.status === 'Pending').length;
  const openReports = reports.filter((r) => r.status === 'Open').length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant">
        <h1 className="text-xl font-bold text-primary">Admin System Control Overview</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Monitor platform metrics, manage pending verifications, and resolve user flags.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Total Listings</span>
          <span className="text-2xl font-bold text-primary">{totalPgs}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Verified PGs</span>
          <span className="text-2xl font-bold text-emerald-700">{verifiedPgs}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Verification Backlog</span>
          <span className="text-2xl font-bold text-amber-700">{pendingApprovals}</span>
        </div>
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-level-1 flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant font-medium">Open Reports</span>
          <span className="text-2xl font-bold text-rose-700">{openReports}</span>
        </div>
      </div>

      {/* Platform Activity Logs */}
      <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant">
        <h2 className="text-sm font-bold text-[#333333] mb-4 border-b border-outline-variant pb-3">System Log Activity</h2>
        
        <div className="flex flex-col gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded transition-colors border-b border-outline-variant/30">
            <span className="font-semibold text-primary">New property added: "Green Leaf Residences"</span>
            <span>2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded transition-colors border-b border-outline-variant/30">
            <span className="font-semibold text-primary">Owner sunita@scholarsabode.com submitted Land Deeds document</span>
            <span>4 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded transition-colors border-b border-outline-variant/30">
            <span className="font-semibold text-primary">Flag review request: User Divya K. reported comment on Harmony House</span>
            <span>Yesterday</span>
          </div>
        </div>
      </div>

    </div>
  );
}
