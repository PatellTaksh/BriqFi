import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  LogOut, 
  Settings, 
  Wallet,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Account Dashboard</h1>
                <p className="text-muted-foreground">Manage your BriqFi account and DeFi portfolio</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and verification status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Primary email address</p>
                      </div>
                    </div>
                    <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                      {user.email_confirmed_at ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Member since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Account ID</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {user.id.slice(0, 8)}...{user.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DeFi Portfolio Overview */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    DeFi Portfolio
                  </CardTitle>
                  <CardDescription>
                    Your lending, borrowing, and staking activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <DollarSign className="h-8 w-8 text-lego-green mx-auto mb-2" />
                      <p className="text-2xl font-bold text-lego-green">$0.00</p>
                      <p className="text-sm text-muted-foreground">Total Lent</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-lego-orange mx-auto mb-2" />
                      <p className="text-2xl font-bold text-lego-orange">$0.00</p>
                      <p className="text-sm text-muted-foreground">Total Borrowed</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <Activity className="h-8 w-8 text-lego-purple mx-auto mb-2" />
                      <p className="text-2xl font-bold text-lego-purple">$0.00</p>
                      <p className="text-sm text-muted-foreground">Total Staked</p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground mb-4">Start building your DeFi portfolio</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/lending')}
                        className="bg-gradient-hero text-white hover:opacity-90"
                      >
                        Start Lending
                      </Button>
                      <Button 
                        onClick={() => navigate('/borrowing')}
                        variant="outline"
                      >
                        Explore Borrowing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/lending')}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    View Lending Pools
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/borrowing')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/about')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/contact')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    SECURITY STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Verified</span>
                      <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                        {user.email_confirmed_at ? "✓" : "✗"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Badge variant="secondary">Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;