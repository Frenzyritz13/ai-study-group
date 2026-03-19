'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export interface NavLinkProps {
  href: string;
  label: string;
  /** Optional icon rendered to the left of the label. */
  icon?: ReactNode;
  /** When true, renders a non-interactive span styled as disabled. */
  disabled?: boolean;
  /** Called after the link is clicked (useful for closing a mobile drawer). */
  onClick?: () => void;
}

/**
 * Navigation link with active-state styling and accessible current-page
 * indication.  Disabled links are inert: not focusable and visually distinct.
 */
export default function NavLink({
  href,
  label,
  icon,
  disabled = false,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  // Mark as active when the path equals href exactly, or starts with href/
  // (so /dashboard is active when on /dashboard/settings, etc.).
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400"
      >
        {icon && (
          <span aria-hidden="true" className="h-5 w-5 shrink-0">
            {icon}
          </span>
        )}
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1',
        isActive
          ? 'bg-sky-50 text-sky-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {icon && (
        <span aria-hidden="true" className="h-5 w-5 shrink-0">
          {icon}
        </span>
      )}
      {label}
    </Link>
  );
}
