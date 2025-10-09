-- Create assignments table for staff to post assignments
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  posted_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student notifications table
CREATE TABLE public.student_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for assignments
CREATE POLICY "Staff can insert assignments" 
ON public.assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can update assignments" 
ON public.assignments 
FOR UPDATE 
USING (true);

CREATE POLICY "Staff can delete assignments" 
ON public.assignments 
FOR DELETE 
USING (true);

CREATE POLICY "Staff can view all assignments" 
ON public.assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Students can view assignments for their department and year" 
ON public.assignments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE student_profiles.user_id = auth.uid()
    AND student_profiles.department = assignments.department
    AND student_profiles.academic_year = assignments.academic_year
  )
);

-- Enable RLS on notifications
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Students can view their own notifications" 
ON public.student_notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE student_profiles.id = student_notifications.student_id
    AND student_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own notifications" 
ON public.student_notifications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE student_profiles.id = student_notifications.student_id
    AND student_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can insert notifications" 
ON public.student_notifications 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updated_at on assignments
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_assignments_department_year ON public.assignments(department, academic_year);
CREATE INDEX idx_notifications_student_id ON public.student_notifications(student_id);
CREATE INDEX idx_notifications_is_read ON public.student_notifications(is_read);