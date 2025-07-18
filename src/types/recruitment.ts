export interface RecruitmentPosition {
  id: string;
  sourceOfCapture: string; // Fonte de Captação
  recruitmentType: 'internal' | 'external'; // Recrutamento
  positionCode: string; // Código da Vaga
  requestType: 'replacement' | 'headcount_increase' | 'other'; // Tipo de Requisição
  replacedEmployee?: string; // Nome do Colaborador Substituído
  location: string; // Localidade da Vaga
  positionLevel: 'strategic' | 'tactical' | 'operational'; // Tipo de Vaga
  department: string; // Setor
  jobTitle: string; // Função
  contractType: 'clt' | 'internship' | 'temporary' | 'contractor'; // Tipo de Contrato
  salary: number; // Salário
  benefits: string; // Benefícios
  requirements: string; // Requisitos
  approver: string; // Aprovador da Vaga
  openingDate: Date; // Data de Abertura da Vaga
  expectedStartDate: Date; // Previsão de Início
  hrResponsible: string; // Responsável pelo R&S
  managerResponsible: string; // Responsável pela Vaga
  serviceType: 'internal' | 'external_consultant' | 'mixed'; // Tipo de Atendimento
  recruitmentTime: number; // Tempo de R&S (dias)
  avgDeliveryTime: number; // Média de Entrega de Vagas ao Gestor
  avgCompletionTime: number; // Média de Conclusão de Vagas
  sentToHRDate?: Date; // Data de Envio ao DP
  hrCompletionDate?: Date; // Data Fim de Atividades do DP
  hrProcessDuration?: number; // Duração das Atividades do DP
  totalProcessDuration?: number; // Duração Total do Processo
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'; // Status do Processo
  observations?: string; // Observações
  selectedCandidate?: string; // Nome do Candidato Aprovado
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalPositions: number;
  activePositions: number;
  completedPositions: number;
  avgRecruitmentTime: number;
  avgHRTime: number;
  conversionRate: number;
  positionsByDepartment: Array<{ department: string; count: number }>;
  positionsByStatus: Array<{ status: string; count: number }>;
  timelineData: Array<{ month: string; opened: number; closed: number }>;
}

export interface FilterOptions {
  departments: string[];
  status: RecruitmentPosition['status'][];
  recruitmentType: RecruitmentPosition['recruitmentType'][];
  positionLevel: RecruitmentPosition['positionLevel'][];
  dateRange: {
    start?: Date;
    end?: Date;
  };
}