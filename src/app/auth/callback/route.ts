import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  // Sanitize next redirect target
  const isValidNext =
    next &&
    next.startsWith('/') &&
    !next.startsWith('//') &&
    !next.includes('://') &&
    !next.includes('\\');

  const redirectPath = isValidNext ? next : '/auth';

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const baseUrl = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${baseUrl}${redirectPath}`);
      }
    } catch {
      // Auth exchange failed, fall through to error redirect
    }
  }

  // On failure redirect to /auth?error=callback
  return NextResponse.redirect(`${baseUrl}/auth?error=callback`);
}
