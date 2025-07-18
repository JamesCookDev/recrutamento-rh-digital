import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Star
} from 'lucide-react';
import { Candidate, CandidateStage } from '@/types/recruitment';

interface CandidateListProps {
  candidates: Candidate[];
  onAddCandidate: () => void;
  onViewCandidate: (candidateId: string) => void;
  onScheduleInterview: (candidateId: string) => void;
  onMoveCandidate: (candidateId: string, newStage: CandidateStage) => void;
}

const stageLabels: Record<CandidateStage, string> = {
  applied: 'Aplicou',
  screening: 'Triagem',
  phone_interview: 'Entrevista Telefônica',
  technical_test: 'Teste Técnico',
  in_person_interview: 'Entrevista Presencial',
  final_interview: 'Entrevista Final',
  offer_made: 'Proposta Enviada',
  hired: 'Contratado',
  rejected: 'Rejeitado'
};

const stageColors: Record<CandidateStage, string> = {
  applied: 'bg-blue-100 text-blue-800',
  screening: 'bg-purple-100 text-purple-800',
  phone_interview: 'bg-yellow-100 text-yellow-800',
  technical_test: 'bg-orange-100 text-orange-800',
  in_person_interview: 'bg-red-100 text-red-800',
  final_interview: 'bg-pink-100 text-pink-800',
  offer_made: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-gray-100 text-gray-800'
};

export function CandidateList({ 
  candidates, 
  onAddCandidate, 
  onViewCandidate, 
  onScheduleInterview,
  onMoveCandidate
}: CandidateListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || candidate.currentStage === stageFilter;
    const matchesSource = sourceFilter === 'all' || candidate.source === sourceFilter;
    
    return matchesSearch && matchesStage && matchesSource;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidatos</CardTitle>
            <Button onClick={onAddCandidate}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Candidato
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Todas as etapas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {Object.entries(stageLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas as fontes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fontes</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Indicação</SelectItem>
                <SelectItem value="agency">Agência</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Candidatos */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Data Aplicação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {candidate.phone}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={stageColors[candidate.currentStage]}>
                        {stageLabels[candidate.currentStage]}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="capitalize">
                      {candidate.source}
                    </TableCell>
                    
                    <TableCell>
                      {candidate.score ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{candidate.score}/10</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {new Date(candidate.appliedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum candidato encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}