import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalTemplates } from "@/components/ProposalTemplates";
import { Plus, Search, Edit, Trash2, Send, Eye, Download, Filter, FileText, Clock, DollarSign, Users } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  client: string;
  clientId?: string;
  value: number;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada' | 'expirada';
  date: string;
  content: string;
  validUntil?: string;
  tags: string[];
}

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
}

export default function ProposalsPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para propostas
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: "Proposta - Sistema de Gestão",
      client: "Tech Corp",
      clientId: '1',
      value: 50000,
      status: "enviada",
      date: "2024-01-15",
      validUntil: "2024-02-15",
      content: "<h1>Proposta de Sistema de Gestão</h1><p>Desenvolvimento completo de sistema...</p>",
      tags: ['desenvolvimento', 'sistema']
    },
    {
      id: '2',
      title: "Proposta - Redesign Website",
      client: "Loja Online",
      clientId: '2',
      value: 25000,
      status: "aprovada",
      date: "2024-01-10",
      validUntil: "2024-02-10",
      content: "<h1>Proposta de Redesign</h1><p>Novo design para o website...</p>",
      tags: ['design', 'website']
    },
    {
      id: '3',
      title: "Proposta - Consultoria UX",
      client: "StartupXYZ",
      clientId: '3',
      value: 15000,
      status: "rascunho",
      date: "2024-01-20",
      content: "<h1>Consultoria UX/UI</h1><p>Análise e melhoria da experiência...</p>",
      tags: ['consultoria', 'ux']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada": return "bg-green-100 text-green-800";
      case "enviada": return "bg-blue-100 text-blue-800";
      case "rejeitada": return "bg-red-100 text-red-800";
      case "rascunho": return "bg-gray-100 text-gray-800";
      case "expirada": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSelectTemplate = (template: ProposalTemplate) => {
    // Redirecionar para o editor com o template selecionado
    setLocation(`/proposals/editor?template=${template.id}`);
  };

  const handleNewProposal = () => {
    setLocation('/proposals/editor');
  };

  const handleEditProposal = (proposal: Proposal) => {
    setLocation(`/proposals/editor/${proposal.id}`);
  };

  const handleSendProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId 
        ? { ...p, status: 'enviada' as const }
        : p
    ));
  };

  const handleDeleteProposal = (proposalId: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      setProposals(prev => prev.filter(p => p.id !== proposalId));
    }
  };

  const filteredProposals = proposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metrics = {
    total: proposals.length,
    approved: proposals.filter(p => p.status === 'aprovada').length,
    pending: proposals.filter(p => p.status === 'enviada').length,
    totalValue: proposals.filter(p => p.status === 'aprovada').reduce((sum, p) => sum + p.value, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Propostas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie e crie propostas profissionais</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNewProposal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Proposta
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.total}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">propostas criadas</p>
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
            <div className="text-2xl font-bold text-yellow-600">{metrics.pending}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">aguardando resposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.approved}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">propostas aceitas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">propostas aprovadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Lista de Propostas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Propostas</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Pesquisar propostas..."
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
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Válida até</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div className="font-medium">{proposal.title}</div>
                        <div className="flex gap-1 mt-1">
                          {proposal.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{proposal.client}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(proposal.value)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(proposal.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        {proposal.validUntil 
                          ? new Date(proposal.validUntil).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProposal(proposal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {proposal.status === 'rascunho' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendProposal(proposal.id)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProposal(proposal.id)}
                          >
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

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Propostas</CardTitle>
              <CardDescription>
                Escolha um template para acelerar a criação de suas propostas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalTemplates onSelectTemplate={handleSelectTemplate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}