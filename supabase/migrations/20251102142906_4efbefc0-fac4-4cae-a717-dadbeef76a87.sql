-- ============================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- Fixes: RLS policies, role-based access, input validation
-- ============================================

-- Step 1: Create security definer functions for role checking
-- These prevent recursive RLS issues by using SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.is_staff_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_profiles 
    WHERE staff_profiles.user_id = $1
  );
$$;

CREATE OR REPLACE FUNCTION public.is_student_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE student_profiles.user_id = $1
  );
$$;

CREATE OR REPLACE FUNCTION public.get_student_profile_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM student_profiles 
  WHERE student_profiles.user_id = $1
  LIMIT 1;
$$;

-- Step 2: Add database constraints for input validation
-- Fixes: Grade Input Accepts Invalid Values

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'grade_range_check'
  ) THEN
    ALTER TABLE grades ADD CONSTRAINT grade_range_check CHECK (grade >= 0 AND grade <= 100);
  END IF;
END $$;

ALTER TABLE grades ALTER COLUMN assignment_name SET DEFAULT 'General';

-- Add unique constraint for upsert operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_student_subject_date_key'
  ) THEN
    ALTER TABLE attendance ADD CONSTRAINT attendance_student_subject_date_key UNIQUE (student_id, subject_id, date);
  END IF;
END $$;

-- Add unique constraint for grades upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_assignment_key'
  ) THEN
    ALTER TABLE grades ADD CONSTRAINT grades_student_subject_assignment_key UNIQUE (student_id, subject_id, assignment_name);
  END IF;
END $$;

-- Step 3: Fix student_profiles RLS policies
DROP POLICY IF EXISTS "Staff can view all student profiles" ON student_profiles;

CREATE POLICY "Authenticated staff can view student profiles"
ON student_profiles FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

-- Step 4: Fix grades RLS policies
DROP POLICY IF EXISTS "Staff can view all grades" ON grades;
DROP POLICY IF EXISTS "Staff can insert grades" ON grades;
DROP POLICY IF EXISTS "Staff can update grades" ON grades;
DROP POLICY IF EXISTS "Staff can delete grades" ON grades;

CREATE POLICY "Authenticated staff can view grades"
ON grades FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can insert grades"
ON grades FOR INSERT
TO authenticated
WITH CHECK (
  public.is_staff_user(auth.uid()) AND
  graded_by = auth.uid()
);

CREATE POLICY "Authenticated staff can update grades"
ON grades FOR UPDATE
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can delete grades"
ON grades FOR DELETE
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Students can view their own grades"
ON grades FOR SELECT
TO authenticated
USING (student_id = public.get_student_profile_id(auth.uid()));

-- Step 5: Fix attendance RLS policies
DROP POLICY IF EXISTS "Students can view their own attendance" ON attendance;
DROP POLICY IF EXISTS "Staff can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Staff can insert attendance" ON attendance;
DROP POLICY IF EXISTS "Staff can update attendance" ON attendance;

CREATE POLICY "Authenticated staff can view attendance"
ON attendance FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can insert attendance"
ON attendance FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can update attendance"
ON attendance FOR UPDATE
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Students can view their own attendance"
ON attendance FOR SELECT
TO authenticated
USING (student_id = public.get_student_profile_id(auth.uid()));

-- Step 6: Fix subjects RLS policies
DROP POLICY IF EXISTS "Staff can view all subjects" ON subjects;
DROP POLICY IF EXISTS "Staff can insert subjects" ON subjects;

CREATE POLICY "Authenticated staff can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can insert subjects"
ON subjects FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated students can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (public.is_student_user(auth.uid()));

-- Step 7: Fix assignments RLS policies
DROP POLICY IF EXISTS "Staff can insert assignments" ON assignments;
DROP POLICY IF EXISTS "Staff can update assignments" ON assignments;
DROP POLICY IF EXISTS "Staff can delete assignments" ON assignments;
DROP POLICY IF EXISTS "Staff can view all assignments" ON assignments;

CREATE POLICY "Authenticated staff can view assignments"
ON assignments FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can insert assignments"
ON assignments FOR INSERT
TO authenticated
WITH CHECK (
  public.is_staff_user(auth.uid()) AND
  posted_by = auth.uid()
);

CREATE POLICY "Authenticated staff can update assignments"
ON assignments FOR UPDATE
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can delete assignments"
ON assignments FOR DELETE
TO authenticated
USING (public.is_staff_user(auth.uid()));

-- Step 8: Fix resources RLS policies
DROP POLICY IF EXISTS "Staff can manage resources" ON resources;
DROP POLICY IF EXISTS "Students can view resources" ON resources;

CREATE POLICY "Authenticated staff can manage resources"
ON resources FOR ALL
TO authenticated
USING (public.is_staff_user(auth.uid()))
WITH CHECK (
  public.is_staff_user(auth.uid()) AND
  uploaded_by = auth.uid()
);

CREATE POLICY "Authenticated students can view resources"
ON resources FOR SELECT
TO authenticated
USING (public.is_student_user(auth.uid()));

-- Step 9: Fix student_notifications policies
DROP POLICY IF EXISTS "Staff can insert notifications" ON student_notifications;

CREATE POLICY "Authenticated staff can insert notifications"
ON student_notifications FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_user(auth.uid()));

CREATE POLICY "Students can delete their own notifications"
ON student_notifications FOR DELETE
TO authenticated
USING (student_id = public.get_student_profile_id(auth.uid()));

-- Step 10: Fix students table policies (legacy table)
DROP POLICY IF EXISTS "Staff can insert students" ON students;
DROP POLICY IF EXISTS "Staff can update students" ON students;
DROP POLICY IF EXISTS "Staff can view all students" ON students;

CREATE POLICY "Authenticated staff can view students"
ON students FOR SELECT
TO authenticated
USING (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can insert students"
ON students FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_user(auth.uid()));

CREATE POLICY "Authenticated staff can update students"
ON students FOR UPDATE
TO authenticated
USING (public.is_staff_user(auth.uid()));

-- Step 11: Fix update_updated_at_column function search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers for updated_at
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_profiles_updated_at
BEFORE UPDATE ON staff_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
BEFORE UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
BEFORE UPDATE ON schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();