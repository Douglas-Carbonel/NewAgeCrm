import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ProjectModal } from "@/components/ProjectModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate, getStatusColor, translateStatus } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Code,
  Smartphone,
  Database
} from "lucide-react";
import type { ProjectWithClient } from "@shared/schema";

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithClient | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir projeto",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (project: ProjectWithClient) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      deleteMutation.mutate(id);
    }
  };

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
        title="Projetos" 
        subtitle="Gerencie seus projetos de desenvolvimento" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Projetos</CardTitle>
              <Button onClick={() => {
                setSelectedProject(undefined);
                setShowModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="on_hold">Pausado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Project</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Progress</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Budget</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Deadline</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project, index) => {
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
                              <p className="text-sm text-gray-600">{project.description || "No description"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{project.client.name}</p>
                            <p className="text-sm text-gray-600">{project.client.company}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 min-w-[40px]">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-900">
                          {project.budget ? formatCurrency(project.budget) : "Not set"}
                        </td>
                        <td className="px-4 py-4 text-gray-900">
                          {formatDate(project.deadline)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(project)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProjects.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    {searchQuery || statusFilter !== "all" ? "No projects found" : "No projects yet"}
                  </p>
                  <p>
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first project to get started"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProjectModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedProject(undefined);
        }}
        project={selectedProject}
      />
    </div>
  );
}
