import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Shield, Zap, Plus, Wallet } from 'lucide-react';
import { useLending } from '@/hooks/useLending';
import { useAuth } from '@/hooks/useAuth';
import { LendingActionDialog } from '@/components/LendingActionDialog';
import { useToast } from '@/hooks/use-toast';

const Lending = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { pools, positions, wallets, loading, lendToPool, withdrawFromPosition } = useLending();
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'lend' | 'withdraw' | 'stake'>('lend');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);

  // ... keep existing code (mock data arrays)
  
  const handleLendClick = (pool: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access lending features.",
        variant: "destructive",
      });
      return;
    }
    setSelectedPool(pool);
    setDialogAction('lend');
    setDialogOpen(true);
  };

  const handleWithdrawClick = (position: any) => {
    setSelectedPosition(position);
    setDialogAction('withdraw');
    setDialogOpen(true);
  };

  const handleStakeClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to stake assets.",
        variant: "destructive",
      });
      return;
    }
    const usdtPool = pools.find(p => p.token === 'USDT');
    if (usdtPool) {
      setSelectedPool(usdtPool);
      setDialogAction('stake');
      setDialogOpen(true);
    }
  };

  const handleDialogAction = async (amount: number, poolId?: string, positionId?: string) => {
    if (dialogAction === 'lend' || dialogAction === 'stake') {
      return await lendToPool(poolId!, amount);
    } else if (dialogAction === 'withdraw') {
      return await withdrawFromPosition(positionId!, amount);
    }
    return false;
  };

  const getUserBalance = (token: string) => {
    const wallet = wallets.find(w => w.token === token);
    return wallet?.balance || 0;
  };

  // Calculate total stats from real data
  const totalValueLocked = pools.reduce((sum, pool) => sum + pool.total_deposited, 0);
  const averageApy = pools.length > 0 ? pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Lending & Staking</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn passive income by lending your assets to borrowers. Choose from various pools with AI-optimized rates and automated risk management.
          </p>
        </div>

        <Tabs defaultValue="pools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pools">Lending Pools</TabsTrigger>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="stake">Quick Stake</TabsTrigger>
          </TabsList>

          {/* Lending Pools */}
          <TabsContent value="pools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pools.map((pool) => (
                <Card key={pool.id} className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{pool.token}</CardTitle>
                      </div>
                      <Badge variant={pool.risk_level === 'Low' ? 'secondary' : pool.risk_level === 'Medium' ? 'default' : 'destructive'}>
                        {pool.risk_level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{pool.apy}%</div>
                      <div className="text-sm text-muted-foreground">Annual APY</div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Deposited</span>
                        <span className="font-medium">${pool.total_deposited.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">${pool.available_liquidity.toLocaleString()}</span>
                      </div>
                    </div>

                    <Progress value={75} className="h-2" />
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleLendClick(pool)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Lend {pool.token}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">${totalValueLocked.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Value Locked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">98.5%</div>
                      <div className="text-sm text-muted-foreground">Utilization Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{averageApy.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Average APY</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Positions */}
          <TabsContent value="positions" className="space-y-6">
            {positions.length === 0 ? (
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">No lending positions found. Start lending to earn rewards!</div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {positions.map((position) => (
                  <Card key={position.id} className="border-border bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{position.token} Position</span>
                        <Badge variant="outline">{position.apy}% APY</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Deposited</div>
                          <div className="text-xl font-bold">{position.deposited_amount} {position.token}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Earned</div>
                          <div className="text-xl font-bold text-primary">+{position.earned_amount} {position.token}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleWithdrawClick(position)}
                          disabled={loading}
                        >
                          Withdraw
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            const pool = pools.find(p => p.id === position.pool_id);
                            if (pool) handleLendClick(pool);
                          }}
                          disabled={loading}
                        >
                          Add More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Quick Stake */}
          <TabsContent value="stake" className="space-y-6">
            <Card className="max-w-md mx-auto border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Quick Stake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Stake</label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="text-right text-lg"
                  />
                  <div className="text-xs text-muted-foreground">
                    Balance: {getUserBalance('USDT').toLocaleString()} USDT
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Estimated APY</span>
                    <span className="font-bold text-primary">12.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Est. Monthly Earnings</span>
                    <span className="font-bold">{stakeAmount ? ((parseFloat(stakeAmount) * 0.125) / 12).toFixed(2) : '0.00'} USDT</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  disabled={!stakeAmount || loading}
                  onClick={handleStakeClick}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Stake Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <LendingActionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          action={dialogAction}
          pool={selectedPool}
          position={selectedPosition}
          userBalance={selectedPool ? getUserBalance(selectedPool.token) : (selectedPosition ? getUserBalance(selectedPosition.token) : 0)}
          onAction={handleDialogAction}
          loading={loading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Lending;