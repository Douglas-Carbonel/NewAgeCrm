
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User
} from "lucide-react";

interface Timesheet {
  id: number;
  employee: string;
  period: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  projects: {
    name: string;
    hours: number;
  }[];
}

export default function TimesheetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const timesheets: Timesheet[] = [
    {
      id: 1,
      employee: "João Silva",
      period: "01/01/2024 - 07/01/2024",
      totalHours: 42,
      regularHours: 40,
      overtimeHours: 2,
      status: 'pending',
      submittedAt: '2024-01-08',
      projects: [
        { name: "Website Corporativo", hours: 25 },
        { name: "App Mobile", hours: 17 }
      ]
    },
    {
      id: 2,
      employee: "Maria Santos",
      period: "01/01/2024 - 07/01/2024",
      totalHours: 40,
      regularHours: 40,
      overtimeHours: 0,
      status: 'approved',
      submittedAt: '2024-01-08',
      approvedBy: "Admin",
      approvedAt: '2024-01-09',
      projects: [
        { name: "Design System", hours: 40 }
      ]
    },
    {
      id: 3,
      employee: "Pedro Costa",
      period: "25/12/2023 - 31/12/2023",
      totalHours: 35,
      regularHours: 35,
      overtimeHours: 0,
      status: 'rejected',
      submittedAt: '2024-01-02',
      projects: [
        { name: "Sistema Backend", hours: 35 }
      ]
    }
  ];

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendentes" },
    { value: "approved", label: "Aprovados" },
    { value: "rejected", label: "Rejeitados" }
  ];

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = timesheet.employee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || timesheet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return AlertCircle;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const handleApprove = (id: number) => {
    toast({
      title: "Timesheet Aprovado",
      description: "O timesheet foi aprovado com sucesso",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Timesheet Rejeitado",
      description: "O timesheet foi rejeitado",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Timesheets" 
        subtitle="Gerencie e aprove os timesheets da equipe" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Controle de Horas</CardTitle>
              <Button 
                variant="default" 
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Timesheet
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por funcionário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Timesheets List */}
            <div className="space-y-4">
              {filteredTimesheets.map((timesheet) => {
                const StatusIcon = getStatusIcon(timesheet.status);
                
                return (
                  <Card key={timesheet.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{timesheet.employee}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {timesheet.period}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(timesheet.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(timesheet.status)}
                          </Badge>
                          
                          {timesheet.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApprove(timesheet.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReject(timesheet.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{timesheet.totalHours}h</div>
                          <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{timesheet.regularHours}h</div>
                          <div className="text-sm text-gray-600">Regular</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{timesheet.overtimeHours}h</div>
                          <div className="text-sm text-gray-600">Extra</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Projetos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {timesheet.projects.map((project, index) => (
                            <Badge key={index} variant="outline">
                              {project.name}: {project.hours}h
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Enviado em: {formatDate(timesheet.submittedAt)}</span>
                          {timesheet.approvedBy && (
                            <span>Aprovado por: {timesheet.approvedBy} em {formatDate(timesheet.approvedAt!)}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredTimesheets.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhum timesheet encontrado" : "Nenhum timesheet ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Os timesheets aparecerão aqui quando forem enviados"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
