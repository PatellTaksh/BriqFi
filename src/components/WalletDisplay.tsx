import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Eye, EyeOff, Coins } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLending } from '@/hooks/useLending';
import { EmptyState } from '@/components/EmptyState';

export function WalletDisplay() {
  const { user } = useAuth();
  const { wallets, loading } = useLending();
  const [showBalances, setShowBalances] = useState(true);

  if (!user) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Wallet}
            title="Connect Wallet"
            description="Sign in to view your wallet balances and start trading."
            actionLabel="Sign In"
            onAction={() => window.dispatchEvent(new CustomEvent('openAuth'))}
          />
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="h-8 w-8 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading wallet...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = wallets.reduce((sum, wallet) => {
    // Mock conversion rates (in a real app, you'd fetch these from an API)
    const conversionRates: { [key: string]: number } = {
      USDT: 1,
      USDC: 1,
      ETH: 2250,
      BTC: 42500,
      ATOM: 8.5,
    };
    return sum + (wallet.balance * (conversionRates[wallet.token] || 1));
  }, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
          <div className="text-2xl font-bold">
            {showBalances ? `$${totalValue.toLocaleString()}` : '•••••'}
          </div>
        </div>

        <div className="space-y-3">
          {wallets.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="No Assets"
              description="Your wallet is empty. Add funds to start using BriqFi."
            />
          ) : (
            wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                    <span className="text-sm font-bold text-primary">
                      {wallet.token.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{wallet.token}</p>
                    <p className="text-sm text-muted-foreground">
                      {wallet.token === 'BTC' ? 'Bitcoin' : 
                       wallet.token === 'ETH' ? 'Ethereum' :
                       wallet.token === 'USDT' ? 'Tether' :
                       wallet.token === 'USDC' ? 'USD Coin' :
                       wallet.token === 'ATOM' ? 'Cosmos' : wallet.token}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {showBalances 
                      ? `${wallet.balance.toLocaleString()} ${wallet.token}`
                      : '•••••'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {showBalances 
                      ? `$${(wallet.balance * (
                          wallet.token === 'USDT' || wallet.token === 'USDC' ? 1 :
                          wallet.token === 'ETH' ? 2250 :
                          wallet.token === 'BTC' ? 42500 :
                          wallet.token === 'ATOM' ? 8.5 : 1
                        )).toLocaleString()}`
                      : '•••••'
                    }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}