import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Creates a Supabase admin client using the SUPABASE_SERVICE_ROLE_KEY.
 * STRICTLY SERVER-SIDE ONLY. Never import or call from client components.
 * Used for administrative user creation and server-side operations that bypass client RLS.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Warning: SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local. Admin operations will fail until it is added.'
      );
    }
    throw new Error('Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

