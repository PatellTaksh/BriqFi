import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Brain, Calculator, Shield, AlertTriangle, TrendingDown, Banknote } from 'lucide-react';

const Borrowing = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [ltvRatio, setLtvRatio] = useState([65]);

  const aiCreditScore = 742;
  const creditTier = 'Excellent';

  const loanOptions = [
    {
      asset: 'USDT',
      minRate: '8.5%',
      maxRate: '12.3%',
      aiRate: '9.2%',
      maxLtv: '75%',
      available: '$1.2M'
    },
    {
      asset: 'USDC',
      minRate: '8.3%',
      maxRate: '11.8%',
      aiRate: '8.9%',
      maxLtv: '75%',
      available: '$980K'
    },
    {
      asset: 'DAI',
      minRate: '8.7%',
      maxRate: '12.5%',
      aiRate: '9.4%',
      maxLtv: '70%',
      available: '$750K'
    }
  ];

  const collateralAssets = [
    { asset: 'ETH', value: '2,250', amount: '1.2', ltv: '75%' },
    { asset: 'BTC', value: '42,500', amount: '0.05', ltv: '70%' },
    { asset: 'ATOM', value: '850', amount: '150', ltv: '65%' }
  ];

  const activeLoans = [
    {
      id: 'LOAN-001',
      asset: 'USDT',
      amount: '5,000',
      collateral: 'ETH',
      collateralAmount: '2.8',
      rate: '9.2%',
      ltv: '68%',
      healthFactor: 1.47,
      nextPayment: '2024-02-15',
      paymentAmount: '127.50'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">AI-Powered Borrowing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access competitive loans with AI-generated rates based on your credit score and market conditions. Manage collateral efficiently with real-time monitoring.
          </p>
        </div>

        {/* AI Credit Score */}
        <Card className="mb-8 border-border bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Credit Score</h3>
                  <p className="text-muted-foreground">Real-time creditworthiness assessment</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{aiCreditScore}</div>
                <Badge variant="secondary" className="mt-2">{creditTier}</Badge>
              </div>
            </div>
            <Progress value={(aiCreditScore / 850) * 100} className="mt-4 h-3" />
          </CardContent>
        </Card>

        <Tabs defaultValue="borrow" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="loans">Active Loans</TabsTrigger>
            <TabsTrigger value="collateral">Collateral</TabsTrigger>
            <TabsTrigger value="calculator">Loan Calculator</TabsTrigger>
          </TabsList>

          {/* Borrow */}
          <TabsContent value="borrow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {loanOptions.map((option) => (
                <Card key={option.asset} className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{option.asset}</span>
                      <Badge variant="outline">AI Optimized</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{option.aiRate}</div>
                      <div className="text-sm text-muted-foreground">Your AI Rate</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate Range</span>
                        <span>{option.minRate} - {option.maxRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max LTV</span>
                        <span>{option.maxLtv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{option.available}</span>
                      </div>
                    </div>

                    <Button className="w-full">
                      Borrow {option.asset}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Loans */}
          <TabsContent value="loans" className="space-y-6">
            {activeLoans.map((loan) => (
              <Card key={loan.id} className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{loan.id}</CardTitle>
                    <Badge variant={loan.healthFactor > 1.5 ? 'secondary' : loan.healthFactor > 1.2 ? 'default' : 'destructive'}>
                      Health: {loan.healthFactor}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Borrowed</div>
                      <div className="text-xl font-bold">{loan.amount} {loan.asset}</div>
                      <div className="text-sm text-muted-foreground">@ {loan.rate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Collateral</div>
                      <div className="text-xl font-bold">{loan.collateralAmount} {loan.collateral}</div>
                      <div className="text-sm text-muted-foreground">LTV: {loan.ltv}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Next Payment</div>
                      <div className="text-lg font-bold">${loan.paymentAmount}</div>
                      <div className="text-sm text-muted-foreground">{loan.nextPayment}</div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm">Make Payment</Button>
                      <Button variant="outline" size="sm">Add Collateral</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Collateral Management */}
          <TabsContent value="collateral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collateralAssets.map((asset) => (
                <Card key={asset.asset} className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>{asset.asset}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-bold">{asset.amount} {asset.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Value</span>
                        <span className="font-bold">${asset.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max LTV</span>
                        <span className="font-bold">{asset.ltv}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">Withdraw</Button>
                      <Button size="sm" className="flex-1">Add More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="max-w-2xl mx-auto border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Loan Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loan Amount</label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asset</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdt">USDT</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="dai">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Collateral Amount</label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">LTV Ratio</label>
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

                <div className="p-4 rounded-lg bg-muted/20 border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Interest Rate</span>
                    <span className="font-bold text-primary">9.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Payment</span>
                    <span className="font-bold">${loanAmount ? ((parseFloat(loanAmount) * 0.092) / 12).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Health Factor</span>
                    <span className="font-bold text-green-500">1.47</span>
                  </div>
                </div>

                <Button className="w-full">
                  Apply for Loan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Borrowing;