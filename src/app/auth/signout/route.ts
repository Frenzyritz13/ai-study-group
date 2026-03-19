import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Sign-out handler.
 *
 * Clears the Supabase auth cookies server-side, which triggers an
 * `onAuthStateChange` SIGNED_OUT event on the client so any in-memory
 * state (AuthContext) is also cleared.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`);
}
