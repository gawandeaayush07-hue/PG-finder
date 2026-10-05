import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Creates a browser-safe Supabase client singleton for use in Client Components.
 * This client persists sessions across page navigation using secure cookies.
 * It does NOT store sensitive tokens in localStorage.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
