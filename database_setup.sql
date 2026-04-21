-- 1. Create the User Profiles Table
CREATE TABLE profiles (
  id      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email   TEXT,
  role    TEXT DEFAULT 'viewer'
);

-- 2. Create the Auto-Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Set Up Row Level Security (RLS) Policies

-- Enable RLS on both tables
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- All logged-in users can READ artifacts
CREATE POLICY artifacts_read ON artifacts
  FOR SELECT TO authenticated USING (true);

-- Only admins can INSERT, UPDATE, DELETE artifacts
CREATE POLICY artifacts_write ON artifacts
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can only read their own profile
CREATE POLICY profiles_read ON profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

-- 4. Restrict Login to @algoleap.com Emails Only (Auth Hook)
CREATE OR REPLACE FUNCTION public.restrict_to_algoleap(event jsonb) 
RETURNS jsonb LANGUAGE plpgsql AS $$ 
BEGIN 
  IF (event->>'email') NOT LIKE '%@algoleap.com' THEN 
    RAISE EXCEPTION 'Only @algoleap.com accounts are allowed.'; 
  END IF; 
  RETURN event; 
END; 
$$;
