CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS "trigger"
LANGUAGE "plpgsql"
SECURITY DEFINER
AS $$
BEGIN
INSERT INTO public.profiles (id, display_name, email)
VALUES (
         NEW.id,
         -- 1. Try to get display_name from metadata
         -- 2. If null, use the first part of the email (e.g. "john" from "john@test.com")
         COALESCE(
           NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
         NEW.email
       );
RETURN NEW;
END;
$$;
