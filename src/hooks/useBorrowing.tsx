import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Loan {
  id: string;
  loan_id: string;
  borrowed_asset: string;
  borrowed_amount: number;
  collateral_asset: string;
  collateral_amount: number;
  interest_rate: number;
  ltv_ratio: number;
  health_factor: number;
  next_payment_due: string;
  payment_amount: number;
  status: string;
}

interface UserWallet {
  id: string;
  token: string;
  balance: number;
}

export function useBorrowing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [wallets, setWallets] = useState<UserWallet[]>([]);

  // Fetch user loans
  const fetchLoans = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching loans:', error);
      return;
    }
    setLoans(data || []);
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

  // Create a new loan
  const createLoan = async (
    borrowedAsset: string,
    borrowedAmount: number,
    collateralAsset: string,
    collateralAmount: number,
    interestRate: number,
    ltvRatio: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for a loan.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      // Check collateral balance
      const { data: collateralWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', collateralAsset)
        .single();

      if (!collateralWallet || collateralWallet.balance < collateralAmount) {
        toast({
          title: "Insufficient Collateral",
          description: `You don't have enough ${collateralAsset} for collateral.`,
          variant: "destructive",
        });
        return false;
      }

      // Calculate health factor and payment amount
      const healthFactor = (collateralAmount * 0.75) / borrowedAmount; // Simplified calculation
      const monthlyPayment = (borrowedAmount * interestRate / 100) / 12;
      const nextPaymentDue = new Date();
      nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);

      // Generate loan ID
      const loanId = `LOAN-${Date.now().toString().slice(-6)}`;

      // Update collateral wallet (lock collateral)
      await supabase
        .from('user_wallets')
        .update({ balance: collateralWallet.balance - collateralAmount })
        .eq('id', collateralWallet.id);

      // Update borrowed asset wallet (receive loan)
      const { data: borrowWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', borrowedAsset)
        .single();

      if (borrowWallet) {
        await supabase
          .from('user_wallets')
          .update({ balance: borrowWallet.balance + borrowedAmount })
          .eq('id', borrowWallet.id);
      }

      // Create loan record
      await supabase
        .from('loans')
        .insert({
          user_id: user.id,
          loan_id: loanId,
          borrowed_asset: borrowedAsset,
          borrowed_amount: borrowedAmount,
          collateral_asset: collateralAsset,
          collateral_amount: collateralAmount,
          interest_rate: interestRate,
          ltv_ratio: ltvRatio,
          health_factor: healthFactor,
          next_payment_due: nextPaymentDue.toISOString().split('T')[0],
          payment_amount: monthlyPayment,
          status: 'active'
        });

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'borrow',
          asset: borrowedAsset,
          amount: borrowedAmount,
          status: 'completed'
        });

      toast({
        title: "Loan Created Successfully",
        description: `Your loan of ${borrowedAmount} ${borrowedAsset} has been approved.`,
      });

      // Refresh data
      fetchLoans();
      fetchWallets();
      
      return true;
    } catch (error) {
      console.error('Loan creation error:', error);
      toast({
        title: "Loan Creation Failed",
        description: "Failed to process loan application.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Make loan payment
  const makePayment = async (loanId: string, paymentAmount: number) => {
    if (!user) return false;

    setLoading(true);
    
    try {
      const { data: loan } = await supabase
        .from('loans')
        .select('*')
        .eq('id', loanId)
        .single();

      if (!loan) {
        throw new Error('Loan not found');
      }

      // Check payment asset balance
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', loan.borrowed_asset)
        .single();

      if (!wallet || wallet.balance < paymentAmount) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough ${loan.borrowed_asset} to make the payment.`,
          variant: "destructive",
        });
        return false;
      }

      // Update wallet balance
      await supabase
        .from('user_wallets')
        .update({ balance: wallet.balance - paymentAmount })
        .eq('id', wallet.id);

      // Update loan (reduce borrowed amount)
      const newBorrowedAmount = loan.borrowed_amount - paymentAmount;
      const newHealthFactor = (loan.collateral_amount * 0.75) / Math.max(newBorrowedAmount, 0.1);

      if (newBorrowedAmount <= 0) {
        // Loan fully paid - return collateral
        const { data: collateralWallet } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.id)
          .eq('token', loan.collateral_asset)
          .single();

        if (collateralWallet) {
          await supabase
            .from('user_wallets')
            .update({ balance: collateralWallet.balance + loan.collateral_amount })
            .eq('id', collateralWallet.id);
        }

        await supabase
          .from('loans')
          .update({ status: 'paid' })
          .eq('id', loanId);
      } else {
        await supabase
          .from('loans')
          .update({ 
            borrowed_amount: newBorrowedAmount,
            health_factor: newHealthFactor
          })
          .eq('id', loanId);
      }

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'repay',
          asset: loan.borrowed_asset,
          amount: paymentAmount,
          reference_id: loanId,
          status: 'completed'
        });

      toast({
        title: "Payment Successful",
        description: `Successfully paid ${paymentAmount} ${loan.borrowed_asset}.`,
      });

      // Refresh data
      fetchLoans();
      fetchWallets();
      
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add collateral to loan
  const addCollateral = async (loanId: string, additionalCollateral: number) => {
    if (!user) return false;

    setLoading(true);
    
    try {
      const { data: loan } = await supabase
        .from('loans')
        .select('*')
        .eq('id', loanId)
        .single();

      if (!loan) {
        throw new Error('Loan not found');
      }

      // Check collateral balance
      const { data: collateralWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', loan.collateral_asset)
        .single();

      if (!collateralWallet || collateralWallet.balance < additionalCollateral) {
        toast({
          title: "Insufficient Collateral",
          description: `You don't have enough ${loan.collateral_asset} to add as collateral.`,
          variant: "destructive",
        });
        return false;
      }

      // Update wallet balance
      await supabase
        .from('user_wallets')
        .update({ balance: collateralWallet.balance - additionalCollateral })
        .eq('id', collateralWallet.id);

      // Update loan collateral and health factor
      const newCollateralAmount = loan.collateral_amount + additionalCollateral;
      const newHealthFactor = (newCollateralAmount * 0.75) / loan.borrowed_amount;

      await supabase
        .from('loans')
        .update({ 
          collateral_amount: newCollateralAmount,
          health_factor: newHealthFactor
        })
        .eq('id', loanId);

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'add_collateral',
          asset: loan.collateral_asset,
          amount: additionalCollateral,
          reference_id: loanId,
          status: 'completed'
        });

      toast({
        title: "Collateral Added",
        description: `Successfully added ${additionalCollateral} ${loan.collateral_asset} as collateral.`,
      });

      // Refresh data
      fetchLoans();
      fetchWallets();
      
      return true;
    } catch (error) {
      console.error('Add collateral error:', error);
      toast({
        title: "Failed to Add Collateral",
        description: "Failed to add collateral to loan.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLoans();
      fetchWallets();
    }
  }, [user]);

  return {
    loans,
    wallets,
    loading,
    createLoan,
    makePayment,
    addCollateral,
    fetchLoans,
    fetchWallets
  };
}