import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingUp, CheckCircle } from "lucide-react";

interface DashboardAlerts {
  urgent: number;
  upcoming: number;
  overdue: number;
  suggestions: string[];
}

export function AlertsWidget() {
  const { data: alerts } = useQuery<DashboardAlerts>({
    queryKey: ["/api/automation/alerts"],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (!alerts) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5" />
          Alertas Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{alerts.urgent}</div>
            <div className="text-xs text-gray-500">Urgente</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{alerts.upcoming}</div>
            <div className="text-xs text-gray-500">Próximos</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{alerts.overdue}</div>
            <div className="text-xs text-gray-500">Atrasados</div>
          </div>
        </div>

        {/* Suggestions */}
        {alerts.suggestions.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Sugestões do Sistema</h4>
            <div className="space-y-2">
              {alerts.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sistema ativo</span>
            </div>
            <span>Atualizado agora</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}