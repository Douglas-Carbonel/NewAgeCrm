import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FileEdit, Plus, Search, Send, Eye, Download, Copy } from "lucide-react";

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para propostas
  const proposals = [
    {
      id: 1,
      title: "Proposta - Sistema de Gestão",
      client: "Tech Corp",
      value: 50000,
      status: "enviada",
      date: "2024-01-15",
      template: "Desenvolvimento Web"
    },
    {
      id: 2,
      title: "Proposta - E-commerce",
      client: "Loja Online",
      value: 35000,
      status: "aprovada",
      date: "2024-01-10",
      template: "E-commerce"
    },
    {
      id: 3,
      title: "Proposta - App Mobile",
      client: "StartupXYZ",
      value: 80000,
      status: "rascunho",
      date: "2024-01-20",
      template: "Mobile App"
    }
  ];

  const templates = [
    { id: 1, name: "Desenvolvimento Web", description: "Template para projetos web" },
    { id: 2, name: "E-commerce", description: "Template para lojas online" },
    { id: 3, name: "Mobile App", description: "Template para aplicativos móveis" },
    { id: 4, name: "Consultoria", description: "Template para serviços de consultoria" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada": return "bg-green-100 text-green-800";
      case "enviada": return "bg-blue-100 text-blue-800";
      case "rascunho": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Propostas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas propostas e templates</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Propostas</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar propostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileEdit className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                        <CardDescription>{proposal.client}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Valor</p>
                        <p className="font-semibold text-green-600">{formatCurrency(proposal.value)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
                        <p className="font-semibold">{new Date(proposal.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Template</p>
                        <p className="font-semibold">{proposal.template}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicar
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Propostas</CardTitle>
              <CardDescription>Crie e edite suas propostas com um editor rico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Proposta</label>
                    <Input placeholder="Digite o título da proposta" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cliente</label>
                    <Input placeholder="Selecione o cliente" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-20">
                    Editor de texto rico será implementado aqui
                  </p>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Funcionalidades: Formatação, imagens, tabelas, etc.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Salvar como PDF
                    </Button>
                    <Button variant="outline">Salvar Rascunho</Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Proposta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Templates de Propostas</h3>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Copy className="w-4 h-4 mr-1" />
                      Usar Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}