-- Fix: Remove overly permissive policy - only allow users to view their own profile
-- or profiles of collaborators on shared trips
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Users can always view their own profile
DROP POLICY IF EXISTS "Users can always view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can view profiles of collaborators on their shared trips
CREATE POLICY "Users can view collaborator profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM collaborators c1
    JOIN collaborators c2 ON c1.trip_id = c2.trip_id
    WHERE c1.user_id = auth.uid()
    AND c2.user_id = profiles.user_id
  )
  OR
  EXISTS (
    SELECT 1 FROM trips t
    JOIN collaborators c ON t.id = c.trip_id
    WHERE t.user_id = auth.uid()
    AND c.user_id = profiles.user_id
  )
  OR
  EXISTS (
    SELECT 1 FROM trips t
    JOIN collaborators c ON t.id = c.trip_id
    WHERE c.user_id = auth.uid()
    AND t.user_id = profiles.user_id
  )
);