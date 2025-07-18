import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProcessTimeline, TimelineStep } from './ProcessTimeline';
import { RecruitmentPosition } from '@/types/recruitment';
import { Clock, Eye } from 'lucide-react';

interface TimelineDialogProps {
  position: RecruitmentPosition;
  trigger?: React.ReactNode;
}

// Função para gerar etapas baseadas no status da vaga
const generateTimelineSteps = (position: RecruitmentPosition): TimelineStep[] => {
  const baseSteps: Omit<TimelineStep, 'status'>[] = [
    {
      id: 'opening',
      title: 'Abertura da Vaga',
      description: 'Vaga criada e aprovada pelo gestor',
      icon: Eye,
      date: position.openingDate,
      duration: '1 dia'
    },
    {
      id: 'sourcing',
      title: 'Captação de Candidatos',
      description: 'Divulgação da vaga e busca ativa',
      icon: Eye,
      duration: '5-7 dias'
    },
    {
      id: 'screening',
      title: 'Triagem Curricular',
      description: 'Análise e pré-seleção de currículos',
      icon: Eye,
      duration: '3-5 dias'
    },
    {
      id: 'interviews',
      title: 'Entrevistas',
      description: 'Entrevistas técnicas e comportamentais',
      icon: Eye,
      duration: '7-10 dias'
    },
    {
      id: 'tests',
      title: 'Avaliações',
      description: 'Testes técnicos e dinâmicas',
      icon: Eye,
      duration: '3-5 dias'
    },
    {
      id: 'decision',
      title: 'Decisão Final',
      description: 'Seleção e aprovação do candidato',
      icon: Eye,
      duration: '2-3 dias'
    }
  ];

  // Mapear status da vaga para progresso da timeline
  const statusMapping = {
    'open': 1, // Apenas abertura concluída
    'in_progress': 3, // Até triagem
    'completed': 6, // Todas as etapas
    'cancelled': 0 // Nenhuma etapa
  };

  const completedSteps = statusMapping[position.status] || 0;

  return baseSteps.map((step, index) => ({
    ...step,
    status: index < completedSteps ? 'completed' : 
            index === completedSteps ? 'current' : 'pending'
  }));
};

export function TimelineDialog({ position, trigger }: TimelineDialogProps) {
  const [open, setOpen] = useState(false);
  
  const timelineSteps = generateTimelineSteps(position);

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Clock className="h-4 w-4" />
      Timeline
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Timeline do Processo Seletivo</DialogTitle>
        </DialogHeader>
        <ProcessTimeline
          steps={timelineSteps}
          positionTitle={position.jobTitle}
          positionCode={position.positionCode}
        />
      </DialogContent>
    </Dialog>
  );
}