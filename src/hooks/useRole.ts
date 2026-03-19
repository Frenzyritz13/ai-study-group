'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import type { UserRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Zustand store — shared across every component that calls useRole(), so a
// single DB query populates the role for the whole tree.
// ---------------------------------------------------------------------------

interface RoleStore {
  role: UserRole | null;
  isLoading: boolean;
  fetchRole: () => Promise<void>;
  resetRole: () => void;
}

const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  isLoading: true,

  fetchRole: async () => {
    set({ isLoading: true });

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ role: null, isLoading: false });
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: UserRole }>();

    set({ role: data?.role ?? null, isLoading: false });
  },

  resetRole: () => set({ role: null, isLoading: false }),
}));

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

export interface UseRoleResult {
  role: UserRole | null;
  isAdmin: boolean;
  isFacilitator: boolean;
  isUser: boolean;
  isLoading: boolean;
}

export const useRole = (): UseRoleResult => {
  const { role, isLoading, fetchRole, resetRole } = useRoleStore();

  useEffect(() => {
    fetchRole();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        resetRole();
      } else {
        // SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, etc.
        fetchRole();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchRole, resetRole]);

  return {
    role,
    isAdmin: role === 'admin',
    isFacilitator: role === 'facilitator',
    isUser: role === 'user',
    isLoading,
  };
};
