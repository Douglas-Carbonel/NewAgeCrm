import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Zap, 
  Mail, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Settings
} from "lucide-react";

interface AutomationSettings {
  emailNotifications: boolean;
  taskReminders: boolean;
  contractAlerts: boolean;
  invoiceReminders: boolean;
  projectDeadlines: boolean;
  reminderDays: number;
  contractExpiryDays: number;
  invoiceOverdueDays: number;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  workingHours: {
    start: string;
    end: string;
  };
}

const defaultSettings: AutomationSettings = {
  emailNotifications: true,
  taskReminders: true,
  contractAlerts: true,
  invoiceReminders: true,
  projectDeadlines: true,
  reminderDays: 3,
  contractExpiryDays: 30,
  invoiceOverdueDays: 7,
  emailFrequency: 'daily',
  workingHours: {
    start: '09:00',
    end: '18:00'
  }
};

export function AutomationPanel() {
  const [settings, setSettings] = useState<AutomationSettings>(defaultSettings);
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: AutomationSettings) => {
      const response = await apiRequest("POST", "/api/automation/settings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As automações foram configuradas com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive",
      });
    },
  });

  const testNotificationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/automation/test-notification", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notificação enviada",
        description: "Email de teste enviado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao enviar email de teste",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const handleTestNotification = () => {
    testNotificationMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Automações e Lembretes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Notificações por Email
                </Label>
                <p className="text-sm text-gray-600">
                  Receba alertas importantes por email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            {settings.emailNotifications && (
              <div className="ml-6 space-y-3">
                <div className="flex items-center gap-4">
                  <Label className="text-sm">Frequência:</Label>
                  <Select
                    value={settings.emailFrequency}
                    onValueChange={(value: 'immediate' | 'daily' | 'weekly') =>
                      setSettings(prev => ({ ...prev, emailFrequency: value }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Imediato</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm">Horário de trabalho:</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, start: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">às</span>
                    <Input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          workingHours: { ...prev.workingHours, end: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Task Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Lembretes de Tarefas
              </Label>
              <p className="text-sm text-gray-600">
                Alertas para tarefas com prazo próximo
              </p>
            </div>
            <Switch
              checked={settings.taskReminders}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, taskReminders: checked }))
              }
            />
          </div>

          {settings.taskReminders && (
            <div className="ml-6 flex items-center gap-4">
              <Label className="text-sm">Lembrar com antecedência de:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.reminderDays}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, reminderDays: parseInt(e.target.value) || 3 }))
                  }
                  className="w-16"
                />
                <span className="text-sm text-gray-500">dias</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Contract Alerts */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Alertas de Contratos
              </Label>
              <p className="text-sm text-gray-600">
                Avisos sobre contratos expirando
              </p>
            </div>
            <Switch
              checked={settings.contractAlerts}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, contractAlerts: checked }))
              }
            />
          </div>

          {settings.contractAlerts && (
            <div className="ml-6 flex items-center gap-4">
              <Label className="text-sm">Alertar quando faltarem:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.contractExpiryDays}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, contractExpiryDays: parseInt(e.target.value) || 30 }))
                  }
                  className="w-16"
                />
                <span className="text-sm text-gray-500">dias</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Invoice Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Lembretes de Faturas
              </Label>
              <p className="text-sm text-gray-600">
                Alertas para faturas em atraso
              </p>
            </div>
            <Switch
              checked={settings.invoiceReminders}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, invoiceReminders: checked }))
              }
            />
          </div>

          {settings.invoiceReminders && (
            <div className="ml-6 flex items-center gap-4">
              <Label className="text-sm">Lembrar após:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.invoiceOverdueDays}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, invoiceOverdueDays: parseInt(e.target.value) || 7 }))
                  }
                  className="w-16"
                />
                <span className="text-sm text-gray-500">dias de atraso</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Project Deadlines */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Prazos de Projetos
              </Label>
              <p className="text-sm text-gray-600">
                Alertas para projetos com prazo próximo ou em atraso
              </p>
            </div>
            <Switch
              checked={settings.projectDeadlines}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, projectDeadlines: checked }))
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {saveMutation.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>

            <Button 
              variant="outline"
              onClick={handleTestNotification}
              disabled={testNotificationMutation.isPending || !settings.emailNotifications}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {testNotificationMutation.isPending ? "Enviando..." : "Testar Email"}
            </Button>
          </div>

          {/* Status */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Sistema ativo</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Última verificação: {new Date().toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}