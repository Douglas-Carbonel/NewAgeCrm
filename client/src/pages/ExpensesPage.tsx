import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Receipt,
  TrendingDown,
  AlertTriangle,
  PieChart,
  Calendar,
  Building,
  CreditCard
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'paid';
  vendor: string;
  project?: string;
  receipt?: boolean;
}

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const expenses: Expense[] = [
    {
      id: 1,
      description: "Licenças de Software",
      category: "Software",
      amount: 2500,
      date: '2024-01-15',
      status: 'paid',
      vendor: "Adobe Creative Cloud",
      receipt: true
    },
    {
      id: 2,
      description: "Hospedagem de Servidores",
      category: "Infraestrutura",
      amount: 890,
      date: '2024-01-14',
      status: 'paid',
      vendor: "AWS",
      project: "Sistema de Gestão",
      receipt: true
    },
    {
      id: 3,
      description: "Material de Escritório",
      category: "Escritório",
      amount: 450,
      date: '2024-01-13',
      status: 'approved',
      vendor: "Kalunga",
      receipt: false
    },
    {
      id: 4,
      description: "Consultoria Jurídica",
      category: "Serviços",
      amount: 1800,
      date: '2024-01-12',
      status: 'pending',
      vendor: "Escritório Advocacia",
      receipt: false
    }
  ];

  const expenseStats = {
    totalThisMonth: 15750,
    lastMonth: 12300,
    budgetLimit: 20000,
    pendingApproval: 3200
  };

  const expensesByCategory = [
    { category: "Software", amount: 5500, percentage: 35 },
    { category: "Infraestrutura", amount: 4200, percentage: 27 },
    { category: "Serviços", amount: 3800, percentage: 24 },
    { category: "Escritório", amount: 2250, percentage: 14 }
  ];

  const categories = ["all", ...Array.from(new Set(expenses.map(e => e.category)))];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'paid': return 'Pago';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Software': return CreditCard;
      case 'Infraestrutura': return Building;
      case 'Escritório': return Receipt;
      default: return Receipt;
    }
  };

  const handleApprove = (id: number) => {
    toast({
      title: "Despesa Aprovada",
      description: "A despesa foi aprovada com sucesso",
    });
  };

  const budgetUsage = (expenseStats.totalThisMonth / expenseStats.budgetLimit) * 100;

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Despesas" 
        subtitle="Gerencie e controle todas as despesas da empresa" 
      />

      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenseStats.totalThisMonth)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">+28% vs mês anterior</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mês Anterior</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenseStats.lastMonth)}</p>
                  <p className="text-sm text-gray-500 mt-2">Comparativo</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orçamento</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(expenseStats.budgetLimit)}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Usado</span>
                      <span className="font-medium">{budgetUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${budgetUsage > 80 ? 'bg-red-500' : budgetUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aguardando</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(expenseStats.pendingApproval)}</p>
                  <p className="text-sm text-gray-500 mt-2">Aprovação</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensesByCategory.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alerta de Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-800">Uso do Orçamento</span>
                    <span className="text-sm font-bold text-yellow-800">{budgetUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    Restam {formatCurrency(expenseStats.budgetLimit - expenseStats.totalThisMonth)} do orçamento mensal
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Próximos Vencimentos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Licenças Adobe (15/02)</span>
                      <span className="font-medium">{formatCurrency(2500)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Aluguel Escritório (01/02)</span>
                      <span className="font-medium">{formatCurrency(4500)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todas as Despesas</CardTitle>
              <Button 
                variant="default" 
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar despesas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category === "all" ? "Todas" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
              {filteredExpenses.map((expense) => {
                const IconComponent = getCategoryIcon(expense.category);

                return (
                  <Card key={expense.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                            <p className="text-sm text-gray-600">{expense.vendor}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </div>
                          <Badge className={getStatusColor(expense.status)}>
                            {getStatusText(expense.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Categoria</p>
                          <Badge variant="outline">{expense.category}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Data</p>
                          <p className="text-sm text-gray-900">{formatDate(expense.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Projeto</p>
                          <p className="text-sm text-gray-900">{expense.project || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Recibo</p>
                          <Badge className={expense.receipt ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {expense.receipt ? "Anexado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>

                      {expense.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(expense.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Aprovar
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhuma despesa encontrada" : "Nenhuma despesa ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "As despesas aparecerão aqui quando forem registradas"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}