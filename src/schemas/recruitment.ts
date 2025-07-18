import { z } from "zod";

export const positionFormSchema = z.object({
  jobTitle: z.string().min(2, "Título da vaga é obrigatório (mínimo 2 caracteres)"),
  positionCode: z.string().min(1, "Código da vaga é obrigatório"),
  department: z.string().min(1, "Setor é obrigatório"),
  contractType: z.enum(["clt", "internship", "temporary", "contractor"], {
    errorMap: () => ({ message: "Tipo de contrato é obrigatório" })
  }),
  salary: z.number().min(0, "Salário deve ser maior que zero").optional(),
  positionLevel: z.enum(["strategic", "tactical", "operational"], {
    errorMap: () => ({ message: "Nível da posição é obrigatório" })
  }),
  recruitmentType: z.enum(["internal", "external"], {
    errorMap: () => ({ message: "Tipo de recrutamento é obrigatório" })
  }),
  requestType: z.enum(["replacement", "headcount_increase", "other"], {
    errorMap: () => ({ message: "Tipo de requisição é obrigatório" })
  }),
  location: z.string().min(1, "Localidade é obrigatória"),
  sourceOfCapture: z.string().min(1, "Fonte de captação é obrigatória"),
  approver: z.string().min(1, "Aprovador da vaga é obrigatório"),
  hrResponsible: z.string().min(1, "Responsável pelo R&S é obrigatório"),
  managerResponsible: z.string().min(1, "Responsável pela vaga é obrigatório"),
  openingDate: z.date({
    errorMap: () => ({ message: "Data de abertura é obrigatória" })
  }),
  expectedStartDate: z.date({
    errorMap: () => ({ message: "Previsão de início é obrigatória" })
  }).optional(),
  replacedEmployee: z.string().optional(),
  benefits: z.string().optional(),
  requirements: z.string().min(10, "Requisitos devem ter pelo menos 10 caracteres"),
  serviceType: z.enum(["internal", "external_consultant", "mixed"], {
    errorMap: () => ({ message: "Tipo de atendimento é obrigatório" })
  }),
  observations: z.string().optional()
}).refine((data) => {
  if (data.expectedStartDate && data.expectedStartDate <= data.openingDate) {
    return false;
  }
  return true;
}, {
  message: "Data de início deve ser posterior à data de abertura",
  path: ["expectedStartDate"]
});

export type PositionFormData = z.infer<typeof positionFormSchema>;