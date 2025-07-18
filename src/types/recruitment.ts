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

export interface Candidate {
  id: string;
  positionId: string;
  name: string;
  email: string;
  phone: string;
  resume?: string;
  source: 'linkedin' | 'website' | 'referral' | 'agency' | 'other';
  currentStage: CandidateStage;
  score?: number;
  notes?: string;
  appliedAt: Date;
  lastUpdated: Date;
  interviews: Interview[];
  documents: Document[];
}

export interface Interview {
  id: string;
  candidateId: string;
  type: 'phone' | 'video' | 'in_person' | 'technical';
  stage: CandidateStage;
  scheduledAt: Date;
  duration: number; // em minutos
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: string;
  score?: number;
  createdAt: Date;
}

export interface Document {
  id: string;
  candidateId: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

export type CandidateStage = 
  | 'applied'
  | 'screening' 
  | 'phone_interview'
  | 'technical_test'
  | 'in_person_interview'
  | 'final_interview'
  | 'offer_made'
  | 'hired'
  | 'rejected';

export interface FunnelStage {
  id: CandidateStage;
  name: string;
  color: string;
  order: number;
}

export interface CandidateMetrics {
  totalCandidates: number;
  candidatesByStage: Array<{ stage: string; count: number }>;
  conversionRates: Array<{ from: string; to: string; rate: number }>;
  avgTimeInStage: Array<{ stage: string; days: number }>;
  topSources: Array<{ source: string; count: number }>;
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