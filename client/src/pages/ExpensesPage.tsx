import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Search, Filter, Download, Edit, Trash2, Receipt, CreditCard, Calendar, AlertTriangle } from "lucide-react";

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const expenses = [
    {
      id: 1,
      description: "Licença Adobe Creative Suite",
      category: "Software",
      amount: 299,
      date: "2024-01-15",
      vendor: "Adobe",
      paymentMethod: "cartao",
      status: "pago",
      receipt: true,
      tags: ["design", "mensal"]
    },
    {
      id: 2,
      description: "Servidor AWS",
      category: "Infraestrutura",
      amount: 850,
      date: "2024-01-10",
      vendor: "Amazon Web Services",
      paymentMethod: "cartao",
      status: "pago",
      receipt: true,
      tags: ["hosting", "mensal"]
    },
    {
      id: 3,
      description: "Equipamento de escritório",
      category: "Equipamentos",
      amount: 2500,
      date: "2024-01-12",
      vendor: "TechStore",
      paymentMethod: "transferencia",
      status: "pendente",
      receipt: false,
      tags: ["escritorio", "unico"]
    },
    {
      id: 4,
      description: "Curso online React Advanced",
      category: "Treinamento",
      amount: 459,
      date: "2024-01-08",
      vendor: "Udemy",
      paymentMethod: "pix",
      status: "pago",
      receipt: true,
      tags: ["educacao", "team"]
    },
    {
      id: 5,
      description: "Marketing Google Ads",
      category: "Marketing",
      amount: 1200,
      date: "2024-01-14",
      vendor: "Google",
      paymentMethod: "cartao",
      status: "pago",
      receipt: true,
      tags: ["ads", "mensal"]
    }
  ];

  const categories = [
    { name: "Software", total: 3200, count: 8, color: "bg-blue-100 text-blue-800" },
    { name: "Infraestrutura", total: 2850, count: 3, color: "bg-green-100 text-green-800" },
    { name: "Equipamentos", total: 4500, count: 5, color: "bg-purple-100 text-purple-800" },
    { name: "Marketing", total: 2400, count: 4, color: "bg-orange-100 text-orange-800" },
    { name: "Treinamento", total: 1200, count: 6, color: "bg-pink-100 text-pink-800" },
    { name: "Outros", total: 850, count: 3, color: "bg-gray-100 text-gray-800" }
  ];

  const monthlyBudget = {
    total: 15000,
    used: 12350,
    remaining: 2650
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "atrasado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      transferencia: "Transferência",
      boleto: "Boleto",
      cartao: "Cartão",
      dinheiro: "Dinheiro"
    };
    return methods[method] || method;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === "pago").reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pendente").reduce((sum, e) => sum + e.amount, 0);

  const budgetUsedPercentage = (monthlyBudget.used / monthlyBudget.total) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Despesas</h1>
          <p className="text-gray-600 dark:text-gray-400">Controle e gerencie todas as despesas da empresa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nova Despesa</DialogTitle>
                <DialogDescription>
                  Adicione uma nova despesa ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Input placeholder="Ex: Licença de software" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Método de Pagamento</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fornecedor</label>
                  <Input placeholder="Nome do fornecedor" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <Textarea placeholder="Informações adicionais (opcional)" />
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Salvar Despesa</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Minus className="w-5 h-5 text-red-600 mr-2" />
              Total Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {expenses.length} despesas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Receipt className="w-5 h-5 text-green-600 mr-2" />
              Pagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidExpenses)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {expenses.filter(e => e.status === "pago").length} despesas quitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingExpenses)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {expenses.filter(e => e.status === "pendente").length} a pagar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {budgetUsedPercentage.toFixed(1)}%
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Usado: {formatCurrency(monthlyBudget.used)}</span>
                  <span>Total: {formatCurrency(monthlyBudget.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${budgetUsedPercentage > 90 ? 'bg-red-500' : budgetUsedPercentage > 75 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Despesas</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Pesquisar despesas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{expense.description}</span>
                          {expense.receipt && (
                            <Receipt className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell>{getPaymentMethodName(expense.paymentMethod)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>Breakdown dos gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.name}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(category.total)}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{category.count} despesas</span>
                          <span>Média: {formatCurrency(category.total / category.count)}</span>
                        </div>
                        <Badge className={category.color}>
                          {((category.total / totalExpenses) * 100).toFixed(1)}% do total
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Orçamento</CardTitle>
                <CardDescription>Acompanhe o uso do orçamento mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatCurrency(monthlyBudget.remaining)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">restante este mês</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Orçamento Total</span>
                      <span>{formatCurrency(monthlyBudget.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gasto até agora</span>
                      <span>{formatCurrency(monthlyBudget.used)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          budgetUsedPercentage > 90 ? 'bg-red-500' : 
                          budgetUsedPercentage > 75 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>0%</span>
                      <span>{budgetUsedPercentage.toFixed(1)}% usado</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {budgetUsedPercentage > 90 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-800 dark:text-red-400 font-medium">
                          Atenção! Orçamento quase esgotado
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orçamento por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category) => {
                    const categoryBudget = (monthlyBudget.total * 0.8) / categories.length; // Distribuição hipotética
                    const categoryUsage = (category.total / categoryBudget) * 100;
                    
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span>{formatCurrency(category.total)} / {formatCurrency(categoryBudget)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              categoryUsage > 90 ? 'bg-red-500' : 
                              categoryUsage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(categoryUsage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Total de Despesas</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Este mês</p>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalExpenses)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Economia vs Mês Anterior</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Comparativo</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(1250)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Despesa Média por Dia</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Baseado no mês atual</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalExpenses / 31)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="font-semibold text-green-800 dark:text-green-400">
                      ↓ Redução em Software
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      -15% comparado ao mês anterior
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="font-semibold text-red-800 dark:text-red-400">
                      ↑ Aumento em Marketing
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      +25% comparado ao mês anterior
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-semibold text-blue-800 dark:text-blue-400">
                      → Estável em Infraestrutura
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Sem alterações significativas
                    </p>
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