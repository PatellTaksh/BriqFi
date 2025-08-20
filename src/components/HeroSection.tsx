import { Button } from '@/components/ui/button';
import { LegoBlock } from './LegoBlock';
import { useNavigate } from 'react-router-dom';
import { 
  Blocks, 
  TrendingUp, 
  Shield, 
  Zap, 
  Star,
  ArrowRight 
} from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      
      {/* Floating Lego Blocks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <LegoBlock color="red" size="sm">
            <TrendingUp className="h-6 w-6 text-white" />
          </LegoBlock>
        </div>
        <div className="absolute top-40 right-20 animate-float float-delayed">
          <LegoBlock color="yellow" size="sm">
            <Shield className="h-6 w-6 text-white" />
          </LegoBlock>
        </div>
        <div className="absolute bottom-40 left-20 animate-float float-delayed-2">
          <LegoBlock color="green" size="sm">
            <Zap className="h-6 w-6 text-white" />
          </LegoBlock>
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <LegoBlock color="purple" size="sm">
            <Star className="h-6 w-6 text-white" />
          </LegoBlock>
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build DeFi with{' '}
            <span className="gradient-text">Modular Legos</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stack, connect, and customize your perfect DeFi portfolio on Andromeda blockchain. 
            Each feature is a colorful block ready to snap into place.
          </p>

          {/* Feature Blocks Demo */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <LegoBlock color="cyan" size="sm" animate className="text-white font-medium">
              Lending
            </LegoBlock>
            <div className="text-primary text-2xl">+</div>
            <LegoBlock color="orange" size="sm" animate className="text-white font-medium">
              Borrowing
            </LegoBlock>
            <div className="text-primary text-2xl">+</div>
            <LegoBlock color="purple" size="sm" animate className="text-white font-medium">
              Staking
            </LegoBlock>
            <div className="text-primary text-2xl">=</div>
            <div className="text-2xl font-bold gradient-text">Your DeFi</div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-hero text-white hover:opacity-90 transition-opacity"
              onClick={() => navigate('/lending')}
            >
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
            >
              <Blocks className="mr-2 h-5 w-5" />
              Explore Legos
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$42M+</div>
              <div className="text-sm text-muted-foreground">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">15K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">8</div>
              <div className="text-sm text-muted-foreground">DeFi Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-lego-green">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}