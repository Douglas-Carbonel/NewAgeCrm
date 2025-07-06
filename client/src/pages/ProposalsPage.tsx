import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search,
  FileText,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useLocation } from "wouter";
import type { Client } from "@shared/schema";

// Mock data for proposals
const mockProposals = [
  {
    id: 1,
    title: "Website Redesign Proposal",
    client: "Tech Corp",
    status: "draft",
    value: 15000,
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "StartupXYZ",
    status: "sent",
    value: 25000,
    createdAt: "2024-01-10",
    dueDate: "2024-02-10",
  },
  {
    id: 3,
    title: "E-commerce Platform",
    client: "Loja Online",
    status: "approved",
    value: 35000,
    createdAt: "2024-01-05",
    dueDate: "2024-02-05",
  },
];

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "sent": return "default";
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft": return "Rascunho";
      case "sent": return "Enviada";
      case "approved": return "Aprovada";
      case "rejected": return "Rejeitada";
      default: return status;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Propostas" 
        subtitle="Gerencie suas propostas comerciais" 
      />

      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Todas as Propostas</CardTitle>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setLocation("/proposal-editor")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Proposta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar propostas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Proposals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant={getStatusColor(proposal.status)}>
                        {getStatusText(proposal.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{proposal.title}</h3>
                        <p className="text-sm text-gray-600">{proposal.client}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-semibold text-green-600">
                            ${proposal.value.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Criada em:</span>
                          <span>{new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Vencimento:</span>
                          <span>{new Date(proposal.dueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setLocation(`/proposal-editor?id=${proposal.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setLocation(`/proposal-editor?id=${proposal.id}&edit=true`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProposals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery || statusFilter !== "all" ? "Nenhuma proposta encontrada" : "Nenhuma proposta criada"}
                </p>
                <p>
                  {searchQuery || statusFilter !== "all" 
                    ? "Tente ajustar seus filtros de busca" 
                    : "Crie sua primeira proposta para começar"
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