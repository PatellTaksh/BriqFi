-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create lending pools table
CREATE TABLE public.lending_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token VARCHAR(10) NOT NULL,
  apy DECIMAL(5,2) NOT NULL,
  total_deposited DECIMAL(20,8) NOT NULL DEFAULT 0,
  available_liquidity DECIMAL(20,8) NOT NULL DEFAULT 0,
  risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user lending positions table
CREATE TABLE public.user_lending_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id UUID NOT NULL REFERENCES public.lending_pools(id) ON DELETE CASCADE,
  deposited_amount DECIMAL(20,8) NOT NULL DEFAULT 0,
  earned_amount DECIMAL(20,8) NOT NULL DEFAULT 0,
  last_reward_update TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pool_id)
);

-- Create user wallets/balances table
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(10) NOT NULL,
  balance DECIMAL(20,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Create borrowing loans table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_id VARCHAR(20) NOT NULL UNIQUE,
  borrowed_asset VARCHAR(10) NOT NULL,
  borrowed_amount DECIMAL(20,8) NOT NULL,
  collateral_asset VARCHAR(10) NOT NULL,
  collateral_amount DECIMAL(20,8) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  ltv_ratio DECIMAL(5,2) NOT NULL,
  health_factor DECIMAL(10,2) NOT NULL,
  next_payment_due DATE,
  payment_amount DECIMAL(20,8),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid', 'liquidated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for tracking all operations
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('lend', 'withdraw', 'borrow', 'repay', 'add_collateral', 'liquidate')),
  asset VARCHAR(10) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  reference_id UUID, -- Can reference lending position, loan, etc.
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lending_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for lending pools (public read)
CREATE POLICY "Everyone can view lending pools" 
ON public.lending_pools FOR SELECT 
USING (true);

-- Create RLS policies for user lending positions
CREATE POLICY "Users can view their own lending positions" 
ON public.user_lending_positions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lending positions" 
ON public.user_lending_positions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lending positions" 
ON public.user_lending_positions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user wallets
CREATE POLICY "Users can view their own wallet" 
ON public.user_wallets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" 
ON public.user_wallets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" 
ON public.user_wallets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for loans
CREATE POLICY "Users can view their own loans" 
ON public.loans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own loans" 
ON public.loans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loans" 
ON public.loans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
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

-- Insert initial lending pool data
INSERT INTO public.lending_pools (token, apy, total_deposited, available_liquidity, risk_level) VALUES
('USDT', 12.50, 2400000, 800000, 'Low'),
('ETH', 8.70, 1800000, 600000, 'Medium'),
('BTC', 6.30, 3200000, 1200000, 'Low'),
('ATOM', 15.20, 950000, 400000, 'High');