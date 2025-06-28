import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ContractModal } from "@/components/ContractModal";
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
  FileText,
  Download,
  Upload
} from "lucide-react";
import type { ContractWithClient } from "@shared/schema";

export default function Contracts() {
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractWithClient | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: contracts = [], isLoading } = useQuery<ContractWithClient[]>({
    queryKey: ["/api/contracts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contracts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contract",
        variant: "destructive",
      });
    },
  });

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (contract: ContractWithClient) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Contracts" 
        subtitle="Manage contracts and agreements" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Contracts</CardTitle>
              <Button onClick={() => {
                setSelectedContract(undefined);
                setShowModal(true);
              }}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Contract
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contracts..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contracts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(contract)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(contract.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{contract.name}</h3>
                        <p className="text-sm text-gray-600">{contract.client.company}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                        {contract.value && (
                          <span className="font-medium text-gray-900">
                            {formatCurrency(contract.value)}
                          </span>
                        )}
                      </div>
                      
                      {(contract.startDate || contract.endDate) && (
                        <div className="space-y-1 text-sm text-gray-600">
                          {contract.startDate && (
                            <p>Start: {formatDate(contract.startDate)}</p>
                          )}
                          {contract.endDate && (
                            <p>End: {formatDate(contract.endDate)}</p>
                          )}
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Created {formatDate(contract.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContracts.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery || statusFilter !== "all" ? "No contracts found" : "No contracts yet"}
                </p>
                <p>
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Upload your first contract to get started"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ContractModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedContract(undefined);
        }}
        contract={selectedContract}
      />
    </div>
  );
}
