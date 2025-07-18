import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dashboard } from '@/components/recruitment/Dashboard';
import { PositionCard } from '@/components/recruitment/PositionCard';
import { PositionFilters } from '@/components/recruitment/PositionFilters';
import { ReportsExport } from '@/components/recruitment/ReportsExport';
import { mockPositions, mockDashboardMetrics, mockCandidates } from '@/data/mockData';
import { FilterOptions, RecruitmentPosition, Candidate, CandidateStage } from '@/types/recruitment';
import { Plus, BarChart3, Users, Edit, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PositionFormDialog } from '@/components/recruitment/PositionFormDialog';
import { PositionFormData } from '@/schemas/recruitment';

const Index = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    departments: [],
    status: [],
    recruitmentType: [],
    positionLevel: [],
    dateRange: {}
  });

  // Filtrar posições baseado nos filtros e busca
  const filteredPositions = useMemo(() => {
    return mockPositions.filter(position => {
      // Filtro de busca
      const searchMatch = searchTerm === '' || 
        position.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.positionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros específicos
      const statusMatch = filters.status.length === 0 || filters.status.includes(position.status);
      const typeMatch = filters.recruitmentType.length === 0 || filters.recruitmentType.includes(position.recruitmentType);
      const levelMatch = filters.positionLevel.length === 0 || filters.positionLevel.includes(position.positionLevel);
      const deptMatch = filters.departments.length === 0 || filters.departments.includes(position.department);

      // Filtros de data
      const startDateMatch = !filters.dateRange.start || position.openingDate >= filters.dateRange.start;
      const endDateMatch = !filters.dateRange.end || position.openingDate <= filters.dateRange.end;

      return searchMatch && statusMatch && typeMatch && levelMatch && deptMatch && startDateMatch && endDateMatch;
    });
  }, [mockPositions, searchTerm, filters]);

  const handleCreatePosition = (data: PositionFormData) => {
    console.log('Nova vaga criada:', data);
    // Aqui você integraria com o Supabase para salvar a vaga
  };

  const handleViewPosition = (position: RecruitmentPosition) => {
    toast({
      title: "Visualizar Vaga",
      description: `Abrindo detalhes da vaga: ${position.jobTitle}`,
    });
  };

  const handleEditPosition = (position: RecruitmentPosition) => {
    // Função será implementada com o dialog de edição
    console.log('Editar vaga:', position.id);
  };

  const handleAddCandidate = () => {
    console.log('Adicionar candidato');
  };

  const handleViewCandidate = (candidateId: string) => {
    console.log('Ver candidato:', candidateId);
  };

  const handleScheduleInterview = (candidateId: string) => {
    console.log('Agendar entrevista:', candidateId);
  };

  const handleMoveCandidate = (candidateId: string, newStage: CandidateStage) => {
    console.log('Mover candidato:', candidateId, 'para', newStage);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mapa de Recrutamento</h1>
              <p className="text-muted-foreground">Sistema de controle de processos seletivos</p>
            </div>
            <PositionFormDialog 
              mode="create" 
              onSuccess={handleCreatePosition}
            />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="positions" className="gap-2">
              <Users className="h-4 w-4" />
              Vagas ({filteredPositions.length})
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileDown className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard metrics={mockDashboardMetrics} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsExport 
              positions={filteredPositions}
              candidates={mockCandidates}
              metrics={mockDashboardMetrics}
            />
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            {/* Filtros */}
            <PositionFilters
              filters={filters}
              onFiltersChange={setFilters}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Lista de Vagas */}
            {filteredPositions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    position={position}
                    candidates={mockCandidates}
                    onView={handleViewPosition}
                    onEdit={handleEditPosition}
                    onAddCandidate={handleAddCandidate}
                    onViewCandidate={handleViewCandidate}
                    onScheduleInterview={handleScheduleInterview}
                    onMoveCandidate={handleMoveCandidate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma vaga encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou criar uma nova vaga.
                </p>
                <PositionFormDialog 
                  mode="create" 
                  onSuccess={handleCreatePosition}
                  trigger={
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova Vaga
                    </Button>
                  }
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
