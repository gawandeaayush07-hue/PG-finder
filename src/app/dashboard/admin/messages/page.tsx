'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { categoryLabel } from '@/lib/contact';

interface MessageRow {
  id: string;
  ticket_id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: 'NEW' | 'DONE';
  email_sent: boolean;
  created_at: string;
  handled_at: string | null;
}

type Filter = 'NEW' | 'DONE' | 'ALL';

async function authHeader(supabase: SupabaseClient): Promise<Record<string, string> | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

async function loadMessages(
  supabase: SupabaseClient
): Promise<{ rows: MessageRow[]; error: string | null }> {
  const headers = await authHeader(supabase);
  if (!headers) return { rows: [], error: 'Please log in as an admin.' };

  try {
    const response = await fetch('/api/admin/contact-messages', { headers });
    const result = await response.json();
    if (!response.ok) return { rows: [], error: result.error || 'Could not load messages.' };
    return { rows: result.messages as MessageRow[], error: null };
  } catch {
    return { rows: [], error: 'Network error while loading messages.' };
  }
}

function formatWhen(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminMessagesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('NEW');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await loadMessages(supabase);
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

  const setStatus = async (id: string, status: 'NEW' | 'DONE') => {
    setBusyId(id);
    setErrorMessage(null);
    try {
      const headers = await authHeader(supabase);
      if (!headers) {
        setErrorMessage('Please log in as an admin.');
        return;
      }
      const response = await fetch('/api/admin/contact-messages', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || 'Something went wrong.');
        return;
      }
      refresh();
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const newCount = rows.filter((r) => r.status === 'NEW').length;
  const doneCount = rows.filter((r) => r.status === 'DONE').length;
  const visible = rows.filter((r) => filter === 'ALL' || r.status === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: 'NEW', label: `New (${newCount})` },
    { key: 'DONE', label: `Done (${doneCount})` },
    { key: 'ALL', label: `All (${rows.length})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Contact messages</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Messages sent from the Contact page. Click &quot;Reply by email&quot; to answer, then mark the
            message as done. The newest 200 messages are shown.
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

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border cursor-pointer transition-colors ${
              filter === t.key
                ? 'bg-deep-green text-on-primary border-deep-green'
                : 'border-outline-variant text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading messages...</p>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-outline-variant rounded-card p-8 text-center text-sm text-on-surface-variant">
          {filter === 'NEW' ? 'No new messages. Nice and quiet.' : 'No messages here yet.'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((row) => (
            <div
              key={row.id}
              className="bg-white border border-outline-variant rounded-card p-4 md:p-5 flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-primary">
                    {row.name}{' '}
                    <span className="text-xs font-mono font-medium text-on-surface-variant">{row.ticket_id}</span>
                  </p>
                  <p className="text-sm text-on-surface-variant break-all">{row.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                    {categoryLabel(row.category)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      row.status === 'NEW' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {row.status === 'NEW' ? 'New' : 'Done'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-on-surface whitespace-pre-wrap break-words bg-surface-container-low rounded-lg p-3">
                {row.message}
              </p>

              <p className="text-xs text-zinc-500">
                Received {formatWhen(row.created_at)}
                {row.handled_at ? ` · Marked done ${formatWhen(row.handled_at)}` : ''}
                {row.email_sent ? ' · Email notification sent' : ' · Email notification not sent (message is saved here)'}
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.ticket_id} - PG Finder support`)}`}
                  className="bg-deep-green hover:bg-primary text-on-primary font-semibold text-sm px-4 py-2 rounded-lg"
                >
                  Reply by email
                </a>
                {row.status === 'NEW' ? (
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => setStatus(row.id, 'DONE')}
                    className="border border-deep-green text-deep-green font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#F3FAF1] cursor-pointer disabled:opacity-50"
                  >
                    Mark as done
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => setStatus(row.id, 'NEW')}
                    className="border border-outline-variant text-on-surface-variant font-semibold text-sm px-4 py-2 rounded-lg hover:bg-surface-container-low cursor-pointer disabled:opacity-50"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
