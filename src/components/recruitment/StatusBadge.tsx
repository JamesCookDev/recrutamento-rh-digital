import { Badge } from '@/components/ui/badge';
import { RecruitmentPosition } from '@/types/recruitment';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: RecruitmentPosition['status'];
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    open: {
      label: 'Aberta',
      variant: 'secondary' as const,
      className: 'bg-chart-4/10 text-chart-4 border-chart-4/20'
    },
    in_progress: {
      label: 'Em Andamento',
      variant: 'default' as const,
      className: 'bg-primary/10 text-primary border-primary/20'
    },
    completed: {
      label: 'Finalizada',
      variant: 'default' as const,
      className: 'bg-success/10 text-success border-success/20'
    },
    cancelled: {
      label: 'Cancelada',
      variant: 'destructive' as const,
      className: 'bg-destructive/10 text-destructive border-destructive/20'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}