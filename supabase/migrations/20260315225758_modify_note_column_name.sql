-- Rename column in the main table
ALTER TABLE public.transactions
  RENAME COLUMN note TO transaction_name;

-- Rename column in the deleted history table
ALTER TABLE public.recently_deleted_transactions
  RENAME COLUMN note TO transaction_name;

-- Update the Trigger Function to use 'transaction_name'
CREATE OR REPLACE FUNCTION handle_transaction_deletion()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.recently_deleted_transactions (
  id,
  type,
  amount,
  transaction_name, -- Updated from note
  transaction_date,
  original_created_at,
  user_id,
  deleted_by
)
VALUES (
         OLD.id,
         OLD.type,
         OLD.amount,
         OLD.transaction_name, -- Updated from note
         OLD.transaction_date,
         OLD.created_at,
         OLD.user_id,
         auth.uid()
       );
RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
