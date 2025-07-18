import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  Star,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidate, CandidateStage, FunnelStage } from '@/types/recruitment';

const funnelStages: FunnelStage[] = [
  { id: 'applied', name: 'Aplicaram', color: 'bg-blue-500', order: 1 },
  { id: 'screening', name: 'Triagem', color: 'bg-purple-500', order: 2 },
  { id: 'phone_interview', name: 'Entrevista Telefônica', color: 'bg-yellow-500', order: 3 },
  { id: 'technical_test', name: 'Teste Técnico', color: 'bg-orange-500', order: 4 },
  { id: 'in_person_interview', name: 'Entrevista Presencial', color: 'bg-red-500', order: 5 },
  { id: 'final_interview', name: 'Entrevista Final', color: 'bg-pink-500', order: 6 },
  { id: 'offer_made', name: 'Proposta Enviada', color: 'bg-green-500', order: 7 },
  { id: 'hired', name: 'Contratado', color: 'bg-emerald-600', order: 8 }
];

interface CandidateFunnelProps {
  candidates: Candidate[];
  positionId: string;
  onMoveCandidate: (candidateId: string, newStage: CandidateStage) => void;
  onScheduleInterview: (candidateId: string) => void;
  onViewCandidate: (candidateId: string) => void;
}

export function CandidateFunnel({ 
  candidates, 
  positionId, 
  onMoveCandidate, 
  onScheduleInterview, 
  onViewCandidate 
}: CandidateFunnelProps) {
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);

  const positionCandidates = candidates.filter(c => c.positionId === positionId);

  const getCandidatesByStage = (stage: CandidateStage) => {
    return positionCandidates.filter(c => c.currentStage === stage);
  };

  const handleDragStart = (candidateId: string) => {
    setDraggedCandidate(candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: CandidateStage) => {
    e.preventDefault();
    if (draggedCandidate) {
      onMoveCandidate(draggedCandidate, targetStage);
      setDraggedCandidate(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStageColor = (stage: CandidateStage) => {
    return funnelStages.find(s => s.id === stage)?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Funil de Candidatos</h3>
        <div className="text-sm text-muted-foreground">
          Total: {positionCandidates.length} candidatos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {funnelStages.map((stage) => {
          const stageCandidates = getCandidatesByStage(stage.id);
          
          return (
            <Card 
              key={stage.id}
              className="min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    {stage.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {stageCandidates.length}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                {stageCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={() => handleDragStart(candidate.id)}
                    className={cn(
                      "p-3 border rounded-lg cursor-move hover:shadow-md transition-all",
                      draggedCandidate === candidate.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.source}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewCandidate(candidate.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onScheduleInterview(candidate.id)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Agendar Entrevista
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {candidate.phone}
                      </div>
                    </div>

                    {candidate.score && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium">{candidate.score}/10</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {new Date(candidate.appliedAt).toLocaleDateString('pt-BR')}
                      </span>
                      {stage.order < 8 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const nextStage = funnelStages.find(s => s.order === stage.order + 1);
                            if (nextStage) {
                              onMoveCandidate(candidate.id, nextStage.id);
                            }
                          }}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Nenhum candidato nesta etapa
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}