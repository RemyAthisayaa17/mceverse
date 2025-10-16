-- Create staff_profiles table
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  department TEXT NOT NULL,
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_profiles
CREATE POLICY "Staff can view their own profile"
  ON public.staff_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can insert their own profile"
  ON public.staff_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update their own profile"
  ON public.staff_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_staff_profiles_updated_at
  BEFORE UPDATE ON public.staff_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create schedules table for persistent schedule storage
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room TEXT NOT NULL,
  students_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for schedules
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedules
CREATE POLICY "Staff can view their own schedules"
  ON public.schedules
  FOR SELECT
  USING (auth.uid() = staff_id);

CREATE POLICY "Staff can insert their own schedules"
  ON public.schedules
  FOR INSERT
  WITH CHECK (auth.uid() = staff_id);

CREATE POLICY "Staff can update their own schedules"
  ON public.schedules
  FOR UPDATE
  USING (auth.uid() = staff_id);

CREATE POLICY "Staff can delete their own schedules"
  ON public.schedules
  FOR DELETE
  USING (auth.uid() = staff_id);

-- Add trigger for updated_at
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();