import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3, Filter, Download } from "lucide-react";

export default function RevenuePage() {
  const revenueData = {
    currentMonth: {
      actual: 125000,
      target: 150000,
      lastMonth: 110000,
      growth: 13.6
    },
    currentYear: {
      actual: 1250000,
      target: 1800000,
      lastYear: 980000,
      growth: 27.5
    }
  };

  const monthlyRevenue = [
    { month: "Jan", revenue: 98000, target: 120000 },
    { month: "Fev", revenue: 105000, target: 125000 },
    { month: "Mar", revenue: 118000, target: 130000 },
    { month: "Abr", revenue: 125000, target: 135000 },
    { month: "Mai", revenue: 132000, target: 140000 },
    { month: "Jun", revenue: 145000, target: 145000 },
    { month: "Jul", revenue: 155000, target: 150000 },
    { month: "Ago", revenue: 148000, target: 155000 },
    { month: "Set", revenue: 162000, target: 160000 },
    { month: "Out", revenue: 175000, target: 165000 },
    { month: "Nov", revenue: 168000, target: 170000 },
    { month: "Dez", revenue: 125000, target: 150000 }
  ];

  const revenueBySource = [
    { source: "Desenvolvimento Web", amount: 450000, percentage: 36, growth: 15.2 },
    { source: "Consultoria", amount: 320000, percentage: 25.6, growth: 8.7 },
    { source: "Design UX/UI", amount: 280000, percentage: 22.4, growth: 22.1 },
    { source: "Manutenção", amount: 200000, percentage: 16, growth: -5.3 }
  ];

  const revenueByClient = [
    { client: "Tech Corp", amount: 180000, percentage: 14.4, projects: 3 },
    { client: "Loja Online", amount: 150000, percentage: 12, projects: 2 },
    { client: "StartupXYZ", amount: 120000, percentage: 9.6, projects: 1 },
    { client: "Empresa ABC", amount: 95000, percentage: 7.6, projects: 2 },
    { client: "Outros", amount: 705000, percentage: 56.4, projects: 15 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const currentMonthProgress = (revenueData.currentMonth.actual / revenueData.currentMonth.target) * 100;
  const currentYearProgress = (revenueData.currentYear.actual / revenueData.currentYear.target) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receita</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe o desempenho financeiro da empresa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatório Detalhado
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueData.currentMonth.actual)}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">
                  {formatPercentage(revenueData.currentMonth.growth)} vs mês anterior
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Meta: {formatCurrency(revenueData.currentMonth.target)}</span>
                  <span>{currentMonthProgress.toFixed(1)}%</span>
                </div>
                <Progress value={currentMonthProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              Este Ano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(revenueData.currentYear.actual)}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">
                  {formatPercentage(revenueData.currentYear.growth)} vs ano anterior
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Meta: {formatCurrency(revenueData.currentYear.target)}</span>
                  <span>{currentYearProgress.toFixed(1)}%</span>
                </div>
                <Progress value={currentYearProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 text-purple-600 mr-2" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(15625)}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+8.2% vs mês anterior</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Por projeto finalizado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
              Margem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                68.5%
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+2.1% vs mês anterior</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Margem bruta média
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="sources">Por Serviço</TabsTrigger>
          <TabsTrigger value="clients">Por Cliente</TabsTrigger>
          <TabsTrigger value="forecasting">Projeções</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal da Receita</CardTitle>
              <CardDescription>Comparação entre receita realizada e meta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.slice(-6).map((data, index) => (
                  <div key={data.month} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Realizado: {formatCurrency(data.revenue)}</span>
                        <span>Meta: {formatCurrency(data.target)}</span>
                      </div>
                      <div className="relative">
                        <Progress value={(data.revenue / data.target) * 100} className="h-3" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {((data.revenue / data.target) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      {data.revenue >= data.target ? (
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Meta
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Abaixo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Tipo de Serviço</CardTitle>
              <CardDescription>Breakdown da receita por categoria de serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBySource.map((source, index) => (
                  <div key={source.source} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{source.source}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{source.percentage}%</Badge>
                          <span className={`text-sm ${source.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(source.growth)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(source.amount)}
                          </span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Cliente</CardTitle>
              <CardDescription>Top clientes por volume de receita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByClient.map((client, index) => (
                  <div key={client.client} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{client.client}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{client.percentage}%</Badge>
                          <span className="text-sm text-gray-600">
                            {client.projects} projeto{client.projects !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(client.amount)}
                          </span>
                        </div>
                        <Progress value={client.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projeção para os Próximos Meses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Janeiro 2025</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Baseado na tendência atual</p>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(165000)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Fevereiro 2025</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cenário otimista</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(180000)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Março 2025</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Meta definida</p>
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(200000)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fatores de Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-400">Novos contratos assinados</p>
                      <p className="text-sm text-green-600 dark:text-green-300">3 projetos de grande porte</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-400">Aumento de preços</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Reajuste de 12% para novos projetos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-800 dark:text-purple-400">Expansão da equipe</p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">+2 desenvolvedores contratados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}