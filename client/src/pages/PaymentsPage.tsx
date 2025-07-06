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
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building
} from "lucide-react";

interface Payment {
  id: number;
  invoiceNumber: string;
  client: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  dueDate: string;
  paidDate?: string;
  description: string;
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const payments: Payment[] = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      client: "João Silva",
      amount: 15000,
      method: "Transferência Bancária",
      status: 'completed',
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      description: "Website Corporativo - Empresa ABC"
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      client: "Maria Santos",
      amount: 8500,
      method: "PIX",
      status: 'pending',
      dueDate: '2024-01-20',
      description: "Consultoria técnica - Janeiro"
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      client: "Pedro Costa",
      amount: 25000,
      method: "Cartão de Crédito",
      status: 'failed',
      dueDate: '2024-01-10',
      description: "Sistema de Gestão - StartupXYZ"
    }
  ];

  const paymentStats = {
    totalReceived: 125000,
    pendingAmount: 33500,
    overdueAmount: 25000,
    thisMonthReceived: 45000
  };

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendentes" },
    { value: "completed", label: "Pagos" },
    { value: "failed", label: "Falharam" }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'failed': return AlertCircle;
      default: return DollarSign;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'completed': return 'Pago';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const handleRecordPayment = (id: number) => {
    toast({
      title: "Pagamento Registrado",
      description: "O pagamento foi registrado com sucesso",
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Pagamentos" 
        subtitle="Controle e gerencie todos os pagamentos" 
      />

      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recebido</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentStats.totalReceived)}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pendente</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(paymentStats.pendingAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Atrasado</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(paymentStats.overdueAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(paymentStats.thisMonthReceived)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <Button 
                variant="default" 
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Pagamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente ou fatura..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payments List */}
            <div className="space-y-4">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                const isOverdue = new Date(payment.dueDate) < new Date() && payment.status === 'pending';

                return (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{payment.invoiceNumber}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {payment.client}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(payment.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Método</p>
                          <p className="text-sm text-gray-900">{payment.method}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {payment.status === 'completed' ? 'Data do Pagamento' : 'Vencimento'}
                          </p>
                          <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {payment.paidDate ? formatDate(payment.paidDate) : formatDate(payment.dueDate)}
                            {isOverdue && ' (Atrasado)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Descrição</p>
                          <p className="text-sm text-gray-900 line-clamp-1">{payment.description}</p>
                        </div>
                      </div>

                      {payment.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRecordPayment(payment.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Registrar Pagamento
                          </Button>
                          <Button variant="outline" size="sm">
                            Enviar Lembrete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhum pagamento encontrado" : "Nenhum pagamento ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Os pagamentos aparecerão aqui quando forem registrados"
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