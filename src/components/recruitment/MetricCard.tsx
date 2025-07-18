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
    <Card className={cn('transition-all duration-200 hover:shadow-elevated', variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}