/*
  # Add user roles and family management

  1. New Tables
    - Update `profiles` table to include role and family management
    - Add `family_members` table for managing family relationships
    
  2. Security
    - Update RLS policies for role-based access
    - Add policies for family member management
    
  3. Changes
    - Add role field to profiles (admin/user)
    - Add nickname field to profiles
    - Add family_id for grouping family members
    - Add created_by field to track who created the account
*/

-- Add new columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('admin', 'user'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'nickname'
  ) THEN
    ALTER TABLE profiles ADD COLUMN nickname text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'family_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN family_id uuid;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_by uuid REFERENCES profiles(user_id);
  END IF;
END $$;

-- Create family_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  nickname text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(family_id, user_id)
);

-- Enable RLS on family_members
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for family_members
CREATE POLICY "Family members can read own family data"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm2 
      WHERE fm2.family_id = family_members.family_id 
      AND fm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert family members"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members fm 
      WHERE fm.family_id = family_members.family_id 
      AND fm.user_id = auth.uid() 
      AND fm.role = 'admin'
    )
  );

CREATE POLICY "Admins can update family members"
  ON family_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm 
      WHERE fm.family_id = family_members.family_id 
      AND fm.user_id = auth.uid() 
      AND fm.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete family members"
  ON family_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm 
      WHERE fm.family_id = family_members.family_id 
      AND fm.user_id = auth.uid() 
      AND fm.role = 'admin'
    )
  );

-- Update profiles RLS policies to work with family system
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

CREATE POLICY "Users can read own profile and family profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members fm1, family_members fm2
      WHERE fm1.user_id = auth.uid() 
      AND fm2.user_id = profiles.user_id
      AND fm1.family_id = fm2.family_id
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Update expenses policies to work with family system
DROP POLICY IF EXISTS "Users can read own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;

CREATE POLICY "Users can read family expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members fm1, family_members fm2
      WHERE fm1.user_id = auth.uid() 
      AND fm2.user_id = expenses.user_id
      AND fm1.family_id = fm2.family_id
    )
  );

CREATE POLICY "Users can insert own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Update incomes policies to work with family system
DROP POLICY IF EXISTS "Users can read own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can insert own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can update own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can delete own incomes" ON incomes;

CREATE POLICY "Users can read family incomes"
  ON incomes
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members fm1, family_members fm2
      WHERE fm1.user_id = auth.uid() 
      AND fm2.user_id = incomes.user_id
      AND fm1.family_id = fm2.family_id
    )
  );

CREATE POLICY "Users can insert own incomes"
  ON incomes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own incomes"
  ON incomes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own incomes"
  ON incomes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_family_id ON profiles(family_id);