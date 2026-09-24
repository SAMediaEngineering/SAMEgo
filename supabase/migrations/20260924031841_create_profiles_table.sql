/*
# Create profiles table

1. New Tables
  - `profiles`
    - `id` (uuid, primary key, references auth.users)
    - `token_balance` (integer, not null, default 100) — tracks the user's available generation tokens
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

2. Security
  - Enable RLS on `profiles`.
  - Authenticated users can SELECT their own profile.
  - Authenticated users can INSERT their own profile (for initial creation).
  - Authenticated users can UPDATE their own profile.
  - Authenticated users can DELETE their own profile.

3. Notes
  - New users start with 100 tokens by default.
  - The `id` column matches `auth.users.id` so ownership is enforced via `auth.uid() = id`.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  token_balance integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);
