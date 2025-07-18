import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidateFunnel } from './CandidateFunnel';
import { CandidateList } from './CandidateList';
import { Plus, Users, BarChart3 } from 'lucide-react';
import { Candidate, CandidateStage } from '@/types/recruitment';

interface CandidateDialogProps {
  positionId: string;
  positionTitle: string;
  candidates: Candidate[];
  children: React.ReactNode;
  onAddCandidate: () => void;
  onViewCandidate: (candidateId: string) => void;
  onScheduleInterview: (candidateId: string) => void;
  onMoveCandidate: (candidateId: string, newStage: CandidateStage) => void;
}

export function CandidateDialog({
  positionId,
  positionTitle,
  candidates,
  children,
  onAddCandidate,
  onViewCandidate,
  onScheduleInterview,
  onMoveCandidate
}: CandidateDialogProps) {
  const [activeTab, setActiveTab] = useState('funnel');

  const positionCandidates = candidates.filter(c => c.positionId === positionId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Candidatos - {positionTitle}
            <span className="text-sm font-normal text-muted-foreground">
              ({positionCandidates.length} candidatos)
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b">
            <TabsList>
              <TabsTrigger value="funnel" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Funil
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
            
            <Button onClick={onAddCandidate} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Candidato
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <TabsContent value="funnel" className="mt-0 h-full">
              <CandidateFunnel
                candidates={candidates}
                positionId={positionId}
                onMoveCandidate={onMoveCandidate}
                onScheduleInterview={onScheduleInterview}
                onViewCandidate={onViewCandidate}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0 h-full">
              <CandidateList
                candidates={positionCandidates}
                onAddCandidate={onAddCandidate}
                onViewCandidate={onViewCandidate}
                onScheduleInterview={onScheduleInterview}
                onMoveCandidate={onMoveCandidate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}