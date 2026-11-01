import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePhone, phoneToAuthEmail } from '@/lib/phone';
import { isRecoveryQuestionKey, MIN_PASSWORD_LENGTH } from '@/lib/recovery-questions';
import {
  generateRecoveryCode,
  hashSecret,
  normalizeAnswer,
  normalizeCode,
} from '@/lib/recovery-server';

interface SignupRequestBody {
  name?: string;
  phone?: string;
  password?: string;
  role?: 'STUDENT' | 'OWNER';
  college?: string;
  contactEmail?: string;
  turnstileToken?: string;
  recoveryQuestion?: string;
  recoveryAnswer?: string;
}

function roleLabel(r: string): string {
  return r === 'OWNER' ? 'Property Owner' : 'Student';
}

function duplicateMessage(existingRole: string, requestedRole: string): string {
  return existingRole !== requestedRole
    ? `This number is already registered for a ${roleLabel(existingRole)} profile. Please enter another number.`
    : 'This mobile number is already registered. Please log in instead.';
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequestBody = await request.json();
    const {
      name,
      phone,
      password,
      role,
      college,
      contactEmail,
      turnstileToken,
      recoveryQuestion,
      recoveryAnswer,
    } = body;

    // 1. Role validation: Strictly STUDENT or OWNER. ADMIN cannot be self-registered.
    if (!role || (role !== 'STUDENT' && role !== 'OWNER')) {
      return NextResponse.json(
        { error: 'Invalid registration role. Only Student and Property Owner accounts are allowed.' },
        { status: 400 }
      );
    }

    // 2. Name validation
    const fullName = name?.trim();
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    // 3. Phone number validation & normalization to canonical +91XXXXXXXXXX
    const canonicalPhone = phone ? normalizePhone(phone) : null;
    if (!canonicalPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.' },
        { status: 400 }
      );
    }

    // 4. College validation for student
    const collegeName = college?.trim();
    if (role === 'STUDENT' && (!collegeName || collegeName.length < 2)) {
      return NextResponse.json(
        { error: 'Please select or enter your college/university name.' },
        { status: 400 }
      );
    }

    // 5. Password validation
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
        { status: 400 }
      );
    }

    // 6. Optional contact email validation
    const trimmedContactEmail = contactEmail?.trim() ? contactEmail.trim().toLowerCase() : null;
    if (trimmedContactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedContactEmail)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address, or leave it blank.' },
          { status: 400 }
        );
      }
    }

    // 7. Recovery question + answer (mandatory)
    if (!isRecoveryQuestionKey(recoveryQuestion)) {
      return NextResponse.json(
        { error: 'Please choose a recovery question.' },
        { status: 400 }
      );
    }
    const normalizedAnswer = normalizeAnswer(recoveryAnswer ?? '');
    if (normalizedAnswer.length < 2) {
      return NextResponse.json(
        { error: 'Please type an answer to your recovery question (at least 2 letters or numbers).' },
        { status: 400 }
      );
    }

    // 8. Cloudflare Turnstile CAPTCHA verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && !turnstileSecret) {
      // Fail closed in production if CAPTCHA secret is not configured
      console.error('Critical: TURNSTILE_SECRET_KEY is missing in production environment.');
      return NextResponse.json(
        { error: 'Service configuration error: CAPTCHA protection is not configured.' },
        { status: 500 }
      );
    }

    if (turnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed. Please complete the verification check.' },
          { status: 400 }
        );
      }

      // Verify token with Cloudflare
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
      const formData = new URLSearchParams();
      formData.append('secret', turnstileSecret);
      formData.append('response', turnstileToken);
      if (ip) formData.append('remoteip', ip);

      try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: formData,
        });
        const turnstileOutcome = await turnstileRes.json();
        if (!turnstileOutcome.success) {
          return NextResponse.json(
            { error: 'CAPTCHA check failed. Please refresh and try again.' },
            { status: 400 }
          );
        }
      } catch (captchaErr) {
        console.error('Turnstile verification request error:', captchaErr);
        if (isProduction) {
          return NextResponse.json(
            { error: 'Failed to verify security check. Please try again.' },
            { status: 500 }
          );
        }
      }
    }

    // 9. Server-side Supabase Admin client
    let adminClient: SupabaseClient;
    try {
      adminClient = createAdminClient() as unknown as SupabaseClient;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin client failed';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // 10. Duplicate phone number check (role-aware message)
    const { data: existingProfile, error: profileCheckError } = await adminClient
      .from('profiles')
      .select('id, role')
      .eq('phone', canonicalPhone)
      .maybeSingle();

    if (profileCheckError) {
      console.error('Database error checking phone uniqueness:', profileCheckError);
      return NextResponse.json(
        { error: 'Unable to verify account availability. Please try again.' },
        { status: 500 }
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: duplicateMessage(String(existingProfile.role), role) },
        { status: 409 }
      );
    }

    // 11. Derive hidden login email
    const authEmail = phoneToAuthEmail(canonicalPhone);
    if (!authEmail) {
      return NextResponse.json(
        { error: 'Failed to generate account identifier. Please verify your phone number.' },
        { status: 400 }
      );
    }

    // 12. Create user via Supabase Admin API with auto-confirmed email
    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
        phone: canonicalPhone,
        college_name: role === 'STUDENT' ? collegeName : null,
        contact_email: trimmedContactEmail,
      },
    });

    if (createError || !createdUser?.user) {
      console.error('Admin createUser error:', createError);

      // Two people signing up with the same number at the same instant: the database
      // rejects the second one with a generic error. Re-check and give the friendly message.
      const { data: raceProfile } = await adminClient
        .from('profiles')
        .select('id, role')
        .eq('phone', canonicalPhone)
        .maybeSingle();

      if (raceProfile || createError?.message?.toLowerCase().includes('already registered')) {
        return NextResponse.json(
          { error: duplicateMessage(String(raceProfile?.role ?? role), role) },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: createError?.message || 'Failed to create account.' },
        { status: 500 }
      );
    }

    const newUserId = createdUser.user.id;

    // 13. Save recovery code + security answer (HASHED ONLY). The code is returned once.
    const recoveryCode = generateRecoveryCode();
    const { error: recoveryError } = await adminClient.from('account_recovery').insert({
      user_id: newUserId,
      code_hash: hashSecret(normalizeCode(recoveryCode)),
      question_key: recoveryQuestion,
      answer_hash: hashSecret(normalizedAnswer),
    });

    if (recoveryError) {
      console.error('Failed to store recovery details:', recoveryError);
      // Roll back so nobody ends up with an account that has no recovery set up
      await adminClient.auth.admin.deleteUser(newUserId);
      return NextResponse.json(
        { error: 'Could not finish setting up your account. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authEmail,
      phone: canonicalPhone,
      role,
      recoveryCode,
      message: 'Account created successfully.',
    });
  } catch (error: unknown) {
    console.error('Signup route unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup. Please try again.' },
      { status: 500 }
    );
  }
}
