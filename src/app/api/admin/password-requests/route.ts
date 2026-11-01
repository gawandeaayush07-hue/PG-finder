import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { normalizePhone } from '@/lib/phone';
import { ADMIN_CODE_HOURS, generateAdminResetCode, hashSecret, normalizeCode } from '@/lib/recovery-server';

export async function GET(request: NextRequest) {
  try {
    const check = await requireAdmin(request);
    if (!check.ok) return check.response;
    const { db } = check;

    const { data: rows, error } = await db
      .from('password_reset_requests')
      .select('id, user_id, phone, status, created_at, issued_at, code_expires_at, completed_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Admin list requests failed', error);
      return NextResponse.json({ error: 'Could not load requests.' }, { status: 500 });
    }

    const list = rows ?? [];
    const userIds = Array.from(new Set(list.map((r) => String(r.user_id))));
    const names = new Map<string, { full_name: string; role: string }>();

    if (userIds.length > 0) {
      const { data: profiles } = await db.from('profiles').select('id, full_name, role').in('id', userIds);
      for (const p of profiles ?? []) {
        names.set(String(p.id), { full_name: String(p.full_name ?? ''), role: String(p.role ?? '') });
      }
    }

    const requests = list.map((r) => ({
      id: r.id,
      phone: r.phone,
      status: r.status,
      created_at: r.created_at,
      issued_at: r.issued_at,
      code_expires_at: r.code_expires_at,
      completed_at: r.completed_at,
      full_name: names.get(String(r.user_id))?.full_name ?? '',
      role: names.get(String(r.user_id))?.role ?? '',
    }));

    return NextResponse.json({ requests });
  } catch (error: unknown) {
    console.error('Admin list unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const check = await requireAdmin(request);
    if (!check.ok) return check.response;
    const { db } = check;

    const body: { id?: string; phone?: string; action?: 'create' | 'issue' | 'cancel' } = await request.json();

    // ---- create: the admin types a mobile number (after the user contacted them) ----
    if (body.action === 'create') {
      const canonicalPhone = body.phone ? normalizePhone(body.phone) : null;
      if (!canonicalPhone) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
      }

      const { data: profile, error: profileError } = await db
        .from('profiles')
        .select('id, full_name, role')
        .eq('phone', canonicalPhone)
        .maybeSingle();

      if (profileError) {
        console.error('Admin create code: profile lookup failed', profileError);
        return NextResponse.json({ error: 'Could not look up that number.' }, { status: 500 });
      }
      if (!profile) {
        return NextResponse.json({ error: 'No account is registered with that number.' }, { status: 404 });
      }
      if (profile.role === 'ADMIN') {
        return NextResponse.json({ error: 'Admin accounts cannot be reset here.' }, { status: 403 });
      }

      // Close any older open requests so only the newest code works
      await db
        .from('password_reset_requests')
        .update({ status: 'CANCELLED' })
        .eq('user_id', profile.id)
        .in('status', ['PENDING', 'CODE_ISSUED']);

      const code = generateAdminResetCode();
      const expires = new Date(Date.now() + ADMIN_CODE_HOURS * 60 * 60 * 1000).toISOString();
      const { error: insertError } = await db.from('password_reset_requests').insert({
        user_id: profile.id,
        phone: canonicalPhone,
        status: 'CODE_ISSUED',
        code_hash: hashSecret(normalizeCode(code)),
        code_expires_at: expires,
        issued_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('Admin create code: insert failed', insertError);
        return NextResponse.json({ error: 'Could not create the code.' }, { status: 500 });
      }

      // The code is returned ONCE here and never stored in readable form.
      return NextResponse.json({
        success: true,
        code,
        expiresAt: expires,
        fullName: String(profile.full_name ?? ''),
        role: String(profile.role ?? ''),
        phone: canonicalPhone,
      });
    }

    // ---- issue / cancel on an existing request ----
    if (!body.id || (body.action !== 'issue' && body.action !== 'cancel')) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { data: row, error: rowError } = await db
      .from('password_reset_requests')
      .select('id, status')
      .eq('id', body.id)
      .maybeSingle();

    if (rowError || !row) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    if (row.status === 'COMPLETED' || row.status === 'CANCELLED') {
      return NextResponse.json({ error: 'This request is already closed.' }, { status: 409 });
    }

    if (body.action === 'cancel') {
      const { error } = await db.from('password_reset_requests').update({ status: 'CANCELLED' }).eq('id', body.id);
      if (error) {
        return NextResponse.json({ error: 'Could not cancel the request.' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    const code = generateAdminResetCode();
    const expires = new Date(Date.now() + ADMIN_CODE_HOURS * 60 * 60 * 1000).toISOString();
    const { error: issueError } = await db
      .from('password_reset_requests')
      .update({
        status: 'CODE_ISSUED',
        code_hash: hashSecret(normalizeCode(code)),
        code_expires_at: expires,
        issued_at: new Date().toISOString(),
        failed_attempts: 0,
      })
      .eq('id', body.id);

    if (issueError) {
      console.error('Admin issue code failed', issueError);
      return NextResponse.json({ error: 'Could not create the code.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, code, expiresAt: expires });
  } catch (error: unknown) {
    console.error('Admin action unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
