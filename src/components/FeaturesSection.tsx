import { LegoBlock } from './LegoBlock';
import { Button } from '@/components/ui/button';
import { 
  Blocks,
  Brain,
  Shield,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Blocks,
      title: 'Modular Design',
      description: 'Mix and match DeFi components like building blocks. Create your perfect financial strategy.',
      color: 'cyan' as const,
      delay: 0
    },
    {
      icon: Brain,
      title: 'AI Credit Scoring',
      description: 'Advanced AI analyzes your on-chain behavior to unlock better rates and exclusive opportunities.',
      color: 'purple' as const,
      delay: 100
    },
    {
      icon: Shield,
      title: 'Battle-Tested Security',
      description: 'Audited smart contracts and insurance coverage protect your assets at every step.',
      color: 'green' as const,
      delay: 200
    },
    {
      icon: Zap,
      title: 'Instant Execution',
      description: 'Lightning-fast transactions on Andromeda blockchain with minimal fees.',
      color: 'yellow' as const,
      delay: 300
    },
    {
      icon: Target,
      title: 'Optimized Yields',
      description: 'Dynamic algorithms automatically find the best rates across multiple protocols.',
      color: 'orange' as const,
      delay: 400
    },
    {
      icon: Sparkles,
      title: 'Gamified Experience',
      description: 'Earn XP, unlock achievements, and climb leaderboards while you build wealth.',
      color: 'red' as const,
      delay: 500
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">Briqfi?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed to make DeFi more accessible, profitable, and fun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <LegoBlock color={feature.color} className="h-full">
                <div className="text-center text-white">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </LegoBlock>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-card rounded-2xl p-8 max-w-2xl mx-auto border border-border">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse-glow" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Building?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users already earning with modular DeFi
            </p>
            <Button size="lg" className="bg-gradient-hero text-white hover:opacity-90">
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}