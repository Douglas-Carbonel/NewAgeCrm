import { TopBar } from "@/components/TopBar";
import { AutomationPanel } from "@/components/AutomationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Bell, User } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Configurações" 
        subtitle="Gerencie automações e preferências do sistema" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automações
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automation">
            <AutomationPanel />
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configure como e quando você deseja receber notificações do sistema.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Em desenvolvimento - Em breve você poderá personalizar completamente suas notificações.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gerencie suas informações pessoais e preferências de conta.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Em desenvolvimento - Em breve você poderá editar seu perfil e preferências.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}