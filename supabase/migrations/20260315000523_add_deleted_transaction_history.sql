-- 1. Create the 'recently_deleted_transactions' table
CREATE TABLE public.recently_deleted_transactions (
  id bigint PRIMARY KEY,
  type text,
  amount numeric,
  note text,
  transaction_date timestamptz,
  deleted_at timestamptz DEFAULT now(),
  original_created_at timestamptz,
  user_id uuid REFERENCES public.profiles(id),
  deleted_by uuid REFERENCES public.profiles(id)
);

-- 2. Create the Trigger Function to copy data on delete
CREATE OR REPLACE FUNCTION handle_transaction_deletion()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.recently_deleted_transactions (
  id, type, amount, note, transaction_date, original_created_at, user_id, deleted_by
)
VALUES (
         OLD.id, OLD.type, OLD.amount, OLD.note, OLD.transaction_date, OLD.created_at, OLD.user_id, auth.uid()
       );
RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the Trigger
CREATE TRIGGER tr_on_transaction_deleted
  BEFORE DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION handle_transaction_deletion();

-- 4. Security (RLS) for the new table
ALTER TABLE public.recently_deleted_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone logged in can view all deleted transactions"
  ON public.recently_deleted_transactions FOR SELECT
  TO authenticated USING (true);
