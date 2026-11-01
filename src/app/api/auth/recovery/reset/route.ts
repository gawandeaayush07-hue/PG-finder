import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePhone } from '@/lib/phone';
import { isRecoveryQuestionKey, MIN_PASSWORD_LENGTH } from '@/lib/recovery-questions';
import {
  burnTime,
  LOCK_MINUTES,
  MAX_FAILED_ATTEMPTS,
  normalizeAnswer,
  normalizeCode,
  verifySecret,
} from '@/lib/recovery-server';

type ResetMethod = 'RECOVERY_CODE' | 'SECURITY_ANSWER' | 'ADMIN_CODE';

interface ResetBody {
  phone?: string;
  method?: ResetMethod;
  code?: string;
  question?: string;
  answer?: string;
  newPassword?: string;
}

const GENERIC_FAIL =
  "The details don't match, or recovery isn't set up for this number. Please try again, or ask the admin for help.";

function fail(extra?: string) {
  return NextResponse.json({ error: extra ? `${GENERIC_FAIL} ${extra}` : GENERIC_FAIL }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetBody = await request.json();
    const { method, code, question, answer, newPassword } = body;

    if (method !== 'RECOVERY_CODE' && method !== 'SECURITY_ANSWER' && method !== 'ADMIN_CODE') {
      return NextResponse.json({ error: 'Please choose how you want to reset your password.' }, { status: 400 });
    }

    const canonicalPhone = body.phone ? normalizePhone(body.phone) : null;
    if (!canonicalPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
        { status: 400 }
      );
    }

    if (method === 'SECURITY_ANSWER') {
      if (!isRecoveryQuestionKey(question) || normalizeAnswer(answer ?? '').length < 2) {
        return NextResponse.json(
          { error: 'Please choose your question and type your answer.' },
          { status: 400 }
        );
      }
    } else if (normalizeCode(code ?? '').length < 8) {
      return NextResponse.json({ error: 'Please enter your code.' }, { status: 400 });
    }

    const db = createAdminClient() as unknown as SupabaseClient;

    const { data: profile, error: profileError } = await db
      .from('profiles')
      .select('id, role')
      .eq('phone', canonicalPhone)
      .maybeSingle();

    if (profileError) {
      console.error('Reset: profile lookup failed', profileError);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    // Unknown numbers and admin accounts get the same answer, after the same amount of work.
    if (!profile || profile.role === 'ADMIN') {
      burnTime(method === 'SECURITY_ANSWER' ? normalizeAnswer(answer ?? '') : normalizeCode(code ?? ''));
      return fail();
    }

    const userId = String(profile.id);
    let usedRequestId: string | null = null;

    if (method === 'ADMIN_CODE') {
      // ---- Admin-issued one-time code ----
      const { data: reqRow } = await db
        .from('password_reset_requests')
        .select('id, code_hash, code_expires_at, failed_attempts')
        .eq('user_id', userId)
        .eq('status', 'CODE_ISSUED')
        .order('issued_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!reqRow) {
        burnTime(normalizeCode(code ?? ''));
        return fail();
      }

      if (!reqRow.code_expires_at || new Date(reqRow.code_expires_at) <= new Date()) {
        await db.from('password_reset_requests').update({ status: 'EXPIRED' }).eq('id', reqRow.id);
        return fail('That code has expired. Please ask the admin for a new one.');
      }

      const ok = verifySecret(normalizeCode(code ?? ''), reqRow.code_hash);
      if (!ok) {
        const attempts = Number(reqRow.failed_attempts ?? 0) + 1;
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          await db
            .from('password_reset_requests')
            .update({ status: 'EXPIRED', failed_attempts: attempts })
            .eq('id', reqRow.id);
          return fail('Too many wrong tries, so this code was cancelled. Please ask the admin for a new one.');
        }
        await db
          .from('password_reset_requests')
          .update({ failed_attempts: attempts })
          .eq('id', reqRow.id);
        return fail(`You have ${MAX_FAILED_ATTEMPTS - attempts} ${MAX_FAILED_ATTEMPTS - attempts === 1 ? 'try' : 'tries'} left.`);
      }

      usedRequestId = String(reqRow.id);
    } else {
      // ---- Recovery code or security answer ----
      const { data: rec } = await db
        .from('account_recovery')
        .select('code_hash, question_key, answer_hash, failed_attempts, locked_until')
        .eq('user_id', userId)
        .maybeSingle();

      if (!rec) {
        burnTime(method === 'SECURITY_ANSWER' ? normalizeAnswer(answer ?? '') : normalizeCode(code ?? ''));
        return fail();
      }

      if (rec.locked_until && new Date(rec.locked_until) > new Date()) {
        const minutes = Math.max(1, Math.ceil((new Date(rec.locked_until).getTime() - Date.now()) / 60000));
        return NextResponse.json(
          {
            error: `Too many wrong tries. Recovery is locked for about ${minutes} more minute${minutes === 1 ? '' : 's'}. You can ask the admin for a reset code instead.`,
          },
          { status: 429 }
        );
      }

      let ok = false;
      if (method === 'RECOVERY_CODE') {
        ok = verifySecret(normalizeCode(code ?? ''), rec.code_hash);
      } else {
        const answerOk = verifySecret(normalizeAnswer(answer ?? ''), rec.answer_hash);
        ok = answerOk && rec.question_key === question;
      }

      if (!ok) {
        const attempts = Number(rec.failed_attempts ?? 0) + 1;
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          await db
            .from('account_recovery')
            .update({
              failed_attempts: 0,
              locked_until: new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString(),
            })
            .eq('user_id', userId);
          return NextResponse.json(
            {
              error: `Too many wrong tries. Recovery is locked for ${LOCK_MINUTES} minutes. You can ask the admin for a reset code instead.`,
            },
            { status: 429 }
          );
        }
        await db.from('account_recovery').update({ failed_attempts: attempts }).eq('user_id', userId);
        return fail(`You have ${MAX_FAILED_ATTEMPTS - attempts} ${MAX_FAILED_ATTEMPTS - attempts === 1 ? 'try' : 'tries'} left.`);
      }

      await db
        .from('account_recovery')
        .update({ failed_attempts: 0, locked_until: null })
        .eq('user_id', userId);
    }

    // ---- Verified: set the new password ----
    const { error: updateError } = await db.auth.admin.updateUserById(userId, { password: newPassword });
    if (updateError) {
      console.error('Reset: password update failed', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Could not change the password. Please try again.' },
        { status: 400 }
      );
    }

    // Best effort: end the account's other logins
    const { error: revokeError } = await db.rpc('revoke_user_sessions', { target_user: userId });
    if (revokeError) {
      console.error('Reset: could not revoke old sessions', revokeError);
    }

    // Close out requests
    if (usedRequestId) {
      await db
        .from('password_reset_requests')
        .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
        .eq('id', usedRequestId);
    }
    await db
      .from('password_reset_requests')
      .update({ status: 'CANCELLED' })
      .eq('user_id', userId)
      .in('status', ['PENDING', 'CODE_ISSUED']);

    return NextResponse.json({ success: true, message: 'Password changed. Please log in with your new password.' });
  } catch (error: unknown) {
    console.error('Reset unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
