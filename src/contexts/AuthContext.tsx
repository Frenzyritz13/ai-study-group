'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
  initialSession: Session | null;
}

/**
 * Provides the current user and session to the component tree.
 *
 * Initialised with SSR values from the protected layout so there is no
 * flash of unauthenticated content, then kept in sync via the Supabase
 * real-time auth state listener.
 */
export function AuthProvider({
  children,
  initialUser,
  initialSession,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [session, setSession] = useState<Session | null>(initialSession);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
      setUser(updatedSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => useContext(AuthContext);
