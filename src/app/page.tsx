import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Root landing page.
 * Authenticated users are sent to /dashboard; everyone else to /login.
 * Rendering is intentionally minimal — the middleware handles most redirects,
 * but this provides a reliable server-side fallback.
 */
export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
