import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Download, Filter, Plus, Search, Edit, Eye } from "lucide-react";

export default function TimesheetsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-week");

  const timesheets = [
    {
      id: 1,
      employee: "João Silva",
      project: "Sistema de Gestão",
      client: "Tech Corp",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "17:00",
      hours: 8,
      status: "aprovado",
      description: "Desenvolvimento do módulo de usuários",
      hourlyRate: 85
    },
    {
      id: 2,
      employee: "Maria Santos",
      project: "E-commerce",
      client: "Loja Online",
      date: "2024-01-15",
      startTime: "08:30",
      endTime: "16:30",
      hours: 8,
      status: "pendente",
      description: "Design das páginas de produto",
      hourlyRate: 95
    },
    {
      id: 3,
      employee: "Pedro Costa",
      project: "App Mobile",
      client: "StartupXYZ",
      date: "2024-01-14",
      startTime: "10:00",
      endTime: "18:00",
      hours: 8,
      status: "rejeitado",
      description: "Desenvolvimento da API",
      hourlyRate: 90
    },
    {
      id: 4,
      employee: "Ana Oliveira",
      project: "Consultoria",
      client: "Tech Corp",
      date: "2024-01-14",
      startTime: "14:00",
      endTime: "18:00",
      hours: 4,
      status: "aprovado",
      description: "Reunião de planejamento",
      hourlyRate: 150
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalHours = timesheets.reduce((sum, timesheet) => sum + timesheet.hours, 0);
  const totalValue = timesheets.reduce((sum, timesheet) => sum + (timesheet.hours * timesheet.hourlyRate), 0);
  const approvedHours = timesheets.filter(t => t.status === "aprovado").reduce((sum, t) => sum + t.hours, 0);
  const pendingHours = timesheets.filter(t => t.status === "pendente").reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timesheets</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe e aprove os timesheets da equipe</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Timesheet
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total de Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Horas Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedHours}h</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">pronto para faturar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Horas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingHours}h</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">valor bruto</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timesheets da Semana</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar timesheets..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell className="font-medium">{timesheet.employee}</TableCell>
                  <TableCell>{timesheet.project}</TableCell>
                  <TableCell>{timesheet.client}</TableCell>
                  <TableCell>{new Date(timesheet.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{timesheet.startTime} - {timesheet.endTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{timesheet.hours}h</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(timesheet.hours * timesheet.hourlyRate)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(timesheet.status)}>
                      {timesheet.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {timesheet.status === "pendente" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Aprovar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(timesheets.map(t => t.employee))).map(employee => {
                const employeeTimesheets = timesheets.filter(t => t.employee === employee);
                const totalHours = employeeTimesheets.reduce((sum, t) => sum + t.hours, 0);
                const totalValue = employeeTimesheets.reduce((sum, t) => sum + (t.hours * t.hourlyRate), 0);
                
                return (
                  <div key={employee} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-semibold">{employee}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{totalHours}h trabalhadas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(totalValue)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(timesheets.map(t => t.project))).map(project => {
                const projectTimesheets = timesheets.filter(t => t.project === project);
                const totalHours = projectTimesheets.reduce((sum, t) => sum + t.hours, 0);
                const totalValue = projectTimesheets.reduce((sum, t) => sum + (t.hours * t.hourlyRate), 0);
                
                return (
                  <div key={project} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-semibold">{project}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{totalHours}h registradas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{formatCurrency(totalValue)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}