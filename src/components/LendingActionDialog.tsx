import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins } from 'lucide-react';

interface LendingActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: 'lend' | 'withdraw' | 'stake';
  pool?: {
    id: string;
    token: string;
    apy: number;
    risk_level: string;
  };
  position?: {
    id: string;
    token: string;
    deposited_amount: number;
    earned_amount: number;
  };
  userBalance?: number;
  onAction: (amount: number, poolId?: string, positionId?: string) => Promise<boolean>;
  loading: boolean;
}

export function LendingActionDialog({
  open,
  onClose,
  action,
  pool,
  position,
  userBalance = 0,
  onAction,
  loading
}: LendingActionDialogProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) return;

    const success = await onAction(
      numAmount, 
      pool?.id, 
      position?.id
    );
    
    if (success) {
      setAmount('');
      onClose();
    }
  };

  const getDialogTitle = () => {
    switch (action) {
      case 'lend': return `Lend ${pool?.token}`;
      case 'withdraw': return `Withdraw ${position?.token}`;
      case 'stake': return 'Quick Stake';
      default: return 'Action';
    }
  };

  const getMaxAmount = () => {
    switch (action) {
      case 'lend':
      case 'stake':
        return userBalance;
      case 'withdraw':
        return position?.deposited_amount || 0;
      default:
        return 0;
    }
  };

  const maxAmount = getMaxAmount();
  const numAmount = parseFloat(amount) || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {action === 'lend' && `Add funds to the ${pool?.token} lending pool`}
            {action === 'withdraw' && `Withdraw your ${position?.token} from the lending pool`}
            {action === 'stake' && 'Stake your assets to earn rewards'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {pool && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border">
              <div>
                <div className="font-semibold">{pool.token} Pool</div>
                <div className="text-sm text-muted-foreground">APY: {pool.apy}%</div>
              </div>
              <Badge variant={pool.risk_level === 'Low' ? 'secondary' : 'default'}>
                {pool.risk_level} Risk
              </Badge>
            </div>
          )}

          {position && (
            <div className="p-4 rounded-lg bg-muted/20 border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Deposited</span>
                <span className="font-semibold">{position.deposited_amount} {position.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Earned</span>
                <span className="font-semibold text-primary">+{position.earned_amount} {position.token}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0"
              max={maxAmount}
              className="text-right text-lg"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Available: {maxAmount.toLocaleString()} {pool?.token || position?.token || 'USDT'}
              </span>
              {maxAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(maxAmount.toString())}
                  className="text-primary hover:underline"
                >
                  Max
                </button>
              )}
            </div>
          </div>

          {action === 'lend' && numAmount > 0 && (
            <div className="p-4 rounded-lg bg-muted/20 border">
              <div className="flex justify-between text-sm mb-2">
                <span>Estimated APY</span>
                <span className="font-bold text-primary">{pool?.apy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Est. Monthly Earnings</span>
                <span className="font-bold">
                  {((numAmount * (pool?.apy || 0) / 100) / 12).toFixed(6)} {pool?.token}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!amount || numAmount <= 0 || numAmount > maxAmount || loading}
              className="flex-1"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {action === 'lend' && 'Lend'}
              {action === 'withdraw' && 'Withdraw'}
              {action === 'stake' && 'Stake'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}