/**
 * Supabase Client Setup
 *
 * This file initializes the Supabase client for browser-side operations.
 * For server-side operations, use the server client instead.
 */

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

// Export a singleton instance for easy imports
export const supabase = createClient();
