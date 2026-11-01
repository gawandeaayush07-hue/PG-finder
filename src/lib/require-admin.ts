/**
 * SERVER-ONLY: confirms the caller is a logged-in ADMIN.
 * The browser sends its access token in the Authorization header.
 */
import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

export type AdminCheck = { ok: true; db: SupabaseClient } | { ok: false; response: NextResponse };

export async function requireAdmin(request: NextRequest): Promise<AdminCheck> {
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Please log in again.' }, { status: 401 }) };
  }

  const db = createAdminClient() as unknown as SupabaseClient;
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, response: NextResponse.json({ error: 'Please log in again.' }, { status: 401 }) };
  }

  const { data: profile } = await db.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  if (!profile || profile.role !== 'ADMIN') {
    return { ok: false, response: NextResponse.json({ error: 'Admins only.' }, { status: 403 }) };
  }

  return { ok: true, db };
}
