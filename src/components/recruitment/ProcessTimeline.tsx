import { CheckCircle, Circle, Clock, Users, FileText, MessageSquare, Award, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending';
  date?: Date;
  duration?: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  positionTitle: string;
  positionCode: string;
  className?: string;
}

const defaultSteps: TimelineStep[] = [
  {
    id: 'opening',
    title: 'Abertura da Vaga',
    description: 'Vaga criada e aprovada',
    icon: FileText,
    status: 'completed',
    date: new Date('2024-01-15'),
    duration: '1 dia'
  },
  {
    id: 'sourcing',
    title: 'Captação',
    description: 'Busca ativa por candidatos',
    icon: Users,
    status: 'completed',
    date: new Date('2024-01-16'),
    duration: '5 dias'
  },
  {
    id: 'screening',
    title: 'Triagem',
    description: 'Análise de currículos',
    icon: FileText,
    status: 'current',
    duration: '3 dias'
  },
  {
    id: 'interviews',
    title: 'Entrevistas',
    description: 'Entrevistas com candidatos',
    icon: MessageSquare,
    status: 'pending'
  },
  {
    id: 'tests',
    title: 'Avaliações',
    description: 'Testes técnicos e comportamentais',
    icon: Award,
    status: 'pending'
  },
  {
    id: 'decision',
    title: 'Decisão Final',
    description: 'Seleção do candidato',
    icon: UserCheck,
    status: 'pending'
  }
];

export function ProcessTimeline({ 
  steps = defaultSteps, 
  positionTitle, 
  positionCode, 
  className 
}: ProcessTimelineProps) {
  const getStatusIcon = (step: TimelineStep, index: number) => {
    const IconComponent = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (step.status === 'current') {
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    } else {
      return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-muted-foreground/30';
      default:
        return 'bg-muted-foreground/30';
    }
  };

  const getStatusBadge = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-green-700 border-green-300">Concluído</Badge>;
      case 'current':
        return <Badge variant="outline" className="text-blue-700 border-blue-300">Em Andamento</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-muted-foreground">Pendente</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{positionTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">{positionCode}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {steps.filter(s => s.status === 'completed').length} de {steps.length} etapas concluídas
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha conectora */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Etapas */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Ícone da etapa */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background",
                  step.status === 'completed' && "border-green-500 bg-green-50",
                  step.status === 'current' && "border-blue-500 bg-blue-50",
                  step.status === 'pending' && "border-muted-foreground/30"
                )}>
                  {getStatusIcon(step, index)}
                </div>

                {/* Conteúdo da etapa */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    {getStatusBadge(step.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {step.date && (
                      <span>
                        {step.date.toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {step.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}