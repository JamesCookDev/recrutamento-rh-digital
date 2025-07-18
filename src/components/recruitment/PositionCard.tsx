import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { RecruitmentPosition, Candidate } from '@/types/recruitment';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase, 
  Clock,
  Eye,
  Edit,
  MoreHorizontal,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { TimelineDialog } from './TimelineDialog';
import { CandidateDialog } from './CandidateDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PositionCardProps {
  position: RecruitmentPosition;
  candidates: Candidate[];
  onView?: (position: RecruitmentPosition) => void;
  onEdit?: (position: RecruitmentPosition) => void;
  onAddCandidate: () => void;
  onViewCandidate: (candidateId: string) => void;
  onScheduleInterview: (candidateId: string) => void;
  onMoveCandidate: (candidateId: string, newStage: any) => void;
}

export function PositionCard({ 
  position, 
  candidates, 
  onView, 
  onEdit, 
  onAddCandidate, 
  onViewCandidate, 
  onScheduleInterview, 
  onMoveCandidate 
}: PositionCardProps) {
  const positionCandidates = candidates.filter(c => c.positionId === position.id);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getPositionLevelColor = (level: RecruitmentPosition['positionLevel']) => {
    const colors = {
      strategic: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
      tactical: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
      operational: 'bg-chart-2/10 text-chart-2 border-chart-2/20'
    };
    return colors[level];
  };

  const getPositionLevelLabel = (level: RecruitmentPosition['positionLevel']) => {
    const labels = {
      strategic: 'Estratégico',
      tactical: 'Tático',
      operational: 'Operacional'
    };
    return labels[level];
  };

  return (
    <Card className="hover:shadow-elevated transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {position.jobTitle}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{position.positionCode}</span>
              <span className="text-border">•</span>
              <span>{position.department}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={position.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(position)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(position)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <TimelineDialog 
                    position={position}
                    trigger={
                      <div className="flex items-center w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Timeline
                      </div>
                    }
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <CandidateDialog
                    positionId={position.id}
                    positionTitle={position.jobTitle}
                    candidates={candidates}
                    onAddCandidate={onAddCandidate}
                    onViewCandidate={onViewCandidate}
                    onScheduleInterview={onScheduleInterview}
                    onMoveCandidate={onMoveCandidate}
                  >
                    <div className="flex items-center w-full">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Candidatos ({positionCandidates.length})
                    </div>
                  </CandidateDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{position.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Início: {formatDate(position.expectedStartDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{position.hrResponsible}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{position.recruitmentTime} dias</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getPositionLevelColor(position.positionLevel)}
            >
              {getPositionLevelLabel(position.positionLevel)}
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              {position.recruitmentType === 'external' ? 'Externo' : 'Interno'}
            </Badge>
          </div>
          
          <div className="text-lg font-semibold text-primary">
            {formatCurrency(position.salary)}
          </div>
        </div>

        {position.selectedCandidate && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-sm">
            <span className="font-medium text-success">Candidato selecionado: </span>
            <span className="text-foreground">{position.selectedCandidate}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}