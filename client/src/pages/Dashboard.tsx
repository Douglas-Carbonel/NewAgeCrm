import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { MetricsCard } from "@/components/MetricsCard";
import { ProjectModal } from "@/components/ProjectModal";
import { ClientModal } from "@/components/ClientModal";
import { TaskModal } from "@/components/TaskModal";
import { InvoiceModal } from "@/components/InvoiceModal";
import { AlertsWidget } from "@/components/AlertsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusColor, getPriorityColor, translateStatus } from "@/lib/utils";
import { 
  FolderOpen, 
  Users, 
  CheckSquare, 
  DollarSign,
  Plus,
  UserPlus,
  Receipt,
  BarChart3,
  Code,
  Smartphone,
  Database,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import type { ProjectWithClient, TaskWithProject } from "@shared/schema";

export default function Dashboard() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: projects = [] } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<TaskWithProject[]>({
    queryKey: ["/api/tasks"],
  });

  const recentProjects = projects.slice(0, 3);
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
    .slice(0, 5);

  const getProjectIcon = (index: number) => {
    const icons = [Code, Smartphone, Database];
    const IconComponent = icons[index % icons.length];
    return IconComponent;
  };

  const getProjectIconColor = (index: number) => {
    const colors = ["bg-primary", "bg-orange-500", "bg-green-500"];
    return colors[index % colors.length];
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Painel" 
        subtitle="Bem-vindo de volta! Aqui está a visão geral dos seus projetos" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Projetos Ativos"
            value={metrics?.activeProjects || 0}
            subtitle="8% do mês passado"
            icon={FolderOpen}
            iconColor="bg-blue-100 dark:bg-blue-900"
            trend="up"
          />
          <MetricsCard
            title="Total de Clientes"
            value={metrics?.totalClients || 0}
            subtitle="3 novos este mês"
            icon={Users}
            iconColor="bg-green-100 dark:bg-green-900"
            trend="up"
          />
          <MetricsCard
            title="Tarefas Pendentes"
            value={metrics?.pendingTasks || 0}
            subtitle="12 vencendo esta semana"
            icon={CheckSquare}
            iconColor="bg-orange-100 dark:bg-orange-900"
          />
          <MetricsCard
            title="Receita"
            value={formatCurrency(metrics?.totalRevenue || 0)}
            subtitle="15% do mês passado"
            icon={DollarSign}
            iconColor="bg-purple-100 dark:bg-purple-900"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Projetos Recentes</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowProjectModal(true)}
                  >
                    Ver Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => {
                    const IconComponent = getProjectIcon(index);
                    const iconColor = getProjectIconColor(index);
                    
                    return (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{project.client.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>
                            {translateStatus(project.status)}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Prazo: {formatDate(project.deadline)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {recentProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>Nenhum projeto ainda. Crie seu primeiro projeto!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Prazos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.project.name}</p>
                      <p className={`text-xs mt-1 ${
                        task.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                        task.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {task.dueDate ? formatDate(task.dueDate) : 'Sem prazo definido'}
                      </p>
                    </div>
                  </div>
                ))}
                
                {upcomingTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>Nenhuma tarefa próxima</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Smart Alerts Widget */}
          <AlertsWidget />
        </div>

        {/* Project Management Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gestão de Projetos</CardTitle>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setShowProjectModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Project</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Progress</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Deadline</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project, index) => {
                    const IconComponent = getProjectIcon(index);
                    const iconColor = getProjectIconColor(index);
                    
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{project.name}</p>
                              <p className="text-sm text-gray-600">Development</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-900">{project.client.company}</td>
                        <td className="px-4 py-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-900">{formatDate(project.deadline)}</td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {projects.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-lg font-medium mb-2">No projects yet</p>
                  <p>Create your first project to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-6 h-auto hover:shadow-lg transition-all"
                onClick={() => setShowProjectModal(true)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">New Project</span>
              </Button>
              
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-6 h-auto hover:shadow-lg transition-all"
                onClick={() => setShowClientModal(true)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Add Client</span>
              </Button>
              
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-6 h-auto hover:shadow-lg transition-all"
                onClick={() => setShowInvoiceModal(true)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-3">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Generate Invoice</span>
              </Button>
              
              <Button 
                variant="secondary" 
                className="flex flex-col items-center p-6 h-auto hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProjectModal open={showProjectModal} onClose={() => setShowProjectModal(false)} />
      <ClientModal open={showClientModal} onClose={() => setShowClientModal(false)} />
      <TaskModal open={showTaskModal} onClose={() => setShowTaskModal(false)} />
      <InvoiceModal open={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} />
    </div>
  );
}
