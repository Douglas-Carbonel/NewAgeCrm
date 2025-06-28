import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { TimeTracker } from "@/components/TimeTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Download,
  Calendar,
  Target,
  Users
} from "lucide-react";
import type { ProjectWithClient } from "@shared/schema";

interface TimeTrackingStats {
  totalHours: number;
  totalRevenue: number;
  averageHourlyRate: number;
  topProject: string;
  efficiency: number;
}

interface ProjectTimeStats {
  projectId: number;
  projectName: string;
  totalHours: number;
  totalCost: number;
  taskBreakdown: Array<{
    taskId: number;
    taskName: string;
    hours: number;
    cost: number;
  }>;
}

export default function TimeTracking() {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("this_week");

  const { data: projects = [] } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const { data: stats } = useQuery<TimeTrackingStats>({
    queryKey: ["/api/time-tracking/stats", dateRange],
  });

  const { data: projectStats = [] } = useQuery<ProjectTimeStats[]>({
    queryKey: ["/api/time-tracking/project-stats"],
  });

  const generateTimesheetReport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedProject !== "all") {
        params.append("projectId", selectedProject);
      }
      
      const response = await fetch(`/api/time-tracking/timesheet?${params}`);
      const data = await response.json();
      
      // Create CSV content
      const csvContent = [
        "Data,Projeto,Tarefa,Descrição,Horas,Taxa,Custo",
        ...data.entries.map((entry: any) => {
          const project = projects.find(p => p.id === entry.projectId);
          return [
            new Date(entry.startTime).toLocaleDateString('pt-BR'),
            project?.name || "N/A",
            entry.taskId || "N/A",
            entry.description,
            (entry.duration / 60).toFixed(2),
            entry.hourlyRate.toFixed(2),
            entry.totalCost.toFixed(2)
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timesheet-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating timesheet:', error);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Controle de Tempo" 
        subtitle="Rastreamento de produtividade e custos" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros e Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Projeto
                </label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Projetos</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Período
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="this_week">Esta Semana</SelectItem>
                    <SelectItem value="this_month">Este Mês</SelectItem>
                    <SelectItem value="last_30_days">Últimos 30 Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={generateTimesheetReport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Timesheet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Horas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa Média</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageHourlyRate)}/h</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projeto Principal</p>
                    <p className="text-xl font-bold text-gray-900 truncate">{stats.topProject}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Eficiência</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.efficiency}%</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time Tracker */}
          <div className="lg:col-span-2">
            <TimeTracker />
          </div>

          {/* Project Time Breakdown */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tempo por Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectStats.slice(0, 8).map((project) => (
                    <div key={project.projectId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {project.projectName}
                        </span>
                        <span className="text-sm text-gray-600">
                          {project.totalHours.toFixed(1)}h
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatCurrency(project.totalCost)}</span>
                        <span>{project.taskBreakdown.length} tarefa{project.taskBreakdown.length !== 1 ? 's' : ''}</span>
                      </div>
                      
                      {/* Task breakdown */}
                      {project.taskBreakdown.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {project.taskBreakdown.slice(0, 3).map((task) => (
                            <div key={task.taskId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate">• {task.taskName}</span>
                              <span className="text-gray-500">{task.hours.toFixed(1)}h</span>
                            </div>
                          ))}
                          {project.taskBreakdown.length > 3 && (
                            <div className="text-xs text-gray-500 ml-2">
                              +{project.taskBreakdown.length - 3} mais
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((project.totalHours / (stats?.totalHours || 1)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  {projectStats.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum tempo registrado ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}