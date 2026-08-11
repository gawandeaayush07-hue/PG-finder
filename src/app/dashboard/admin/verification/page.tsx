'use client';

import React from 'react';
import { usePersona } from '@/context/PersonaContext';

export default function AdminVerification() {
  const { verificationPipeline, updateVerificationStatus } = usePersona();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-200'; // Pending
    }
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-level-1 border border-outline-variant flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-primary">Verification Pipeline</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Review legal property documents, fire NOCs, and owner government IDs to approve listings.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {verificationPipeline.length > 0 ? (
          verificationPipeline.map((item) => (
            <div 
              key={item.id}
              className="border border-outline-variant rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-low/20 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-primary text-sm">{item.listingTitle}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-on-surface-variant">
                  <p>Submitted by: <strong className="text-primary">{item.ownerName}</strong></p>
                  <p>Document Type: {item.documentType}</p>
                  <p className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">description</span>
                    Filename: <span className="underline cursor-pointer text-deep-green font-semibold">{item.documentName}</span>
                  </p>
                  <p>Submitted on: {item.submissionDate}</p>
                </div>
              </div>

              {item.status === 'Pending' && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => updateVerificationStatus(item.id, 'Rejected')}
                    className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateVerificationStatus(item.id, 'Approved')}
                    className="px-4 py-2 bg-deep-green hover:bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Approve &amp; Verify
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline-variant">folder_open</span>
            <p className="text-sm text-on-surface-variant">Verification pipeline is empty.</p>
          </div>
        )}
      </div>

    </div>
  );
}
