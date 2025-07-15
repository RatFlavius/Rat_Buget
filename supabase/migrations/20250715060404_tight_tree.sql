/*
  # Fix family members relationship

  1. Tables
    - Ensure `family_members` table exists with proper structure
    - Update `profiles` table with family-related columns
    - Add proper foreign key constraints

  2. Security
    - Enable RLS on all tables
    - Add policies for family-based access
*/

-- Create family_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  nickname text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add family-related columns to profiles if they don't exist
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
END $$;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'family_members_user_id_fkey'
  ) THEN
    ALTER TABLE family_members 
    ADD CONSTRAINT family_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'family_members_created_by_fkey'
  ) THEN
    ALTER TABLE family_members 
    ADD CONSTRAINT family_members_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES profiles(user_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for family_members
DROP POLICY IF EXISTS "Users can read family members" ON family_members;
CREATE POLICY "Users can read family members"
  ON family_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.family_id = family_members.family_id
    )
  );

DROP POLICY IF EXISTS "Admins can insert family members" ON family_members;
CREATE POLICY "Admins can insert family members"
  ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
      AND profiles.family_id = family_members.family_id
    )
  );

DROP POLICY IF EXISTS "Admins can update family members" ON family_members;
CREATE POLICY "Admins can update family members"
  ON family_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
      AND profiles.family_id = family_members.family_id
    )
  );

DROP POLICY IF EXISTS "Admins can delete family members" ON family_members;
CREATE POLICY "Admins can delete family members"
  ON family_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
      AND profiles.family_id = family_members.family_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_family_id ON profiles(family_id);