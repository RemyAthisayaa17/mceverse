-- Add unique constraint for attendance upsert (if not exists)
-- This ensures no duplicate attendance records for same student/subject/date
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'attendance_student_subject_date_key'
  ) THEN
    ALTER TABLE public.attendance 
    ADD CONSTRAINT attendance_student_subject_date_key 
    UNIQUE (student_id, subject_id, date);
  END IF;
END $$;

-- Add index for better query performance on grades
CREATE INDEX IF NOT EXISTS idx_grades_student_subject_term 
ON public.grades(student_id, subject_id);

-- Add index for attendance queries
CREATE INDEX IF NOT EXISTS idx_attendance_student_date 
ON public.attendance(student_id, date);

-- Add index for assignments by department and year
CREATE INDEX IF NOT EXISTS idx_assignments_dept_year 
ON public.assignments(department, academic_year);