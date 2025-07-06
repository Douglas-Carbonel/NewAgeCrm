
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ProposalEditor } from "@/components/ProposalEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  FileText,
  Send,
  Eye,
  Download
} from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  clientName: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  value: number;
  createdAt: string;
  validUntil: string;
  description: string;
}

export default function ProposalsPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const proposals: Proposal[] = [
    {
      id: 1,
      title: "Website Institucional - Empresa ABC",
      clientName: "João Silva",
      status: 'sent',
      value: 15000,
      createdAt: '2024-01-15',
      validUntil: '2024-02-15',
      description: "Desenvolvimento de website institucional completo"
    },
    {
      id: 2,
      title: "Sistema de Gestão - Startup XYZ",
      clientName: "Maria Santos",
      status: 'draft',
      value: 25000,
      createdAt: '2024-01-20',
      validUntil: '2024-02-20',
      description: "Sistema de gestão empresarial customizado"
    }
  ];

  const filteredProposals = proposals.filter(proposal => 
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviada';
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return status;
    }
  };

  const handleEdit = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta proposta?")) {
      toast({
        title: "Sucesso",
        description: "Proposta excluída com sucesso",
      });
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
            <div className="flex items-center justify-between">
              <CardTitle>Todas as Propostas</CardTitle>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => {
                  setSelectedProposal(undefined);
                  setShowEditor(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Proposta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar propostas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Proposals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(proposal)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(proposal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{proposal.title}</h3>
                        <p className="text-sm text-gray-600">{proposal.clientName}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(proposal.status)}>
                            {getStatusText(proposal.status)}
                          </Badge>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(proposal.value)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {proposal.description}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          <p>Criada: {formatDate(proposal.createdAt)}</p>
                          <p>Válida até: {formatDate(proposal.validUntil)}</p>
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
                  {searchQuery ? "Nenhuma proposta encontrada" : "Nenhuma proposta ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Crie sua primeira proposta para começar"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showEditor && (
        <ProposalEditor 
          open={showEditor}
          onClose={() => {
            setShowEditor(false);
            setSelectedProposal(undefined);
          }}
          proposal={selectedProposal}
        />
      )}
    </div>
  );
}
