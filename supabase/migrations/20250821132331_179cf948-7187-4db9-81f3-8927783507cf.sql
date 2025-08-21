-- Fix function search path security issue
DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'User'));
  
  -- Initialize default wallet balances
  INSERT INTO public.user_wallets (user_id, token, balance) VALUES
  (NEW.id, 'USDT', 10000),  -- Give users initial balance for testing
  (NEW.id, 'ETH', 5),
  (NEW.id, 'BTC', 0.1),
  (NEW.id, 'ATOM', 100);
  
  RETURN NEW;
END;
$$;

-- Create trigger to run function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();