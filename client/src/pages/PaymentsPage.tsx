import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Plus, Search, Filter, Download, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const payments = [
    {
      id: 1,
      invoice: "INV-2024-001",
      client: "Tech Corp",
      amount: 15000,
      method: "transferencia",
      status: "processando",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      reference: "PIX-123456"
    },
    {
      id: 2,
      invoice: "INV-2024-002",
      client: "Loja Online",
      amount: 8500,
      method: "boleto",
      status: "pago",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      reference: "BOL-789012"
    },
    {
      id: 3,
      invoice: "INV-2024-003",
      client: "StartupXYZ",
      amount: 25000,
      method: "cartao",
      status: "pendente",
      date: "2024-01-12",
      dueDate: "2024-01-27",
      reference: "CC-345678"
    },
    {
      id: 4,
      invoice: "INV-2024-004",
      client: "Tech Corp",
      amount: 5000,
      method: "pix",
      status: "falhou",
      date: "2024-01-14",
      dueDate: "2024-01-29",
      reference: "PIX-901234"
    }
  ];

  const paymentMethods = [
    { id: "pix", name: "PIX", count: 12, total: 45000 },
    { id: "transferencia", name: "Transferência", count: 8, total: 32000 },
    { id: "boleto", name: "Boleto", count: 15, total: 28000 },
    { id: "cartao", name: "Cartão", count: 5, total: 18000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago": return "bg-green-100 text-green-800";
      case "processando": return "bg-blue-100 text-blue-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "falhou": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processando": return <Clock className="w-4 h-4 text-blue-600" />;
      case "pendente": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "falhou": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMethodName = (method: string) => {
    const methods: Record<string, string> = {
      pix: "PIX",
      transferencia: "Transferência",
      boleto: "Boleto",
      cartao: "Cartão"
    };
    return methods[method] || method;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalPago = payments.filter(p => p.status === "pago").reduce((sum, p) => sum + p.amount, 0);
  const totalPendente = payments.filter(p => p.status === "pendente").reduce((sum, p) => sum + p.amount, 0);
  const totalProcessando = payments.filter(p => p.status === "processando").reduce((sum, p) => sum + p.amount, 0);
  const totalFalhou = payments.filter(p => p.status === "falhou").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe todos os pagamentos recebidos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pagamento
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {payments.filter(p => p.status === "pago").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {payments.filter(p => p.status === "pendente").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              Processando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalProcessando)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {payments.filter(p => p.status === "processando").length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              Falharam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalFalhou)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {payments.filter(p => p.status === "falhou").length} pagamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="methods">Métodos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Pesquisar pagamentos..."
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
                    <TableHead>Fatura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.invoice}</TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{getMethodName(payment.method)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{payment.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-gray-600">{payment.reference}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                          {payment.status === "falhou" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Reprocessar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>Análise por forma de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                        {method.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Recebido</p>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(method.total)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade</p>
                          <p className="font-semibold">{method.count} pagamentos</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
                          <p className="font-semibold">{formatCurrency(method.total / method.count)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Taxa de Sucesso</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 30 dias</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((payments.filter(p => p.status === "pago").length / payments.length) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Tempo Médio de Processamento</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Para pagamentos aprovados</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">2.5 dias</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="font-semibold">Valor Médio</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Por transação</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clientes por Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(payments.map(p => p.client))).map(client => {
                    const clientPayments = payments.filter(p => p.client === client);
                    const totalAmount = clientPayments.reduce((sum, p) => sum + p.amount, 0);
                    
                    return (
                      <div key={client} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <p className="font-semibold">{client}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {clientPayments.length} pagamentos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(totalAmount)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>Configure opções de pagamento e notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Métodos de Pagamento Aceitos</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <Badge variant="default">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Notificar pagamentos recebidos</span>
                      <Badge variant="default">Habilitado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Alertas de pagamentos em atraso</span>
                      <Badge variant="default">Habilitado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Resumo semanal de pagamentos</span>
                      <Badge variant="secondary">Desabilitado</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Integração Banking</h3>
                  <div className="space-y-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Conectar Conta Bancária
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Conecte suas contas bancárias para reconciliação automática de pagamentos
                    </p>
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