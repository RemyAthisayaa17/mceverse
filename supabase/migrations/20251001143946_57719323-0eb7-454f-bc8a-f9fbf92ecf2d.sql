-- Create student_profiles table with nullable user_id
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  register_number text UNIQUE NOT NULL,
  academic_year text NOT NULL,
  department text NOT NULL,
  phone_number text,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  file_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Student profiles policies
CREATE POLICY "Students can view their own profile"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all student profiles"
  ON public.student_profiles FOR SELECT
  USING (true);

-- Attendance policies
CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = attendance.student_id
  ));

CREATE POLICY "Staff can view all attendance"
  ON public.attendance FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update attendance"
  ON public.attendance FOR UPDATE
  USING (true);

-- Resources policies
CREATE POLICY "Students can view resources"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage resources"
  ON public.resources FOR ALL
  USING (true);

-- Create trigger for updating student_profiles timestamp
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();