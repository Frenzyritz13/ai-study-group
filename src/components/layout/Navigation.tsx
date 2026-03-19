'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ROUTES } from '@/lib/constants';
import RoleGate from '@/components/auth/RoleGate';
import NavLink from './NavLink';

// ---------------------------------------------------------------------------
// Inline SVG icons (no external icon library required)
// ---------------------------------------------------------------------------

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconGroups = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconProfile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconAdmin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ---------------------------------------------------------------------------
// Nav items config
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    href: ROUTES.DASHBOARD,    icon: <IconDashboard /> },
  { label: 'Study Groups', href: ROUTES.STUDY_GROUPS, icon: <IconGroups /> },
  { label: 'Profile',      href: ROUTES.PROFILE,      icon: <IconProfile /> },
  { label: 'Admin',        href: ROUTES.ADMIN,        icon: <IconAdmin />, adminOnly: true },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavItems({ onClick }: { onClick?: () => void }) {
  return (
    <ul className="space-y-1" role="list">
      {NAV_ITEMS.map((item) => {
        const link = (
          <li key={item.label}>
            <NavLink
              href={item.href}
              label={item.label}
              icon={item.icon}
              onClick={onClick}
            />
          </li>
        );

        if (item.adminOnly) {
          return (
            <RoleGate key={item.label} allowedRoles={['admin']}>
              {link}
            </RoleGate>
          );
        }

        return link;
      })}
    </ul>
  );
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const drawerRef = useRef<HTMLElement>(null);

  // Focus the first focusable element when the drawer opens and trap Tab.
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const el = drawerRef.current;
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop sidebar — always mounted, hidden below lg breakpoint        */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <nav aria-label="Main navigation" className="flex-1 p-4">
          <NavItems />
        </nav>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile drawer — conditionally rendered when isOpen is true          */}
      {/* ------------------------------------------------------------------ */}
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <IconClose />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-4">
              <NavItems onClick={onClose} />
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
