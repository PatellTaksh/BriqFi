import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  actionDisabled = false 
}: EmptyStateProps) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
        <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            disabled={actionDisabled}
            size="lg"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}