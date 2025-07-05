import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProposalEditor } from "@/components/ProposalEditor";
import { ProposalTemplates } from "@/components/ProposalTemplates";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Plus, Search, Edit, Trash2, Send, Eye, Download, Filter, FileText, Clock, DollarSign, Users, Save } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [proposalContent, setProposalContent] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalClient, setProposalClient] = useState("");
  const [proposalValue, setProposalValue] = useState("");

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

  const clients = [
    { id: '1', name: 'Tech Corp' },
    { id: '2', name: 'Loja Online' },
    { id: '3', name: 'StartupXYZ' },
    { id: '4', name: 'Empresa ABC' }
  ];

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

  const handleSaveProposal = (content: string) => {
    if (selectedProposal) {
      // Atualizar proposta existente
      setProposals(prev => prev.map(p => 
        p.id === selectedProposal.id 
          ? { ...p, content, title: proposalTitle || p.title }
          : p
      ));
    } else if (isCreateMode) {
      // Criar nova proposta
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: proposalTitle || "Nova Proposta",
        client: proposalClient,
        value: parseFloat(proposalValue) || 0,
        status: "rascunho",
        date: new Date().toISOString().split('T')[0],
        content: content,
        tags: []
      };
      setProposals(prev => [...prev, newProposal]);
    }
    
    // Reset form
    setSelectedProposal(null);
    setIsCreateMode(false);
    setProposalContent("");
    setProposalTitle("");
    setProposalClient("");
    setProposalValue("");
  };

  const handleExportPDF = async () => {
    if (!selectedProposal && !isCreateMode) return;

    try {
      // Criar elemento temporário com o conteúdo
      const element = document.createElement('div');
      element.innerHTML = proposalContent;
      element.style.width = '210mm';
      element.style.padding = '20mm';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontSize = '12px';
      element.style.lineHeight = '1.5';
      element.style.color = '#000';
      element.style.backgroundColor = '#fff';
      
      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      document.body.removeChild(element);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `proposta-${proposalTitle || 'documento'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  const handleSelectTemplate = (template: ProposalTemplate) => {
    setProposalContent(template.content);
    if (!proposalTitle) {
      setProposalTitle(template.name);
    }
  };

  const handleNewProposal = () => {
    setIsCreateMode(true);
    setSelectedProposal(null);
    setProposalContent("");
    setProposalTitle("");
    setProposalClient("");
    setProposalValue("");
  };

  const handleEditProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsCreateMode(false);
    setProposalContent(proposal.content);
    setProposalTitle(proposal.title);
    setProposalClient(proposal.client);
    setProposalValue(proposal.value.toString());
  };

  const handleSendProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId 
        ? { ...p, status: 'enviada' as const }
        : p
    ));
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Propostas</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
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

        <TabsContent value="editor" className="space-y-4">
          {(selectedProposal || isCreateMode) ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedProposal ? `Editando: ${selectedProposal.title}` : 'Nova Proposta'}
                </CardTitle>
                <CardDescription>
                  Use o editor abaixo para criar ou editar sua proposta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário de dados da proposta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Proposta</label>
                    <Input 
                      placeholder="Digite o título da proposta"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cliente</label>
                    <Select value={proposalClient} onValueChange={setProposalClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.name}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={proposalValue}
                      onChange={(e) => setProposalValue(e.target.value)}
                    />
                  </div>
                </div>

                {/* Editor de Propostas */}
                <ProposalEditor
                  content={proposalContent}
                  onChange={setProposalContent}
                  onSave={handleSaveProposal}
                  onExportPDF={handleExportPDF}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Nenhuma proposta selecionada
                </p>
                <p className="text-gray-500 dark:text-gray-500 mb-4 text-center">
                  Selecione uma proposta da lista ou crie uma nova para começar a editar
                </p>
                <Button onClick={handleNewProposal} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Proposta
                </Button>
              </CardContent>
            </Card>
          )}
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