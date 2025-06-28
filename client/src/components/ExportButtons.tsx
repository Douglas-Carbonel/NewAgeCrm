import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from "lucide-react";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  isLoading?: boolean;
}

export function ExportButtons({ onExportPDF, onExportExcel, isLoading }: ExportButtonsProps) {
  const generatePDFReport = () => {
    // Create PDF content
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório CRM</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
          .chart-placeholder { height: 200px; border: 2px dashed #ccc; text-align: center; padding: 80px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Performance CRM</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="content">
          <h2>Resumo Executivo</h2>
          <div class="metric">
            <strong>Status dos Projetos:</strong> Análise detalhada de todos os projetos ativos
          </div>
          <div class="metric">
            <strong>Performance Financeira:</strong> Receitas e tendências de faturamento
          </div>
          <div class="metric">
            <strong>Eficiência Operacional:</strong> Métricas de produtividade e conclusão de tarefas
          </div>
          <div class="chart-placeholder">
            Gráficos serão renderizados aqui
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-crm-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = () => {
    // Create CSV content for Excel compatibility
    const csvContent = `
Relatório CRM - ${new Date().toLocaleDateString('pt-BR')}

RESUMO EXECUTIVO
Métrica,Valor,Status
Projetos Ativos,0,Em Andamento
Receita Total,R$ 0,Atual
Taxa de Conclusão,0%,Mensal

PROJETOS POR STATUS
Status,Quantidade,Percentual
Planejamento,0,0%
Em Andamento,0,0%
Concluído,0,0%
Em Espera,0,0%

PERFORMANCE FINANCEIRA
Período,Receita,Meta,Status
Jan/25,R$ 0,R$ 10.000,Abaixo
Fev/25,R$ 0,R$ 10.000,Abaixo
Mar/25,R$ 0,R$ 10.000,Abaixo

EFICIÊNCIA DE TAREFAS
Semana,Criadas,Concluídas,Eficiência
Sem 1,0,0,0%
Sem 2,0,0,0%
Sem 3,0,0,0%
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-crm-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={generatePDFReport}
        disabled={isLoading}
      >
        <FileText className="w-4 h-4 mr-2" />
        Exportar PDF
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={generateExcelReport}
        disabled={isLoading}
      >
        <Table className="w-4 h-4 mr-2" />
        Exportar Excel
      </Button>
    </div>
  );
}