/*
# Create shared_models table (single-tenant, no auth required)

1. New Tables
   - `shared_models`
     - `id` (uuid, primary key) - unique shareable identifier
     - `name` (text, not null) - user-provided model name
     - `glb_url` (text, not null) - the Meshy GLB asset URL (original, not proxied)
     - `created_at` (timestamptz) - when the model was shared

2. Security
   - Enable RLS on `shared_models`.
   - Allow anon + authenticated SELECT (anyone with the link can view).
   - Allow anon + authenticated INSERT (the generator can save without auth).
   - No UPDATE or DELETE needed (shared links are permanent).
*/

CREATE TABLE IF NOT EXISTS shared_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  glb_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shared_models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_shared_models" ON shared_models;
CREATE POLICY "anon_select_shared_models" ON shared_models FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shared_models" ON shared_models;
CREATE POLICY "anon_insert_shared_models" ON shared_models FOR INSERT
  TO anon, authenticated WITH CHECK (true);
