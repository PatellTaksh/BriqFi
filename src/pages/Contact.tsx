import { Navigation } from '@/components/Navigation';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;