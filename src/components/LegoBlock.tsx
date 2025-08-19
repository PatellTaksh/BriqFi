import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LegoBlockProps {
  children: ReactNode;
  color?: 'red' | 'yellow' | 'green' | 'orange' | 'purple' | 'cyan' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function LegoBlock({ 
  children, 
  color = 'primary', 
  size = 'md', 
  className,
  animate = false 
}: LegoBlockProps) {
  const colorMap = {
    red: 'bg-lego-red',
    yellow: 'bg-lego-yellow',
    green: 'bg-lego-green',
    orange: 'bg-lego-orange',
    purple: 'bg-lego-purple',
    cyan: 'bg-lego-cyan',
    primary: 'bg-primary',
    secondary: 'bg-secondary'
  };

  const sizeMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'lego-block',
      colorMap[color],
      sizeMap[size],
      animate && 'animate-float',
      className
    )}>
      {children}
    </div>
  );
}