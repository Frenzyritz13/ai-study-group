import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { AuthProvider } from '@/contexts/AuthContext';
import AppShell from '@/components/layout/AppShell';

/**
 * Layout for all protected routes (e.g. /dashboard, /groups, /profile).
 *
 * 1. Validates the session server-side — redirects to /login if unauthenticated.
 * 2. Hydrates AuthProvider with the verified user + session so client
 *    components avoid an extra round-trip.
 * 3. Wraps children with AppShell (header, responsive sidebar, main content).
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  // getUser() verifies the JWT server-side — prefer over getSession() for auth checks.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // getSession() is safe here because identity was already confirmed above.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <AuthProvider initialUser={user} initialSession={session}>
      <AppShell user={user}>{children}</AppShell>
    </AuthProvider>
  );
}
