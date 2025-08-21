import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calculator, Banknote, Shield } from 'lucide-react';

interface BorrowingActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: 'borrow' | 'payment' | 'collateral' | 'apply';
  loan?: {
    id: string;
    borrowed_asset: string;
    borrowed_amount: number;
    collateral_asset: string;
    payment_amount: number;
    health_factor: number;
  };
  wallets: Array<{ token: string; balance: number }>;
  onAction: (data: any) => Promise<boolean>;
  loading: boolean;
}

export function BorrowingActionDialog({
  open,
  onClose,
  action,
  loan,
  wallets,
  onAction,
  loading
}: BorrowingActionDialogProps) {
  const [amount, setAmount] = useState('');
  const [borrowAsset, setBorrowAsset] = useState('USDT');
  const [collateralAsset, setCollateralAsset] = useState('ETH');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [ltvRatio, setLtvRatio] = useState([65]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) return;

    let actionData;
    switch (action) {
      case 'borrow':
        actionData = { asset: borrowAsset, amount: numAmount };
        break;
      case 'payment':
        actionData = { loanId: loan?.id, amount: numAmount };
        break;
      case 'collateral':
        actionData = { loanId: loan?.id, amount: numAmount };
        break;
      case 'apply':
        actionData = {
          borrowedAsset: borrowAsset,
          borrowedAmount: numAmount,
          collateralAsset,
          collateralAmount: parseFloat(collateralAmount),
          interestRate: 9.2,
          ltvRatio: ltvRatio[0]
        };
        break;
      default:
        return;
    }

    const success = await onAction(actionData);
    
    if (success) {
      setAmount('');
      setCollateralAmount('');
      onClose();
    }
  };

  const getDialogTitle = () => {
    switch (action) {
      case 'borrow': return `Borrow ${borrowAsset}`;
      case 'payment': return `Make Payment`;
      case 'collateral': return 'Add Collateral';
      case 'apply': return 'Apply for Loan';
      default: return 'Action';
    }
  };

  const getIcon = () => {
    switch (action) {
      case 'borrow': return Banknote;
      case 'payment': return Banknote;
      case 'collateral': return Shield;
      case 'apply': return Calculator;
      default: return Calculator;
    }
  };

  const Icon = getIcon();

  const getUserBalance = (token: string) => {
    const wallet = wallets.find(w => w.token === token);
    return wallet?.balance || 0;
  };

  const numAmount = parseFloat(amount) || 0;
  const numCollateralAmount = parseFloat(collateralAmount) || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {action === 'borrow' && `Borrow ${borrowAsset} against your collateral`}
            {action === 'payment' && 'Make a payment towards your loan'}
            {action === 'collateral' && 'Add more collateral to improve your health factor'}
            {action === 'apply' && 'Apply for a new loan with specified terms'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loan && (
            <div className="p-4 rounded-lg bg-muted/20 border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Borrowed</span>
                <span className="font-semibold">{loan.borrowed_amount} {loan.borrowed_asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Health Factor</span>
                <Badge variant={loan.health_factor > 1.5 ? 'secondary' : 'destructive'}>
                  {loan.health_factor.toFixed(2)}
                </Badge>
              </div>
              {action === 'payment' && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Payment</span>
                  <span className="font-semibold">${loan.payment_amount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {action === 'apply' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Borrow Asset</Label>
                <Select value={borrowAsset} onValueChange={setBorrowAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Collateral Asset</Label>
                <Select value={collateralAsset} onValueChange={setCollateralAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ATOM">ATOM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">
              {action === 'apply' ? 'Loan Amount' : 'Amount'}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0"
              className="text-right text-lg"
            />
            <div className="text-xs text-muted-foreground">
              {action === 'payment' && loan && 
                `Available: ${getUserBalance(loan.borrowed_asset)} ${loan.borrowed_asset}`
              }
              {action === 'collateral' && loan && 
                `Available: ${getUserBalance(loan.collateral_asset)} ${loan.collateral_asset}`
              }
            </div>
          </div>

          {action === 'apply' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="collateralAmount">Collateral Amount</Label>
                <Input
                  id="collateralAmount"
                  type="number"
                  placeholder="0.0"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  step="0.000001"
                  min="0"
                  className="text-right text-lg"
                />
                <div className="text-xs text-muted-foreground">
                  Available: {getUserBalance(collateralAsset)} {collateralAsset}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>LTV Ratio</Label>
                  <span className="text-sm font-bold">{ltvRatio[0]}%</span>
                </div>
                <Slider
                  value={ltvRatio}
                  onValueChange={setLtvRatio}
                  max={75}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}

          {(action === 'apply' && numAmount > 0 && numCollateralAmount > 0) && (
            <div className="p-4 rounded-lg bg-muted/20 border space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estimated Interest Rate</span>
                <span className="font-bold text-primary">9.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Payment</span>
                <span className="font-bold">${((numAmount * 0.092) / 12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Health Factor</span>
                <span className="font-bold text-green-500">
                  {((numCollateralAmount * 0.75) / numAmount).toFixed(2)}
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
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              className="flex-1"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {action === 'borrow' && 'Borrow'}
              {action === 'payment' && 'Pay'}
              {action === 'collateral' && 'Add'}
              {action === 'apply' && 'Apply'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}