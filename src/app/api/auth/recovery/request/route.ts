import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePhone } from '@/lib/phone';
import { REQUEST_COOLDOWN_MINUTES } from '@/lib/recovery-server';

const GENERIC_OK =
  'If this number is registered, the admin has been notified. Please contact the admin to get your one-time reset code.';

export async function POST(request: NextRequest) {
  try {
    const body: { phone?: string } = await request.json();
    const canonicalPhone = body.phone ? normalizePhone(body.phone) : null;

    if (!canonicalPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    const db = createAdminClient() as unknown as SupabaseClient;

    const { data: profile, error: profileError } = await db
      .from('profiles')
      .select('id, role')
      .eq('phone', canonicalPhone)
      .maybeSingle();

    if (profileError) {
      console.error('Recovery request: profile lookup failed', profileError);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    // Same answer whether or not the number exists, so nobody can probe for registered numbers.
    // Admin accounts are never reset through this public flow.
    if (!profile || profile.role === 'ADMIN') {
      return NextResponse.json({ success: true, message: GENERIC_OK });
    }

    const cooldownStart = new Date(Date.now() - REQUEST_COOLDOWN_MINUTES * 60 * 1000).toISOString();
    const { data: recent } = await db
      .from('password_reset_requests')
      .select('id, status, created_at')
      .eq('user_id', profile.id)
      .in('status', ['PENDING', 'CODE_ISSUED'])
      .gte('created_at', cooldownStart)
      .limit(1);

    const { data: open } = await db
      .from('password_reset_requests')
      .select('id')
      .eq('user_id', profile.id)
      .eq('status', 'PENDING')
      .limit(1);

    if ((recent && recent.length > 0) || (open && open.length > 0)) {
      return NextResponse.json({ success: true, message: GENERIC_OK });
    }

    const { error: insertError } = await db.from('password_reset_requests').insert({
      user_id: profile.id,
      phone: canonicalPhone,
      status: 'PENDING',
    });

    if (insertError) {
      console.error('Recovery request: insert failed', insertError);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: GENERIC_OK });
  } catch (error: unknown) {
    console.error('Recovery request unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
