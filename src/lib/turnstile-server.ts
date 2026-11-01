/**
 * SERVER-ONLY: verifies a Cloudflare Turnstile token.
 * Fails closed in production if the secret key is missing.
 */

export type TurnstileResult = { ok: true } | { ok: false; status: number; error: string };

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!secret) {
    if (isProduction) {
      console.error('Critical: TURNSTILE_SECRET_KEY is missing in production environment.');
      return { ok: false, status: 500, error: 'Service configuration error: CAPTCHA protection is not configured.' };
    }
    return { ok: true }; // local development without a key
  }

  if (!token) {
    return { ok: false, status: 400, error: 'Please wait for the security check to finish, then try again.' };
  }

  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const outcome = await res.json();
    if (!outcome.success) {
      return { ok: false, status: 400, error: 'Security check failed. Please try again.' };
    }
    return { ok: true };
  } catch (err) {
    console.error('Turnstile verification request error:', err);
    if (isProduction) {
      return { ok: false, status: 500, error: 'Could not verify the security check. Please try again.' };
    }
    return { ok: true };
  }
}
