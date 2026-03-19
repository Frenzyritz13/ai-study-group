'use client';

import { useCallback, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Avatar from '@/components/ui/Avatar';
import Navigation from './Navigation';

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconSignOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getString(val: unknown): string | undefined {
  return typeof val === 'string' ? val : undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface AppShellProps {
  children: React.ReactNode;
  user: User;
}

export default function AppShell({ children, user }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stable reference so Navigation's useEffect dep array stays stable.
  const handleMenuClose = useCallback(() => setIsMobileMenuOpen(false), []);

  const displayName =
    getString(user.user_metadata?.full_name) ??
    getString(user.user_metadata?.name) ??
    user.email ??
    'User';

  const avatarUrl = getString(user.user_metadata?.avatar_url) ?? null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Skip-to-content — first focusable element in the shell             */}
      {/* ------------------------------------------------------------------ */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        Skip to main content
      </a>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        {/* Hamburger — visible on mobile only */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:hidden"
        >
          <IconMenu />
        </button>

        {/* App name — hidden on mobile to keep header compact */}
        <span className="hidden text-base font-semibold text-gray-900 lg:block">
          AI Study Groups
        </span>

        {/* User section */}
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl} name={displayName} size="sm" />
          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {displayName}
          </span>

          {/* Sign-out — plain HTML form so it works without JS */}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Sign out"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <IconSignOut />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Body: sidebar + main content                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 overflow-hidden">
        <Navigation isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

        {/* The id="main-content" is the skip-link target. tabIndex={-1}      */}
        {/* allows the browser to focus the element when the skip link fires. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-gray-50 p-6 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
