import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '@/types';

/**
 * Fetches the role of the currently authenticated user from the profiles
 * table.  Returns `null` when there is no session or no profile row yet.
 */
export const getCurrentUserRole = async (
  supabase: SupabaseClient
): Promise<UserRole | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: UserRole }>();

  return data?.role ?? null;
};

/**
 * Asserts that the current user holds one of `allowedRoles`.
 * Redirects to /dashboard (via Next.js `redirect`) if the check fails.
 * Use this in Server Components or Route Handlers to gate access.
 *
 * @returns The user's role when the assertion passes.
 */
export const requireRole = async (
  supabase: SupabaseClient,
  allowedRoles: UserRole[]
): Promise<UserRole> => {
  const role = await getCurrentUserRole(supabase);

  if (!role || !allowedRoles.includes(role)) {
    redirect('/dashboard');
  }

  return role;
};

/**
 * Convenience wrappers — prefer these over calling requireRole directly
 * when you only need a boolean rather than a redirect guard.
 */
export const isAdmin = async (supabase: SupabaseClient): Promise<boolean> => {
  const role = await getCurrentUserRole(supabase);
  return role === 'admin';
};

export const isFacilitator = async (
  supabase: SupabaseClient
): Promise<boolean> => {
  const role = await getCurrentUserRole(supabase);
  return role === 'facilitator';
};
