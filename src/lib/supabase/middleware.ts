import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Refreshes the Supabase session cookie and returns the updated response
 * along with the authenticated user (or null if unauthenticated).
 *
 * IMPORTANT: Do not add logic between createServerClient and
 * supabase.auth.getUser() — the cookie mutation closure depends on them
 * running immediately after each other.
 */
export const updateSession = async (
  request: NextRequest
): Promise<{ response: NextResponse; user: User | null }> => {
  // Start with a pass-through response so cookies can be mutated in-place.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write updated cookies back onto the request so downstream
          // Server Components see the refreshed values.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Re-create the response so the refreshed cookies reach the browser.
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() triggers session refresh and populates cookies via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
};
