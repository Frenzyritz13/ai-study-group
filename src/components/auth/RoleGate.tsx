'use client';

import type { UserRole } from '@/types';
import { useRole } from '@/hooks/useRole';

interface RoleGateProps {
  /** Roles that are permitted to see the children. */
  allowedRoles: UserRole[];
  children: React.ReactNode;
  /**
   * Content to render when the user's role is not in `allowedRoles`.
   * Defaults to rendering nothing.
   */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders `children` based on the current user's role.
 *
 * Renders nothing (not even `fallback`) while the role is loading to
 * prevent a flash of unauthorized content.
 *
 * @example
 * <RoleGate allowedRoles={['admin']} fallback={<p>Access denied.</p>}>
 *   <AdminPanel />
 * </RoleGate>
 */
export default function RoleGate({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  const { role, isLoading } = useRole();

  // Suppress rendering entirely until the role is confirmed to prevent
  // a flash of unauthorized (or authorized) content on hydration.
  if (isLoading) {
    return null;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
