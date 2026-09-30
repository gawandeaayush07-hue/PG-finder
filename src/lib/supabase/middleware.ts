import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, UserRole } from '@/types/database';

/**
 * Updates the user's session by inspecting incoming cookies,
 * refreshing expired auth tokens with Supabase, and writing new cookies to the response.
 * Enforces server-side route protection across /dashboard/student, /dashboard/owner, and /dashboard/admin.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  // If credentials are placeholder (development/local preview without env vars configured yet),
  // allow the request through so static and client-side demo functionality continues without crashing.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid using getSession() on the server as it does not guarantee token authenticity.
  // getUser() validates the token against the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect /dashboard routes at the network boundary
  if (pathname.startsWith('/dashboard')) {
    // 1. Unauthenticated users cannot access any dashboard
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // 2. Query authoritative public.profiles row to verify permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role as UserRole) || 'STUDENT';

    // 3. Admin portal protection: Only ADMIN role is authorized
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = userRole === 'OWNER' ? '/dashboard/owner' : '/dashboard/student';
      return NextResponse.redirect(url);
    }

    // 4. Owner portal protection: Only OWNER and ADMIN are authorized
    if (pathname.startsWith('/dashboard/owner') && userRole !== 'OWNER' && userRole !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/student';
      return NextResponse.redirect(url);
    }

    // 5. Student portal protection: OWNER cannot access student portal unless they are ADMIN
    if (pathname.startsWith('/dashboard/student') && userRole === 'OWNER') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/owner';
      return NextResponse.redirect(url);
    }
  }

  // If authenticated user visits /auth, redirect to their authoritative dashboard
  if (pathname === '/auth' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role as UserRole) || 'STUDENT';
    const redirectTarget = request.nextUrl.searchParams.get('redirect');

    if (redirectTarget) {
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }

    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (userRole === 'OWNER') {
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  return supabaseResponse;
}
