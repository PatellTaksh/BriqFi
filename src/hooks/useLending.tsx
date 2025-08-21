import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LendingPool {
  id: string;
  token: string;
  apy: number;
  total_deposited: number;
  available_liquidity: number;
  risk_level: string;
}

interface UserLendingPosition {
  id: string;
  pool_id: string;
  deposited_amount: number;
  earned_amount: number;
  token: string;
  apy: number;
}

interface UserWallet {
  id: string;
  token: string;
  balance: number;
}

export function useLending() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState<LendingPool[]>([]);
  const [positions, setPositions] = useState<UserLendingPosition[]>([]);
  const [wallets, setWallets] = useState<UserWallet[]>([]);

  // Fetch lending pools
  const fetchPools = async () => {
    const { data, error } = await supabase
      .from('lending_pools')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching pools:', error);
      return;
    }
    setPools(data || []);
  };

  // Fetch user positions
  const fetchUserPositions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_lending_positions')
      .select(`
        *,
        lending_pools!inner(token, apy)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching positions:', error);
      return;
    }
    
    const formattedPositions = data?.map(pos => ({
      id: pos.id,
      pool_id: pos.pool_id,
      deposited_amount: pos.deposited_amount,
      earned_amount: pos.earned_amount,
      token: pos.lending_pools.token,
      apy: pos.lending_pools.apy
    })) || [];
    
    setPositions(formattedPositions);
  };

  // Fetch user wallets
  const fetchWallets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wallets:', error);
      return;
    }
    setWallets(data || []);
  };

  // Lend to a pool
  const lendToPool = async (poolId: string, amount: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to lend assets.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      // Get pool info
      const { data: pool } = await supabase
        .from('lending_pools')
        .select('*')
        .eq('id', poolId)
        .single();

      if (!pool) {
        throw new Error('Pool not found');
      }

      // Check user balance
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', pool.token)
        .single();

      if (!wallet || wallet.balance < amount) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough ${pool.token} to lend.`,
          variant: "destructive",
        });
        return false;
      }

      // Update user balance
      await supabase
        .from('user_wallets')
        .update({ balance: wallet.balance - amount })
        .eq('id', wallet.id);

      // Update or create lending position
      const { data: existingPosition } = await supabase
        .from('user_lending_positions')
        .select('*')
        .eq('user_id', user.id)
        .eq('pool_id', poolId)
        .maybeSingle();

      if (existingPosition) {
        await supabase
          .from('user_lending_positions')
          .update({ 
            deposited_amount: existingPosition.deposited_amount + amount 
          })
          .eq('id', existingPosition.id);
      } else {
        await supabase
          .from('user_lending_positions')
          .insert({
            user_id: user.id,
            pool_id: poolId,
            deposited_amount: amount
          });
      }

      // Update pool liquidity
      await supabase
        .from('lending_pools')
        .update({
          total_deposited: pool.total_deposited + amount,
          available_liquidity: pool.available_liquidity + amount
        })
        .eq('id', poolId);

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'lend',
          asset: pool.token,
          amount: amount,
          reference_id: poolId,
          status: 'completed'
        });

      toast({
        title: "Lending Successful",
        description: `Successfully lent ${amount} ${pool.token} to the pool.`,
      });

      // Refresh data
      fetchPools();
      fetchUserPositions();
      fetchWallets();
      
      return true;
    } catch (error) {
      console.error('Lending error:', error);
      toast({
        title: "Lending Failed",
        description: "Failed to process lending transaction.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw from position
  const withdrawFromPosition = async (positionId: string, amount: number) => {
    if (!user) return false;

    setLoading(true);
    
    try {
      const { data: position } = await supabase
        .from('user_lending_positions')
        .select(`
          *,
          lending_pools!inner(token, id)
        `)
        .eq('id', positionId)
        .single();

      if (!position) {
        throw new Error('Position not found');
      }

      if (position.deposited_amount < amount) {
        toast({
          title: "Insufficient Position",
          description: "You cannot withdraw more than your deposited amount.",
          variant: "destructive",
        });
        return false;
      }

      // Update position
      const newDepositedAmount = position.deposited_amount - amount;
      if (newDepositedAmount === 0) {
        await supabase
          .from('user_lending_positions')
          .delete()
          .eq('id', positionId);
      } else {
        await supabase
          .from('user_lending_positions')
          .update({ deposited_amount: newDepositedAmount })
          .eq('id', positionId);
      }

      // Update user balance
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', position.lending_pools.token)
        .single();

      if (wallet) {
        await supabase
          .from('user_wallets')
          .update({ balance: wallet.balance + amount })
          .eq('id', wallet.id);
      }

      // Update pool liquidity
      const { data: pool } = await supabase
        .from('lending_pools')
        .select('*')
        .eq('id', position.lending_pools.id)
        .single();

      if (pool) {
        await supabase
          .from('lending_pools')
          .update({
            total_deposited: pool.total_deposited - amount,
            available_liquidity: pool.available_liquidity - amount
          })
          .eq('id', pool.id);
      }

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'withdraw',
          asset: position.lending_pools.token,
          amount: amount,
          reference_id: positionId,
          status: 'completed'
        });

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} ${position.lending_pools.token}.`,
      });

      // Refresh data
      fetchPools();
      fetchUserPositions();
      fetchWallets();
      
      return true;
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Failed to process withdrawal transaction.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
    if (user) {
      fetchUserPositions();
      fetchWallets();
    }
  }, [user]);

  return {
    pools,
    positions,
    wallets,
    loading,
    lendToPool,
    withdrawFromPosition,
    fetchPools,
    fetchUserPositions,
    fetchWallets
  };
}