
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building,
  MapPin,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  Star,
  X
} from "lucide-react";
import type { Client, Project } from "@shared/schema";

export default function ClientDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/clients/:id");
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const { toast } = useToast();

  const clientId = params?.id;

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ["/api/clients", clientId],
    enabled: !!clientId,
    onSuccess: (data) => {
      console.log('Cliente carregado do Supabase:', data);
    },
    onError: (error) => {
      console.error('Erro ao carregar cliente:', error);
    }
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects", "client", clientId],
    enabled: !!clientId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Client>) => {
      const response = await apiRequest("PUT", `/api/clients/${clientId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      });
      setIsEditing(false);
      setEditedClient({});
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <TopBar title="Carregando..." />
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex-1 overflow-hidden">
        <TopBar title="Cliente não encontrado" />
        <div className="p-6 text-center">
          <p>Cliente não encontrado</p>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/clients")}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Clientes
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateMutation.mutate(editedClient);
  };

  const handleEdit = (field: string, value: string) => {
    setEditedClient(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = () => {
    if (!client) return;
    
    setEditedClient({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
    });
    setIsEditing(true);
  };

  const getDisplayValue = (field: keyof Client) => {
    if (isEditing && editedClient[field] !== undefined) {
      return editedClient[field] || '';
    }
    return client?.[field] || '';
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title={client.name}
        subtitle="Detalhes do cliente"
        showBack
        onBack={() => setLocation("/clients")}
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Header com Avatar e Informações Principais */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {client.name ? client.name.substring(0, 2).toUpperCase() : '??'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {client?.name || 'Cliente'}
                    </h1>
                    {client?.company && (
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {client.company}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Star className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Cliente desde {client?.createdAt ? formatDate(client.createdAt) : 'Data não disponível'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedClient({});
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                      >
                        Salvar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startEditing}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações de Contato */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      {isEditing ? (
                        <Input
                          value={getDisplayValue('email') || ''}
                          onChange={(e) => handleEdit('email', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">{client?.email || 'Não informado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Telefone</label>
                      {isEditing ? (
                        <Input
                          value={getDisplayValue('phone') || ''}
                          onChange={(e) => handleEdit('phone', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">
                          {client?.phone || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Empresa</label>
                      {isEditing ? (
                        <Input
                          value={getDisplayValue('company') || ''}
                          onChange={(e) => handleEdit('company', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">
                          {client?.company || 'Não informado'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Endereço</label>
                      {isEditing ? (
                        <Input
                          value={getDisplayValue('address') || ''}
                          onChange={(e) => handleEdit('address', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">
                          {client?.address || 'Não informado'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo Rápido */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projetos Ativos</span>
                      <Badge variant="secondary">{projects.length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Receita Total</span>
                      <span className="font-semibold">R$ 0,00</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Último Projeto</span>
                      <span className="text-sm">
                        {projects.length > 0 ? formatDate(projects[0].createdAt) : 'Nenhum'}
                      </span>
                    </div>

                    <Separator />

                    <div>
                      <label className="block text-sm font-medium mb-2">Tags</label>
                      <div className="flex flex-wrap gap-1">
                        {client?.tags && client.tags.length > 0 ? (
                          client.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Nenhuma tag</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pessoas de Contato</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Contato
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum contato adicional cadastrado</p>
                  <p className="text-sm">Adicione pessoas de contato para este cliente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Projetos Recentes</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Criado em {formatDate(project.createdAt)}
                          </p>
                        </div>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum projeto iniciado ainda</p>
                    <p className="text-sm">Crie o primeiro projeto para este cliente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Histórico de Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma fatura emitida ainda</p>
                  <p className="text-sm">O histórico de faturamento aparecerá aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Anotações</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Nota
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma anotação adicionada</p>
                  <p className="text-sm">Adicione anotações sobre este cliente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
