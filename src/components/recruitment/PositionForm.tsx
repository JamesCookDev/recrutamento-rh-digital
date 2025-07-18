import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { positionFormSchema, type PositionFormData } from "@/schemas/recruitment";
import { RecruitmentPosition } from "@/types/recruitment";

interface PositionFormProps {
  initialData?: Partial<RecruitmentPosition>;
  onSubmit: (data: PositionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export function PositionForm({ initialData, onSubmit, onCancel, isLoading = false, mode }: PositionFormProps) {
  const form = useForm<PositionFormData>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      jobTitle: initialData?.jobTitle || "",
      positionCode: initialData?.positionCode || "",
      department: initialData?.department || "",
      contractType: initialData?.contractType || "clt",
      salary: initialData?.salary,
      positionLevel: initialData?.positionLevel || "operational",
      recruitmentType: initialData?.recruitmentType || "external",
      requestType: initialData?.requestType || "replacement",
      location: initialData?.location || "",
      sourceOfCapture: initialData?.sourceOfCapture || "",
      approver: initialData?.approver || "",
      hrResponsible: initialData?.hrResponsible || "",
      managerResponsible: initialData?.managerResponsible || "",
      openingDate: initialData?.openingDate ? new Date(initialData.openingDate) : new Date(),
      expectedStartDate: initialData?.expectedStartDate ? new Date(initialData.expectedStartDate) : undefined,
      replacedEmployee: initialData?.replacedEmployee || "",
      benefits: initialData?.benefits || "",
      requirements: initialData?.requirements || "",
      serviceType: "internal",
      observations: initialData?.observations || ""
    }
  });

  const handleSubmit = async (data: PositionFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erro ao salvar vaga:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Nova Vaga" : "Editar Vaga"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Vaga *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Analista de RH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código da Vaga *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: RH-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Recursos Humanos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidade *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo - SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Configurações da Vaga */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contrato *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clt">CLT</SelectItem>
                        <SelectItem value="internship">Estágio</SelectItem>
                        <SelectItem value="temporary">Temporário</SelectItem>
                        <SelectItem value="contractor">Terceirizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível da Posição *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="strategic">Estratégico</SelectItem>
                        <SelectItem value="tactical">Tático</SelectItem>
                        <SelectItem value="operational">Operacional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recruitmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Recrutamento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">Interno</SelectItem>
                        <SelectItem value="external">Externo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Detalhes do Processo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Requisição *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="replacement">Reposição</SelectItem>
                        <SelectItem value="headcount_increase">Aumento de quadro</SelectItem>
                        <SelectItem value="other">Projeto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 5000.00" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Responsáveis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="approver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aprovador da Vaga *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do aprovador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hrResponsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável R&S *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do recrutador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerResponsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gestor Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do gestor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Abertura *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Previsão de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceOfCapture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte de Captação *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: LinkedIn, Indicação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Atendimento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">Interno</SelectItem>
                        <SelectItem value="external_consultant">Consultoria Externa</SelectItem>
                        <SelectItem value="mixed">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="replacedEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colaborador Substituído</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do colaborador (se reposição)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos de Texto Longo */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os requisitos mínimos para a vaga..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefícios</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os benefícios oferecidos..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Criar Vaga" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}