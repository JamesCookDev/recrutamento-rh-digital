import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: MetricCardProps) {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/20 bg-gradient-to-br from-success/5 to-success/10',
    warning: 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10',
    destructive: 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10'
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <Card className={cn(
      'solar-card transition-all duration-300 hover:shadow-elevated group relative overflow-hidden',
      variant === 'success' && 'hover:solar-glow border-success/30',
      variant === 'warning' && 'border-warning/30',
      variant === 'destructive' && 'border-destructive/30',
      variantStyles[variant]
    )}>
      {/* Subtle gradient overlay for energy feeling */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className={cn(
          'p-2 rounded-full transition-all duration-300 group-hover:scale-110',
          variant === 'success' && 'bg-success/10',
          variant === 'warning' && 'bg-warning/10',
          variant === 'destructive' && 'bg-destructive/10',
          variant === 'default' && 'bg-primary/10'
        )}>
          <Icon className={cn('h-4 w-4', iconStyles[variant])} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive 
                ? 'text-success bg-success/10' 
                : 'text-destructive bg-destructive/10'
            )}>
              {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}