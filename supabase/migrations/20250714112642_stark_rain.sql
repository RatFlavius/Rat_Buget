-- Test if we can create a simple table first
-- Run this in Supabase SQL Editor to test

-- First, let's check if we can create tables at all
CREATE TABLE IF NOT EXISTS test_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;

-- Create a simple policy
CREATE POLICY "Anyone can read test_table"
  ON test_table
  FOR SELECT
  TO public
  USING (true);

-- Insert a test row
INSERT INTO test_table (name) VALUES ('Test entry');

-- Check if it works
SELECT * FROM test_table;