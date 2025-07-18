import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { RecruitmentPosition, Candidate, DashboardMetrics } from '@/types/recruitment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ReportsExportProps {
  positions: RecruitmentPosition[];
  candidates: Candidate[];
  metrics: DashboardMetrics;
}

export const ReportsExport = ({ positions, candidates, metrics }: ReportsExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState<string>('positions');
  const { toast } = useToast();

  const exportToPDF = async (type: string) => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Relatório de Recrutamento', 20, 20);
      doc.setFontSize(12);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, 30);
      
      let yPosition = 50;

      if (type === 'positions') {
        doc.setFontSize(16);
        doc.text('Relatório de Vagas', 20, yPosition);
        yPosition += 15;

        const tableData = positions.map(position => [
          position.positionCode,
          position.jobTitle,
          position.department,
          position.status,
          position.recruitmentType,
          position.positionLevel,
          format(position.openingDate, 'dd/MM/yyyy', { locale: ptBR })
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Código', 'Cargo', 'Departamento', 'Status', 'Tipo', 'Nível', 'Data Abertura']],
          body: tableData,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [255, 235, 59] }, // Yellow
        });
      } else if (type === 'candidates') {
        doc.setFontSize(16);
        doc.text('Relatório de Candidatos', 20, yPosition);
        yPosition += 15;

        const tableData = candidates.map(candidate => [
          candidate.name,
          candidate.email,
          candidate.phone,
          candidate.currentStage,
          format(candidate.appliedAt, 'dd/MM/yyyy', { locale: ptBR }),
          candidate.score?.toString() || ''
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Nome', 'Email', 'Telefone', 'Etapa', 'Data Aplicação', 'Pontuação']],
          body: tableData,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [255, 235, 59] }, // Yellow
        });
      } else if (type === 'metrics') {
        doc.setFontSize(16);
        doc.text('Relatório de Métricas', 20, yPosition);
        yPosition += 15;

        // Metrics summary
        const metricsData = [
          ['Total de Vagas', metrics.totalPositions.toString()],
          ['Vagas Ativas', metrics.activePositions.toString()],
          ['Vagas Finalizadas', metrics.completedPositions.toString()],
          ['Tempo Médio de Recrutamento', `${metrics.avgRecruitmentTime} dias`],
          ['Tempo Médio RH', `${metrics.avgHRTime} dias`],
          ['Taxa de Conversão', `${metrics.conversionRate}%`]
        ];

        autoTable(doc, {
          startY: yPosition,
          head: [['Métrica', 'Valor']],
          body: metricsData,
          styles: { fontSize: 12 },
          headStyles: { fillColor: [255, 235, 59] }, // Yellow
        });
      }

      doc.save(`relatorio-${type}-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`);
      
      toast({
        title: "Relatório PDF exportado com sucesso!",
        description: `O arquivo foi baixado para sua pasta de downloads.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar PDF",
        description: "Ocorreu um erro durante a exportação.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async (type: string) => {
    setIsExporting(true);
    
    try {
      const wb = XLSX.utils.book_new();
      
      if (type === 'positions') {
        const wsData = [
          ['Código', 'Cargo', 'Departamento', 'Status', 'Tipo', 'Nível', 'Data Abertura', 'Requisitos'],
          ...positions.map(position => [
            position.positionCode,
            position.jobTitle,
            position.department,
            position.status,
            position.recruitmentType,
            position.positionLevel,
            format(position.openingDate, 'dd/MM/yyyy', { locale: ptBR }),
            position.requirements
          ])
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Vagas');
      } else if (type === 'candidates') {
        const wsData = [
          ['Nome', 'Email', 'Telefone', 'Etapa', 'Data Aplicação', 'Pontuação', 'Fonte'],
          ...candidates.map(candidate => [
            candidate.name,
            candidate.email,
            candidate.phone,
            candidate.currentStage,
            format(candidate.appliedAt, 'dd/MM/yyyy', { locale: ptBR }),
            candidate.score || '',
            candidate.source
          ])
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Candidatos');
      } else if (type === 'metrics') {
        const wsData = [
          ['Métrica', 'Valor'],
          ['Total de Vagas', metrics.totalPositions],
          ['Vagas Ativas', metrics.activePositions],
          ['Vagas Finalizadas', metrics.completedPositions],
          ['Tempo Médio de Recrutamento (dias)', metrics.avgRecruitmentTime],
          ['Tempo Médio RH (dias)', metrics.avgHRTime],
          ['Taxa de Conversão (%)', metrics.conversionRate]
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Métricas');
      }

      XLSX.writeFile(wb, `relatorio-${type}-${format(new Date(), 'yyyyMMdd-HHmm')}.xlsx`);
      
      toast({
        title: "Relatório Excel exportado com sucesso!",
        description: `O arquivo foi baixado para sua pasta de downloads.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar Excel",
        description: "Ocorreu um erro durante a exportação.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          Exportar Relatórios
        </CardTitle>
        <CardDescription>
          Gere relatórios em PDF ou Excel com os dados do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Relatório</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positions">Relatório de Vagas</SelectItem>
              <SelectItem value="candidates">Relatório de Candidatos</SelectItem>
              <SelectItem value="metrics">Relatório de Métricas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => exportToPDF(reportType)}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Exportar PDF
          </Button>
          
          <Button 
            onClick={() => exportToExcel(reportType)}
            disabled={isExporting}
            variant="outline"
            className="flex-1"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Exportar Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};