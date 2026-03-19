-- =============================================================
-- Migration 001: profiles table + RBAC
--
-- Creates:
--   • user_role enum  ('admin' | 'facilitator' | 'user')
--   • profiles table  (1-to-1 with auth.users)
--   • handle_new_user trigger  – auto-provisions a profile on signup
--   • set_updated_at trigger   – keeps updated_at current
--   • is_admin() helper        – SECURITY DEFINER to avoid RLS recursion
--   • RLS policies             – own-row access + admin override
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Enum type
-- ---------------------------------------------------------------

CREATE TYPE public.user_role AS ENUM ('admin', 'facilitator', 'user');

-- ---------------------------------------------------------------
-- 2. Profiles table
-- ---------------------------------------------------------------

CREATE TABLE public.profiles (
  id           UUID             PRIMARY KEY
                                REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  role         public.user_role NOT NULL DEFAULT 'user',
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ      NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS
  'One-to-one extension of auth.users: display info and app-level role.';
COMMENT ON COLUMN public.profiles.role IS
  'Application role. Only admins may change this column.';

-- ---------------------------------------------------------------
-- 3. updated_at trigger
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 4. Auto-create profile on auth.users INSERT
--
-- SECURITY DEFINER so the insert succeeds even before RLS is set
-- up for the new user.  ON CONFLICT DO NOTHING is a safety net
-- for backfilling existing users.
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    -- Google OAuth stores the name under 'full_name'; fall back to 'name'.
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------
-- 5. Enable Row-Level Security
-- ---------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------
-- 6. is_admin() helper
--
-- SECURITY DEFINER + explicit search_path prevents the function
-- from triggering its own RLS policies (infinite recursion).
-- Declared STABLE so the planner can cache the result per query.
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.profiles
    WHERE  id   = auth.uid()
    AND    role = 'admin'
  );
$$;

-- ---------------------------------------------------------------
-- 7. RLS policies
--
-- Permissive policies are OR-ed together by PostgreSQL, so a row
-- is accessible if ANY one policy approves it.
-- ---------------------------------------------------------------

-- SELECT: own row
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- SELECT: admins see all rows
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- UPDATE: own row, but role must remain unchanged.
-- The WITH CHECK subquery reads the pre-update role; if the caller
-- attempts to set a different value the policy rejects the write.
-- Handles "no profile yet" gracefully: subquery returns NULL,
-- NULL = <any role> is NULL (falsy), so update is denied — which
-- is correct because you cannot update a non-existent row anyway.
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (
      SELECT p.role
      FROM   public.profiles p
      WHERE  p.id = auth.uid()
    )
  );

-- UPDATE: admins can modify any row, including the role column.
-- No WITH CHECK means the USING expression doubles as the check.
CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());
