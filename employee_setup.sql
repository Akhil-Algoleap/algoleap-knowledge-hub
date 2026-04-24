-- 1. Create the Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Only admins can manage employees
CREATE POLICY employees_admin_all ON public.employees
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can view the employee list (needed for some UI elements if necessary, otherwise restrict to admins)
-- For now, let's keep it admin-only for security as per the plan
-- CREATE POLICY employees_read ON public.employees FOR SELECT TO authenticated USING (true);

-- 4. Update the Auth Hook to restrict access to whitelisted employees only
CREATE OR REPLACE FUNCTION public.restrict_to_algoleap(event jsonb) 
RETURNS jsonb LANGUAGE plpgsql AS $$ 
BEGIN 
  -- Check if the email exists in the employees table
  IF NOT EXISTS (
    SELECT 1 FROM public.employees 
    WHERE email = (event->>'email')
  ) THEN 
    RAISE EXCEPTION 'Access denied. Only registered employees can access the Knowledge Hub.'; 
  END IF; 
  
  RETURN event; 
END; 
$$;

-- 5. Grant permissions (if needed)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.employees TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
