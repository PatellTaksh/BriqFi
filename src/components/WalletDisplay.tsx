import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Eye, EyeOff, Coins } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useWeb3Lending } from '@/hooks/useWeb3Lending';
import { EmptyState } from '@/components/EmptyState';
import { WalletConnect } from '@/components/WalletConnect';

export function WalletDisplay() {
  const { isConnected } = useAccount();
  const { pools, userPositions, loading, userTokenBalance } = useWeb3Lending();
  const [showBalances, setShowBalances] = useState(true);

  if (!isConnected) {
    return <WalletConnect />;
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

  // Calculate total value from blockchain positions
  const totalValue = userPositions.reduce((sum, position) => {
    const conversionRates: { [key: string]: number } = {
      USDT: 1,
      USDC: 1,
      ETH: 2250,
      BTC: 42500,
      ATOM: 8.5,
    };
    const balance = parseFloat(userTokenBalance || '0');
    return sum + (balance * (conversionRates[position.tokenSymbol] || 1));
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
          {userPositions.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="No Positions"
              description="You haven't deposited any assets yet. Start lending to earn rewards."
            />
          ) : (
            userPositions.map((position) => (
              <div
                key={position.poolId}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                    <span className="text-sm font-bold text-primary">
                      {position.tokenSymbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{position.tokenSymbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {position.tokenSymbol === 'BTC' ? 'Bitcoin' : 
                       position.tokenSymbol === 'ETH' ? 'Ethereum' :
                       position.tokenSymbol === 'USDT' ? 'Tether' :
                       position.tokenSymbol === 'USDC' ? 'USD Coin' :
                       position.tokenSymbol === 'ATOM' ? 'Cosmos' : position.tokenSymbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {showBalances 
                      ? `${(Number(position.depositedAmount) / 1e18).toLocaleString()} ${position.tokenSymbol}`
                      : '•••••'
                    }
                  </p>
                  <p className="text-sm text-primary">
                    {showBalances 
                      ? `+${(Number(position.pendingRewards) / 1e18).toFixed(4)} rewards`
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