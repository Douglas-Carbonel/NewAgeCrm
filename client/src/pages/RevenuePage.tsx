import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Filter
} from "lucide-react";

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const revenueStats = {
    currentMonth: 125000,
    lastMonth: 98000,
    growth: 27.6,
    ytd: 1250000,
    target: 1500000,
    targetProgress: 83.3
  };

  const monthlyRevenue = [
    { month: "Jan", revenue: 85000, projected: 90000 },
    { month: "Fev", revenue: 92000, projected: 95000 },
    { month: "Mar", revenue: 78000, projected: 85000 },
    { month: "Abr", revenue: 105000, projected: 100000 },
    { month: "Mai", revenue: 118000, projected: 110000 },
    { month: "Jun", revenue: 125000, projected: 120000 }
  ];

  const revenueByService = [
    { service: "Desenvolvimento Web", revenue: 450000, percentage: 36 },
    { service: "Consultoria", revenue: 350000, percentage: 28 },
    { service: "Mobile Apps", revenue: 280000, percentage: 22.4 },
    { service: "Manutenção", revenue: 170000, percentage: 13.6 }
  ];

  const topClients = [
    { client: "Empresa ABC", revenue: 85000, projects: 3 },
    { client: "StartupXYZ", revenue: 72000, projects: 2 },
    { client: "Tech Corp", revenue: 58000, projects: 4 },
    { client: "Innovation Ltd", revenue: 45000, projects: 1 }
  ];

  const periodOptions = [
    { value: "week", label: "Esta Semana" },
    { value: "month", label: "Este Mês" },
    { value: "quarter", label: "Este Trimestre" },
    { value: "year", label: "Este Ano" }
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Receita" 
        subtitle="Análise completa da receita e performance financeira" 
      />

      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Period Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex space-x-2">
              {periodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedPeriod === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.currentMonth)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{revenueStats.growth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mês Anterior</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.lastMonth)}</p>
                  <p className="text-sm text-gray-500 mt-2">Comparativo</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Anual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.ytd)}</p>
                  <p className="text-sm text-gray-500 mt-2">Janeiro a Junho</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meta Anual</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.target)}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progresso</span>
                      <span className="font-medium">{revenueStats.targetProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${revenueStats.targetProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium text-gray-600">{item.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Real</span>
                          <span className="text-sm text-gray-900">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(item.revenue / 150000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">Projetado</span>
                          <span className="text-xs text-gray-500">{formatCurrency(item.projected)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Receita por Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByService.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.service}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Principais Clientes por Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{client.client}</h4>
                      <p className="text-sm text-gray-600">{client.projects} projetos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(client.revenue)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Top {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}