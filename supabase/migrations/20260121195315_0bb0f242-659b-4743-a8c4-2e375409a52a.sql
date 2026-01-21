-- Fix 1: Profiles table - Remove public access, allow authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Also allow viewing own profile (for edge cases)
CREATE POLICY "Users can always view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Fix 2: User roles table - Add proper RLS policies
-- Users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only service role can modify roles (through admin edge function)
-- These policies block all client-side modifications
CREATE POLICY "Block all inserts from clients"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block all updates from clients"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Block all deletes from clients"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);