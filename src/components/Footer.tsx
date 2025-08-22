import { Blocks, Twitter, Github, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Lending', href: '#lending' },
        { name: 'Borrowing', href: '#borrowing' },
        { name: 'Staking', href: '#staking' },
        { name: 'Auctions', href: '#auctions' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { name: 'Documentation', href: '#docs' },
        { name: 'API Reference', href: '#api' },
        { name: 'SDK', href: '#sdk' },
        { name: 'GitHub', href: '#github' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: '#discord' },
        { name: 'Twitter', href: '#twitter' },
        { name: 'Blog', href: '#blog' },
        { name: 'Forum', href: '#forum' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Privacy', href: '#privacy' },
        { name: 'Terms', href: '#terms' }
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold gradient-text">Briqfi</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Build your perfect DeFi portfolio with modular Lego-inspired blocks on Andromeda blockchain.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm">
            © 2024 Briqfi. Built on Andromeda blockchain.
          </div>
          <div className="text-muted-foreground text-sm mt-4 md:mt-0">
            Audited by <span className="text-primary">CertiK</span> & <span className="text-primary">ConsenSys</span>
          </div>
        </div>
      </div>
    </footer>
  );
}