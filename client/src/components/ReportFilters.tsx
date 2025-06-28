import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, RefreshCw } from "lucide-react";

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  isLoading?: boolean;
}

export interface ReportFilters {
  dateRange: string;
  projectStatus: string;
  clientId: string;
  reportType: string;
}

export function ReportFilters({ onFiltersChange, isLoading }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "last_6_months",
    projectStatus: "all",
    clientId: "all",
    reportType: "overview"
  });

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: ReportFilters = {
      dateRange: "last_6_months",
      projectStatus: "all",
      clientId: "all",
      reportType: "overview"
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de Relatório
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Período</label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                <SelectItem value="last_year">Último ano</SelectItem>
                <SelectItem value="all_time">Todo o período</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status do Projeto</label>
            <Select value={filters.projectStatus} onValueChange={(value) => handleFilterChange('projectStatus', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="planning">Planejamento</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="on_hold">Em Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Relatório</label>
            <Select value={filters.reportType} onValueChange={(value) => handleFilterChange('reportType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Visão Geral</SelectItem>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="productivity">Produtividade</SelectItem>
                <SelectItem value="client_analysis">Análise de Clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ações</label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resetar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}