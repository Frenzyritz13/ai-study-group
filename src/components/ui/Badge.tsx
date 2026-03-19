import { clsx } from 'clsx';
import type { UserRole } from '@/types';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-sky-100 text-sky-800',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-700',
};

const roleVariant: Record<UserRole, BadgeVariant> = {
  admin: 'primary',
  facilitator: 'secondary',
  user: 'neutral',
};

export default function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Convenience wrapper that picks the correct color for a UserRole value. */
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <Badge variant={roleVariant[role]} className={className}>
      {label}
    </Badge>
  );
}
