import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Routes that are always accessible without authentication.
 */
const PUBLIC_ROUTES = new Set(['/', '/login', '/auth/callback']);

/**
 * Routes that authenticated users should be redirected away from
 * (e.g. the login page once you're already signed in).
 */
const AUTH_ONLY_ROUTES = new Set(['/login']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh the session and forward the updated cookies to the browser.
  const { response, user } = await updateSession(request);

  // Authenticated users should not see the login page.
  if (user && AUTH_ONLY_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated users may not access protected routes.
  if (!user && !PUBLIC_ROUTES.has(pathname)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match every request path except:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - common static asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
