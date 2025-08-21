import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PasswordResetSuccessProps {
  onContinue?: () => void;
}

export function PasswordResetSuccess({ onContinue }: PasswordResetSuccessProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      if (onContinue) {
        onContinue();
      } else {
        navigate('/');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, onContinue]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">
                Password Reset Successful!
              </CardTitle>
              <CardDescription>
                Your password has been successfully updated. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Redirecting to homepage in 5 seconds...
              </div>
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-hero text-white hover:opacity-90"
              >
                Continue to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}