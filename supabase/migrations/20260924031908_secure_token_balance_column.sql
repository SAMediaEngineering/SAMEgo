/*
# Secure token_balance column against client manipulation

1. Changes
  - Revoke direct UPDATE on `profiles` from `authenticated` role.
  - Grant UPDATE only on safe columns (none currently besides token_balance, so no user-editable columns granted yet).
  - Create a SECURITY DEFINER function `deduct_tokens(p_amount int)` that:
    - Checks caller is authenticated.
    - Atomically checks balance >= p_amount and deducts.
    - Returns the new balance.
  - Create a SECURITY DEFINER function `refund_tokens(p_amount int)` for rollback on API failure.
  - Both functions revoke EXECUTE from anon.

2. Security
  - token_balance cannot be changed via the data API by the client.
  - Only server-side code (or RPC) through these functions can modify the balance.
  - Atomic check-and-deduct prevents race conditions.
*/

-- Revoke all UPDATE from authenticated; no user-editable columns on profiles yet
REVOKE UPDATE ON profiles FROM authenticated;

-- Atomic deduct function
CREATE OR REPLACE FUNCTION deduct_tokens(p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_new_balance integer;
BEGIN
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 1000 THEN
    RAISE EXCEPTION 'Invalid token amount';
  END IF;

  UPDATE profiles
  SET token_balance = token_balance - p_amount,
      updated_at = now()
  WHERE id = auth.uid()
    AND token_balance >= p_amount
  RETURNING token_balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Insufficient token balance';
  END IF;

  RETURN v_new_balance;
END;
$$;

REVOKE EXECUTE ON FUNCTION deduct_tokens FROM anon;
GRANT EXECUTE ON FUNCTION deduct_tokens TO authenticated;

-- Refund function for rollback on external API failure
CREATE OR REPLACE FUNCTION refund_tokens(p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_new_balance integer;
BEGIN
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 1000 THEN
    RAISE EXCEPTION 'Invalid token amount';
  END IF;

  UPDATE profiles
  SET token_balance = token_balance + p_amount,
      updated_at = now()
  WHERE id = auth.uid()
  RETURNING token_balance INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  RETURN v_new_balance;
END;
$$;

REVOKE EXECUTE ON FUNCTION refund_tokens FROM anon;
GRANT EXECUTE ON FUNCTION refund_tokens TO authenticated;
