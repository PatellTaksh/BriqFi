import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LegoBlock } from './LegoBlock';
import { WalletDisplay } from './WalletDisplay';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  Brain,
  Clock,
  Gift,
  Gavel,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardSection() {
  const navigate = useNavigate();
  return (
    <section id="dashboard" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your DeFi <span className="gradient-text">Command Center</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor, manage, and maximize your modular DeFi portfolio in one intuitive dashboard
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Wallet Display */}
          <div className="lg:col-span-1">
            <WalletDisplay />
          </div>

          {/* Credit Score & AI Panel */}
          <div className="lg:col-span-1">
            <LegoBlock color="purple" className="h-full">
              <div className="text-center text-white">
                <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">AI Credit Score</h3>
                <div className="text-5xl font-bold mb-4">785</div>
                <Progress value={78.5} className="mb-4 bg-white/20" />
                <Badge variant="secondary" className="mb-4">Excellent</Badge>
                <p className="text-sm opacity-90">
                  Your AI-powered credit score unlocks better rates and exclusive opportunities
                </p>
              </div>
            </LegoBlock>
          </div>

          {/* Lending Section */}
          <div className="lg:col-span-1">
            <LegoBlock color="cyan" className="h-full">
              <div className="text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Lending Pool</h3>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>USDC</span>
                      <span>12.5% APY</span>
                    </div>
                    <Progress value={65} className="bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>ETH</span>
                      <span>8.2% APY</span>
                    </div>
                    <Progress value={45} className="bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>ANDR</span>
                      <span>15.7% APY</span>
                    </div>
                    <Progress value={80} className="bg-white/20" />
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => navigate('/lending')}
                >
                  Deposit Assets
                </Button>
              </div>
            </LegoBlock>
          </div>

          {/* Borrowing Section */}
          <div className="lg:col-span-1">
            <LegoBlock color="orange" className="h-full">
              <div className="text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Borrowing</h3>
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">$25,400</div>
                    <div className="text-sm opacity-90">Available to Borrow</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Factor</span>
                      <span className="text-green-300">2.45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best Rate</span>
                      <span>6.8% APR</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={() => navigate('/borrowing')}
                >
                  Borrow Now
                </Button>
              </div>
            </LegoBlock>
          </div>
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Live Auctions */}
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Gavel className="h-5 w-5 mr-2 text-lego-red" />
                Live Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>ETH Collateral</span>
                  <span className="text-lego-red">2.5 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Bid</span>
                  <span>$4,250</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Ends in 2h 15m
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Gift className="h-5 w-5 mr-2 text-lego-yellow" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lego-yellow">$1,247</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  Next reward in 12 hours
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Value */}
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="h-5 w-5 mr-2 text-lego-green" />
                Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lego-green">$87,420</div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                </div>
                <div className="flex items-center justify-center text-xs text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% (24h)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Airdrops */}
          <Card className="glow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Star className="h-5 w-5 mr-2 text-lego-purple" />
                Airdrops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">3 Pending</Badge>
                  <div className="text-sm">ANDR Season 2</div>
                  <div className="text-xs text-muted-foreground">~$420 estimated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}