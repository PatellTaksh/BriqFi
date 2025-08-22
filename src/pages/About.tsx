import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Blocks, Brain, Shield, Zap, Users, Globe, Github, Linkedin, Twitter } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former DeFi protocol architect with 8+ years in blockchain technology.',
      image: '/placeholder.svg',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Sarah Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Smart contract expert and former Ethereum Foundation researcher.',
      image: '/placeholder.svg',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Marcus Kim',
      role: 'Head of AI',
      bio: 'Machine learning specialist with focus on financial risk modeling.',
      image: '/placeholder.svg',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Elena Popov',
      role: 'Head of Product',
      bio: 'UX designer and product strategist with fintech experience.',
      image: '/placeholder.svg',
      social: { twitter: '#', linkedin: '#', github: '#' }
    }
  ];

  const milestones = [
    { year: '2023', event: 'Founded BriqFi', description: 'Started development of modular DeFi infrastructure' },
    { year: '2023', event: 'Seed Funding', description: 'Raised $2M in seed funding from top VCs' },
    { year: '2024', event: 'Testnet Launch', description: 'Successfully launched on Andromeda testnet' },
    { year: '2024', event: 'Security Audits', description: 'Completed audits by CertiK and ConsenSys' },
    { year: '2024', event: 'Mainnet Launch', description: 'Live on Andromeda mainnet with initial features' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Multi-layered security with continuous audits and battle-tested smart contracts.'
    },
    {
      icon: Brain,
      title: 'AI Innovation',
      description: 'Cutting-edge AI algorithms for risk assessment and rate optimization.'
    },
    {
      icon: Blocks,
      title: 'Modularity',
      description: 'Lego-inspired architecture allowing users to build custom DeFi solutions.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Governed by our community with transparent decision-making processes.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">About BriqFi</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            BriqFi is revolutionizing DeFi with modular, Lego-inspired financial building blocks.
            Our AI-powered platform on the Andromeda blockchain makes decentralized finance 
            accessible, secure, and infinitely customizable.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="border-border bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  To democratize access to sophisticated financial tools by creating modular, 
                  AI-enhanced DeFi building blocks that anyone can combine to build their perfect 
                  financial solution. We believe the future of finance is modular, intelligent, and community-owned.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-border bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Blocks className="h-6 w-6 mr-2 text-primary" />
                  Andromeda Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Built on the Andromeda Protocol, providing cross-chain interoperability, 
                  advanced smart contract capabilities, and seamless user experiences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CosmWasm</Badge>
                  <Badge variant="secondary">IBC Protocol</Badge>
                  <Badge variant="secondary">Rust</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-primary" />
                  AI-Powered Risk Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Advanced machine learning algorithms analyze market conditions, user behavior, 
                  and risk factors to provide optimal lending rates and credit scoring.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">TensorFlow</Badge>
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Real-time ML</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">{milestone.year}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="border-border bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">$12.5M</div>
                <div className="text-muted-foreground">Total Value Locked</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">2,847</div>
                <div className="text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/30 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">1,234</div>
                <div className="text-muted-foreground">Loans Processed</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="border-border bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-6">Join the Future of DeFi</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to build your perfect DeFi solution? Connect with our team or 
                join our community to get started with BriqFi today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Globe className="h-5 w-5 mr-2" />
                  Launch App
                </Button>
                <Button variant="outline" size="lg">
                  <Globe className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;