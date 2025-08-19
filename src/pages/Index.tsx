import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DashboardSection } from '@/components/DashboardSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <DashboardSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;