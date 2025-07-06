
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings,
  Users,
  Globe,
  Shield,
  Bell,
  Key,
  Eye,
  Edit,
  BarChart3
} from "lucide-react";

export default function ClientPortalPage() {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [publicAccess, setPublicAccess] = useState(false);
  const { toast } = useToast();

  const portalStats = {
    totalClients: 15,
    activeUsers: 8,
    totalLogins: 142,
    avgSessionTime: "12 min"
  };

  const recentActivity = [
    {
      id: 1,
      client: "João Silva",
      action: "Visualizou proposta #123",
      timestamp: "2 horas atrás"
    },
    {
      id: 2,
      client: "Maria Santos",
      action: "Baixou relatório do projeto",
      timestamp: "4 horas atrás"
    },
    {
      id: 3,
      client: "Pedro Costa",
      action: "Atualizou informações de contato",
      timestamp: "1 dia atrás"
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Configurações Salvas",
      description: "As configurações do portal foram atualizadas com sucesso",
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Portal do Cliente" 
        subtitle="Configure e gerencie o acesso dos seus clientes" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{portalStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{portalStats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Logins</p>
                  <p className="text-2xl font-bold text-gray-900">{portalStats.totalLogins}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{portalStats.avgSessionTime}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Portal Habilitado</h4>
                  <p className="text-sm text-gray-600">Permite acesso dos clientes ao portal</p>
                </div>
                <Switch 
                  checked={portalEnabled}
                  onCheckedChange={setPortalEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações Automáticas</h4>
                  <p className="text-sm text-gray-600">Enviar emails para clientes sobre atualizações</p>
                </div>
                <Switch 
                  checked={autoNotifications}
                  onCheckedChange={setAutoNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Acesso Público</h4>
                  <p className="text-sm text-gray-600">Permitir visualização sem login</p>
                </div>
                <Switch 
                  checked={publicAccess}
                  onCheckedChange={setPublicAccess}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  URL do Portal
                </label>
                <Input 
                  value="https://meudominio.com/portal"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Logo do Portal
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-8 h-8 text-gray-400" />
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar Logo
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.client}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver Toda Atividade
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security & Access */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança e Acessos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Autenticação</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Login por Email</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA</span>
                    <Badge className="bg-gray-100 text-gray-800">Opcional</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Permissões</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ver Projetos</span>
                    <Badge className="bg-green-100 text-green-800">Permitido</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Baixar Arquivos</span>
                    <Badge className="bg-green-100 text-green-800">Permitido</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Sessões</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo Limite</span>
                    <span className="text-sm text-gray-600">30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sessões Ativas</span>
                    <span className="text-sm text-gray-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
