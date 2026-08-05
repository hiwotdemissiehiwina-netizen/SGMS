/*
# SGMS Schema - Departments, Admins, Grievances

1. New Tables
- `departments`: college departments (name, code, description)
- `admins`: department/super admin accounts (username, password bcrypt, full_name, role, department_id)
- `grievances`: student-submitted grievances with ticket tracking, status, escalation, responses

2. Security
- Enable RLS on all tables.
- The app has an admin login screen but stores admin credentials in `admins` (not auth.users), and the
  student portal is fully public (no auth). To keep the anon-key frontend working for both public student
  submission/tracking AND admin operations, policies allow anon+authenticated CRUD on all tables.
  This matches the existing app design where the browser talks directly to the API routes which talk to DB.
*/

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_departments" ON departments;
CREATE POLICY "anon_select_departments" ON departments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_departments" ON departments;
CREATE POLICY "anon_insert_departments" ON departments FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_departments" ON departments;
CREATE POLICY "anon_update_departments" ON departments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_departments" ON departments;
CREATE POLICY "anon_delete_departments" ON departments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'department_admin',
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admins" ON admins;
CREATE POLICY "anon_select_admins" ON admins FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_admins" ON admins;
CREATE POLICY "anon_insert_admins" ON admins FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_admins" ON admins;
CREATE POLICY "anon_update_admins" ON admins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_admins" ON admins;
CREATE POLICY "anon_delete_admins" ON admins FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text NOT NULL UNIQUE,
  student_name text DEFAULT 'Anonymous',
  student_id text DEFAULT 'N/A',
  department text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  subject text,
  category text,
  message text,
  description text,
  details text,
  reason text,
  is_anonymous boolean DEFAULT false,
  is_escalated boolean DEFAULT false,
  status text NOT NULL DEFAULT 'Pending',
  responses jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_grievances" ON grievances;
CREATE POLICY "anon_select_grievances" ON grievances FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_grievances" ON grievances;
CREATE POLICY "anon_insert_grievances" ON grievances FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_grievances" ON grievances;
CREATE POLICY "anon_update_grievances" ON grievances FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_grievances" ON grievances;
CREATE POLICY "anon_delete_grievances" ON grievances FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_grievances_ticket_id ON grievances(ticket_id);
CREATE INDEX IF NOT EXISTS idx_grievances_department_id ON grievances(department_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
