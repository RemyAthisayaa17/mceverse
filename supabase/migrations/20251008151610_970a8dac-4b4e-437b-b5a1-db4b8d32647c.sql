-- Allow students to create their own profile during registration
CREATE POLICY "Students can insert their own profile"
ON public.student_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);