import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Blocks, Menu, X, User } from 'lucide-react';

// Updated navigation component

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Lending', href: '#lending' },
    { name: 'Borrowing', href: '#borrowing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Blocks className="h-8 w-8 text-primary animate-pulse-glow" />
              <span className="text-2xl font-bold gradient-text">BriqFi</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Account Icon */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
                <User className="h-5 w-5" />
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-lg border-b border-border",
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-4 justify-center">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" />
    </>
  );
}