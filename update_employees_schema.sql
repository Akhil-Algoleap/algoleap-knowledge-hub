-- Migration to add role and practice columns to the employees table

ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS practice TEXT;

-- You can also run these updates if you want existing rows to have default values.
-- Otherwise, you can leave them null and assign via the Admin Panel UI later.

-- Example: UPDATE public.employees SET role = 'Administrator', practice = '---' WHERE email = 'akhil.bommera@algoleap.com';
