import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProposalEditor } from "@/components/ProposalEditor";
import { ArrowLeft, Send, Save, Download, Eye, Users, Mail, Calendar, DollarSign } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

export default function ProposalEditorPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/proposals/editor/:id?");
  
  const [proposalContent, setProposalContent] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalClient, setProposalClient] = useState("");
  const [proposalValue, setProposalValue] = useState("");
  const [proposalValidUntil, setProposalValidUntil] = useState("");
  const [proposalTags, setProposalTags] = useState<string[]>([]);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isEditMode = !!params?.id;

  // Dados de exemplo para clientes
  const clients = [
    { id: '1', name: 'Tech Corp', email: 'contato@techcorp.com' },
    { id: '2', name: 'Loja Online', email: 'admin@lojaonline.com' },
    { id: '3', name: 'StartupXYZ', email: 'hello@startupxyz.com' },
    { id: '4', name: 'Empresa ABC', email: 'info@empresaabc.com' }
  ];

  // Simular carregamento da proposta se estivermos editando
  useEffect(() => {
    if (isEditMode && params?.id) {
      // Aqui você faria a chamada para a API para carregar a proposta
      // Por enquanto, simulando com dados de exemplo
      const mockProposal: Proposal = {
        id: params.id,
        title: "Proposta - Sistema de Gestão",
        client: "Tech Corp",
        clientId: '1',
        value: 50000,
        status: "rascunho",
        date: "2024-01-15",
        validUntil: "2024-02-15",
        content: `
          <h1 style="text-align: center; color: #2563eb; margin-bottom: 2rem;">Proposta de Desenvolvimento de Sistema</h1>
          
          <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
            <h2 style="color: #1e40af; margin-bottom: 1rem;">Resumo Executivo</h2>
            <p>Esta proposta apresenta nossa solução completa para o desenvolvimento do seu sistema de gestão empresarial.</p>
          </div>

          <h2 style="color: #1e40af; margin-bottom: 1rem;">Escopo do Projeto</h2>
          <ul style="margin-bottom: 2rem;">
            <li>Análise de requisitos e planejamento</li>
            <li>Desenvolvimento do sistema completo</li>
            <li>Testes e validação</li>
            <li>Implantação e treinamento</li>
          </ul>

          <h2 style="color: #1e40af; margin-bottom: 1rem;">Investimento</h2>
          <div style="background: #fef3c7; padding: 2rem; border-radius: 8px; text-align: center;">
            <p style="font-size: 1.5rem; font-weight: bold; color: #92400e;">R$ 50.000,00</p>
            <p style="color: #92400e;">Valor total do projeto</p>
          </div>
        `,
        tags: ['desenvolvimento', 'sistema']
      };

      setCurrentProposal(mockProposal);
      setProposalTitle(mockProposal.title);
      setProposalClient(mockProposal.client);
      setProposalValue(mockProposal.value.toString());
      setProposalContent(mockProposal.content);
      setProposalValidUntil(mockProposal.validUntil || "");
      setProposalTags(mockProposal.tags);
    }
  }, [isEditMode, params?.id]);

  const handleSaveProposal = async (content: string) => {
    setIsSaving(true);
    try {
      // Aqui você faria a chamada para a API para salvar a proposta
      const proposalData = {
        title: proposalTitle,
        client: proposalClient,
        value: parseFloat(proposalValue) || 0,
        content: content,
        validUntil: proposalValidUntil,
        tags: proposalTags
      };

      console.log('Salvando proposta:', proposalData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar estado local se estivermos editando
      if (currentProposal) {
        setCurrentProposal(prev => prev ? { ...prev, ...proposalData } : null);
      }
      
      alert('Proposta salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      alert('Erro ao salvar proposta. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendProposal = async () => {
    if (!proposalClient || !proposalContent.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
      return;
    }

    setIsSending(true);
    try {
      // Primeiro, salvar a proposta
      await handleSaveProposal(proposalContent);
      
      // Depois, enviar por email
      const clientData = clients.find(c => c.name === proposalClient);
      const emailData = {
        to: clientData?.email,
        subject: `Proposta: ${proposalTitle}`,
        content: proposalContent,
        proposalId: currentProposal?.id || 'new'
      };

      console.log('Enviando proposta por email:', emailData);
      
      // Simular envio por email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Proposta enviada com sucesso para ${clientData?.email}!`);
      
      // Atualizar status para enviada
      if (currentProposal) {
        setCurrentProposal(prev => prev ? { ...prev, status: 'enviada' as const } : null);
      }
      
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      alert('Erro ao enviar proposta. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  const handleExportPDF = async () => {
    try {
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

      const fileName = `proposta-${proposalTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview - ${proposalTitle}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 20px auto; 
                padding: 20px;
                line-height: 1.6;
              }
              h1, h2, h3 { margin-top: 2em; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            ${proposalContent}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/proposals')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Propostas
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditMode ? 'Editar Proposta' : 'Nova Proposta'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isEditMode ? `Editando: ${proposalTitle}` : 'Criando nova proposta'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!proposalContent.trim()}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={!proposalContent.trim()}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveProposal(proposalContent)}
                disabled={isSaving || !proposalContent.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                onClick={handleSendProposal}
                disabled={isSending || !proposalContent.trim() || !proposalClient}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Enviando...' : 'Enviar ao Cliente'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com informações da proposta */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    placeholder="Ex: Proposta de Desenvolvimento Web"
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
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div>{client.name}</div>
                              <div className="text-xs text-gray-500">{client.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      value={proposalValue}
                      onChange={(e) => setProposalValue(e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                  {proposalValue && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(parseFloat(proposalValue))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Válida até</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={proposalValidUntil}
                      onChange={(e) => setProposalValidUntil(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status da proposta (se editando) */}
                {currentProposal && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Badge className={
                      currentProposal.status === 'aprovada' ? 'bg-green-100 text-green-800' :
                      currentProposal.status === 'enviada' ? 'bg-blue-100 text-blue-800' :
                      currentProposal.status === 'rejeitada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {currentProposal.status}
                    </Badge>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {proposalTags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Editor de Proposta</CardTitle>
              </CardHeader>
              <CardContent>
                <ProposalEditor
                  content={proposalContent}
                  onChange={setProposalContent}
                  onSave={handleSaveProposal}
                  onExportPDF={handleExportPDF}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}