-- Fix RLS policies to allow profile creation during signup
-- The issue is that during signup, auth.uid() is not yet available
-- So we need to adjust the policies to allow initial profile creation

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Students can insert their own profile" ON public.student_profiles;
DROP POLICY IF EXISTS "Staff can insert their own profile" ON public.staff_profiles;

-- Create new policies that allow profile creation during signup
-- For profiles table - allow insert if the id matches the authenticated user
CREATE POLICY "Users can insert their own profile during signup"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- For student_profiles - allow insert if user_id matches authenticated user
CREATE POLICY "Students can insert their own profile during signup"
ON public.student_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- For staff_profiles - allow insert if user_id matches authenticated user
CREATE POLICY "Staff can insert their own profile during signup"
ON public.staff_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);