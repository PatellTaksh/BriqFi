import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    resetEmail: ''
  });

  const handleSubmit = async (type: 'signin' | 'signup') => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'signup') {
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      if (formData.password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters.",
          variant: "destructive",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = type === 'signin' 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: type === 'signin' ? "Welcome back!" : "Account created!",
          description: type === 'signin' 
            ? "You have successfully signed in." 
            : "Please check your email to verify your account.",
        });
        onOpenChange(false);
        setFormData({ email: '', password: '', confirmPassword: '', resetEmail: '' });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.resetEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(formData.resetEmail);

      if (error) {
        toast({
          title: "Reset Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Email Sent!",
          description: "Check your email for password reset instructions.",
        });
        setShowForgotPassword(false);
        setFormData(prev => ({ ...prev, resetEmail: '' }));
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setShowForgotPassword(false);
    setActiveTab('signin');
    setFormData({ email: '', password: '', confirmPassword: '', resetEmail: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gradient-text">
            {showForgotPassword ? "Reset Password" : "Welcome to BriqFi"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {showForgotPassword ? "Reset your password" : "Authentication modal"}
          </DialogDescription>
        </DialogHeader>

        {showForgotPassword ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.resetEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, resetEmail: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full bg-gradient-hero text-white hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send Reset Link
              </Button>

              <Button
                variant="ghost"
                onClick={resetModal}
                className="w-full text-muted-foreground"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => handleSubmit('signin')}
              disabled={isLoading}
              className="w-full bg-gradient-hero text-white hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              Sign In
            </Button>

            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-muted-foreground hover:text-primary p-0"
              >
                Forgot your password?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              onClick={() => handleSubmit('signup')}
              disabled={isLoading}
              className="w-full bg-gradient-hero text-white hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              Create Account
            </Button>
          </TabsContent>
        </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}