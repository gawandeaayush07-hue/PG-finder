import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizePhone, phoneToAuthEmail } from '@/lib/phone';

interface SignupRequestBody {
  name?: string;
  phone?: string;
  password?: string;
  role?: 'STUDENT' | 'OWNER';
  college?: string;
  contactEmail?: string;
  turnstileToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequestBody = await request.json();
    const { name, phone, password, role, college, contactEmail, turnstileToken } = body;

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
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
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

    // 7. Cloudflare Turnstile CAPTCHA verification
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

    // 8. Server-side Supabase Admin client
    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin client failed';
      return NextResponse.json(
        { error: msg },
        { status: 500 }
      );
    }

    // 9. Duplicate phone number check
    const { data: existingProfile, error: profileCheckError } = await adminClient
      .from('profiles')
      .select('id')
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
        { error: 'This mobile number is already registered. Please log in instead.' },
        { status: 409 }
      );
    }

    // 10. Derive hidden login email
    const authEmail = phoneToAuthEmail(canonicalPhone);
    if (!authEmail) {
      return NextResponse.json(
        { error: 'Failed to generate account identifier. Please verify your phone number.' },
        { status: 400 }
      );
    }

    // 11. Create user via Supabase Admin API with auto-confirmed email
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

    if (createError) {
      console.error('Admin createUser error:', createError);
      if (createError.message.toLowerCase().includes('already registered')) {
        return NextResponse.json(
          { error: 'This mobile number is already registered. Please log in instead.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: createError.message || 'Failed to create account.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authEmail,
      phone: canonicalPhone,
      role,
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

