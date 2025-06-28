import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { InvoiceModal } from "@/components/InvoiceModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Receipt,
  Eye,
  Download
} from "lucide-react";
import type { InvoiceWithClient } from "@shared/schema";

export default function Invoicing() {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithClient | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: invoices = [], isLoading } = useQuery<InvoiceWithClient[]>({
    queryKey: ["/api/invoices"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/invoices/${id}`, {
        status: "paid",
        paidDate: new Date().toISOString().split('T')[0]
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Invoice marked as paid",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (invoice: InvoiceWithClient) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleMarkAsPaid = (id: number) => {
    if (confirm("Mark this invoice as paid?")) {
      markAsPaidMutation.mutate(id);
    }
  };

  // Calculate totals
  const totals = filteredInvoices.reduce((acc, invoice) => {
    const amount = parseFloat(invoice.amount);
    acc.total += amount;
    if (invoice.status === "paid") acc.paid += amount;
    if (invoice.status === "overdue") acc.overdue += amount;
    return acc;
  }, { total: 0, paid: 0, overdue: 0 });

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Invoicing" 
        subtitle="Manage invoices and payments" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(totals.total)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(totals.paid)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {formatCurrency(totals.overdue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Invoices</CardTitle>
              <Button onClick={() => {
                setSelectedInvoice(undefined);
                setShowModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Invoice</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Due Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          {invoice.description && (
                            <p className="text-sm text-gray-600">{invoice.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.client.name}</p>
                          <p className="text-sm text-gray-600">{invoice.client.company}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              disabled={markAsPaidMutation.isPending}
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInvoices.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    {searchQuery || statusFilter !== "all" ? "No invoices found" : "No invoices yet"}
                  </p>
                  <p>
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Generate your first invoice to get started"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <InvoiceModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedInvoice(undefined);
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
}
