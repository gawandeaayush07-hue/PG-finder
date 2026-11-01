'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface ResetRequestRow {
  id: string;
  phone: string;
  status: 'PENDING' | 'CODE_ISSUED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  issued_at: string | null;
  code_expires_at: string | null;
  completed_at: string | null;
  full_name: string;
  role: string;
}

async function authHeader(supabase: SupabaseClient): Promise<Record<string, string> | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

async function loadRequests(
  supabase: SupabaseClient
): Promise<{ rows: ResetRequestRow[]; error: string | null }> {
  const headers = await authHeader(supabase);
  if (!headers) return { rows: [], error: 'Please log in as an admin.' };

  try {
    const response = await fetch('/api/admin/password-requests', { headers });
    const result = await response.json();
    if (!response.ok) return { rows: [], error: result.error || 'Could not load requests.' };
    return { rows: result.requests as ResetRequestRow[], error: null };
  } catch {
    return { rows: [], error: 'Network error while loading requests.' };
  }
}

function formatWhen(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function displayStatus(row: ResetRequestRow): { label: string; className: string } {
  const expired =
    row.status === 'EXPIRED' ||
    (row.status === 'CODE_ISSUED' && row.code_expires_at && new Date(row.code_expires_at) <= new Date());

  if (expired) return { label: 'Code expired', className: 'bg-zinc-100 text-zinc-600' };
  switch (row.status) {
    case 'PENDING':
      return { label: 'Waiting for you', className: 'bg-amber-100 text-amber-800' };
    case 'CODE_ISSUED':
      return { label: 'Code given', className: 'bg-sky-100 text-sky-800' };
    case 'COMPLETED':
      return { label: 'Done', className: 'bg-emerald-100 text-emerald-800' };
    default:
      return { label: 'Cancelled', className: 'bg-zinc-100 text-zinc-600' };
  }
}

export default function AdminPasswordRequestsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<ResetRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [issuedCodes, setIssuedCodes] = useState<Record<string, string>>({});
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await loadRequests(supabase);
      if (!active) return;
      setRows(result.rows);
      setErrorMessage(result.error);
      setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [supabase, refreshTick]);

  const refresh = () => {
    setIsLoading(true);
    setRefreshTick((n) => n + 1);
  };

  const act = async (id: string, action: 'issue' | 'cancel') => {
    setBusyId(id);
    setErrorMessage(null);
    try {
      const headers = await authHeader(supabase);
      if (!headers) {
        setErrorMessage('Please log in as an admin.');
        return;
      }
      const response = await fetch('/api/admin/password-requests', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || 'Something went wrong.');
        return;
      }
      if (action === 'issue' && result.code) {
        setIssuedCodes((prev) => ({ ...prev, [id]: result.code as string }));
      }
      refresh();
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Password reset requests</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Before you give out a code, make sure the person is real: call or message the number below, or
            meet them in person. A code works once and expires after 24 hours. It is shown only here, right
            after you create it.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="shrink-0 border border-deep-green text-deep-green font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#F3FAF1] cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading requests...</p>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-outline-variant rounded-card p-8 text-center text-sm text-on-surface-variant">
          No password reset requests yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => {
            const status = displayStatus(row);
            const canAct = row.status === 'PENDING' || row.status === 'CODE_ISSUED';
            const issuedCode = issuedCodes[row.id];
            return (
              <div
                key={row.id}
                className="bg-white border border-outline-variant rounded-card p-4 md:p-5 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-primary">
                      {row.full_name || 'Unknown user'}{' '}
                      <span className="text-xs font-medium text-on-surface-variant">
                        ({row.role === 'OWNER' ? 'Property Owner' : 'Student'})
                      </span>
                    </p>
                    <p className="text-sm text-on-surface-variant">{row.phone}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <p className="text-xs text-zinc-500">
                  Requested {formatWhen(row.created_at)}
                  {row.issued_at ? ` · Code given ${formatWhen(row.issued_at)}` : ''}
                  {row.completed_at ? ` · Finished ${formatWhen(row.completed_at)}` : ''}
                </p>

                {issuedCode && (
                  <div className="bg-[#F3FAF1] border border-[#B8D9B0] rounded-xl p-4 text-center">
                    <p className="text-xs text-on-surface-variant mb-1">
                      Give this code to the user. It will not be shown again.
                    </p>
                    <p className="font-mono text-2xl font-bold tracking-widest text-deep-green select-all">
                      {issuedCode}
                    </p>
                  </div>
                )}

                {canAct && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => act(row.id, 'issue')}
                      className="bg-deep-green hover:bg-primary text-on-primary font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer disabled:bg-zinc-400"
                    >
                      {row.status === 'CODE_ISSUED' ? 'Generate a new code' : 'Generate code'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => act(row.id, 'cancel')}
                      className="border border-rose-300 text-rose-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                    >
                      Cancel request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
