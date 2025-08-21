-- Drop triggers that depend on the function
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_lending_pools_updated_at ON public.lending_pools;  
DROP TRIGGER IF EXISTS update_user_lending_positions_updated_at ON public.user_lending_positions;
DROP TRIGGER IF EXISTS update_user_wallets_updated_at ON public.user_wallets;
DROP TRIGGER IF EXISTS update_loans_updated_at ON public.loans;

-- Now drop and recreate the function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

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

-- Recreate all the triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lending_pools_updated_at
  BEFORE UPDATE ON public.lending_pools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_lending_positions_updated_at
  BEFORE UPDATE ON public.user_lending_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON public.user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'User'));
  
  -- Initialize default wallet balances for testing
  INSERT INTO public.user_wallets (user_id, token, balance) VALUES
  (NEW.id, 'USDT', 10000),  
  (NEW.id, 'ETH', 5),
  (NEW.id, 'BTC', 0.1),
  (NEW.id, 'ATOM', 100);
  
  RETURN NEW;
END;
$$;

-- Create trigger to run function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();