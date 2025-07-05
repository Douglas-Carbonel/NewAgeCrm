import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Globe, Eye, Share2, Settings, Users, FileText, BarChart3, Lock, Mail, Link } from "lucide-react";

export default function ClientPortalPage() {
  const [activeClients, setActiveClients] = useState([
    {
      id: 1,
      name: "Tech Corp",
      email: "contato@techcorp.com",
      portalAccess: true,
      lastAccess: "2024-01-15",
      projectsCount: 3,
      documentsCount: 12
    },
    {
      id: 2,
      name: "Loja Online",
      email: "admin@lojaonline.com",
      portalAccess: true,
      lastAccess: "2024-01-14",
      projectsCount: 1,
      documentsCount: 8
    },
    {
      id: 3,
      name: "StartupXYZ",
      email: "ceo@startupxyz.com",
      portalAccess: false,
      lastAccess: "Nunca",
      projectsCount: 2,
      documentsCount: 15
    }
  ]);

  const portalFeatures = [
    { name: "Visualização de Projetos", description: "Cliente pode ver o progresso dos projetos", enabled: true },
    { name: "Download de Documentos", description: "Acesso a documentos e relatórios", enabled: true },
    { name: "Comunicação Direta", description: "Chat integrado com a equipe", enabled: true },
    { name: "Aprovação de Propostas", description: "Aprovar propostas diretamente no portal", enabled: false },
    { name: "Pagamento Online", description: "Pagamento de faturas pelo portal", enabled: false },
    { name: "Agendamento", description: "Agendar reuniões e chamadas", enabled: true }
  ];

  const ClientCard = ({ client }: { client: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </div>
          </div>
          <Badge variant={client.portalAccess ? "default" : "secondary"}>
            {client.portalAccess ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Último Acesso</p>
            <p className="font-semibold">{client.lastAccess}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Projetos</p>
            <p className="font-semibold">{client.projectsCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Documentos</p>
            <p className="font-semibold">{client.documentsCount}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Visualizar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Compartilhar
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {client.portalAccess ? (
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Lock className="w-4 h-4 mr-1" />
                Desativar
              </Button>
            ) : (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Globe className="w-4 h-4 mr-1" />
                Ativar
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Configurar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portal do Cliente</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie o acesso dos clientes aos seus portais</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Globe className="w-4 h-4 mr-2" />
          Configurar Portal
        </Button>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="customization">Personalização</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4">
            {activeClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Portal</CardTitle>
              <CardDescription>Configure quais funcionalidades estarão disponíveis para os clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                    <Badge variant={feature.enabled ? "default" : "secondary"}>
                      {feature.enabled ? "Habilitado" : "Desabilitado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize a aparência do portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo da Empresa</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cor Principal</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                    <Input value="#2563eb" className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Domínio Personalizado</label>
                  <Input placeholder="portal.suaempresa.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Configurações gerais do portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Portal</label>
                  <Input placeholder="Portal do Cliente - Sua Empresa" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem de Boas-vindas</label>
                  <Input placeholder="Bem-vindo ao nosso portal!" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email de Suporte</label>
                  <Input placeholder="suporte@suaempresa.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone de Suporte</label>
                  <Input placeholder="(11) 99999-9999" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {activeClients.filter(c => c.portalAccess).length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  de {activeClients.length} clientes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acessos Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">+15% desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos Baixados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">156</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">neste mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Tech Corp acessou o projeto "Sistema de Gestão"</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Loja Online baixou o relatório de progresso</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold">StartupXYZ enviou mensagem via chat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Há 1 dia</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}