import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Copy, Edit, Trash2, Plus, FileText, Briefcase, Code, Palette, Star } from 'lucide-react';

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  thumbnail?: string;
  isPopular?: boolean;
  lastUsed?: string;
  tags: string[];
}

interface ProposalTemplatesProps {
  onSelectTemplate: (template: ProposalTemplate) => void;
}

export function ProposalTemplates({ onSelectTemplate }: ProposalTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const templates: ProposalTemplate[] = [
    {
      id: '1',
      name: 'Proposta de Desenvolvimento Web',
      description: 'Template completo para projetos de desenvolvimento web com escopo detalhado',
      category: 'desenvolvimento',
      content: `
        <h1 style="text-align: center; color: #2563eb; margin-bottom: 2rem;">Proposta de Desenvolvimento Web</h1>
        
        <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
          <h2 style="color: #1e40af; margin-bottom: 1rem;">Resumo Executivo</h2>
          <p>Esta proposta apresenta nossa solução completa para o desenvolvimento do seu projeto web, incluindo análise de requisitos, arquitetura, desenvolvimento e entrega.</p>
        </div>

        <h2 style="color: #1e40af; margin-bottom: 1rem;">Escopo do Projeto</h2>
        <ul style="margin-bottom: 2rem;">
          <li>Análise de requisitos e planejamento</li>
          <li>Design UX/UI responsivo</li>
          <li>Desenvolvimento frontend e backend</li>
          <li>Integração com APIs</li>
          <li>Testes e deploy</li>
        </ul>

        <h2 style="color: #1e40af; margin-bottom: 1rem;">Cronograma</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Fase</th>
              <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Duração</th>
              <th style="padding: 0.75rem; border: 1px solid #e2e8f0; text-align: left;">Entregáveis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">Planejamento</td>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">1 semana</td>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">Documentação técnica</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">Desenvolvimento</td>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">4 semanas</td>
              <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">Aplicação funcional</td>
            </tr>
          </tbody>
        </table>

        <h2 style="color: #1e40af; margin-bottom: 1rem;">Investimento</h2>
        <div style="background: #fef3c7; padding: 2rem; border-radius: 8px; text-align: center;">
          <p style="font-size: 1.5rem; font-weight: bold; color: #92400e;">R$ 15.000,00</p>
          <p style="color: #92400e;">Valor total do projeto</p>
        </div>
      `,
      isPopular: true,
      tags: ['desenvolvimento', 'web', 'completo']
    },
    {
      id: '2',
      name: 'Proposta de Design UX/UI',
      description: 'Template focado em projetos de design e experiência do usuário',
      category: 'design',
      content: `
        <h1 style="text-align: center; color: #7c3aed; margin-bottom: 2rem;">Proposta de Design UX/UI</h1>
        
        <div style="background: #f5f3ff; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
          <h2 style="color: #6d28d9; margin-bottom: 1rem;">Sobre o Projeto</h2>
          <p>Criação de interfaces intuitivas e experiências digitais memoráveis para seus usuários.</p>
        </div>

        <h2 style="color: #6d28d9; margin-bottom: 1rem;">Processo de Design</h2>
        <ol style="margin-bottom: 2rem;">
          <li><strong>Pesquisa e Discovery:</strong> Análise do usuário e mercado</li>
          <li><strong>Wireframes:</strong> Estruturação da interface</li>
          <li><strong>Protótipos:</strong> Criação de protótipos interativos</li>
          <li><strong>Design Visual:</strong> Aplicação da identidade visual</li>
          <li><strong>Testes:</strong> Validação com usuários reais</li>
        </ol>

        <h2 style="color: #6d28d9; margin-bottom: 1rem;">Entregáveis</h2>
        <ul style="margin-bottom: 2rem;">
          <li>Wireframes detalhados</li>
          <li>Protótipos interativos</li>
          <li>Design system completo</li>
          <li>Telas finais em alta fidelidade</li>
          <li>Documentação técnica</li>
        </ul>

        <div style="background: #ecfdf5; padding: 2rem; border-radius: 8px; text-align: center;">
          <p style="font-size: 1.5rem; font-weight: bold; color: #065f46;">R$ 8.000,00</p>
          <p style="color: #065f46;">Investimento total</p>
        </div>
      `,
      isPopular: true,
      tags: ['design', 'ux', 'ui', 'prototipo']
    },
    {
      id: '3',
      name: 'Proposta de Consultoria',
      description: 'Template para serviços de consultoria e análise técnica',
      category: 'consultoria',
      content: `
        <h1 style="text-align: center; color: #dc2626; margin-bottom: 2rem;">Proposta de Consultoria Técnica</h1>
        
        <div style="background: #fef2f2; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
          <h2 style="color: #b91c1c; margin-bottom: 1rem;">Objetivo</h2>
          <p>Análise especializada e recomendações estratégicas para otimização dos seus processos tecnológicos.</p>
        </div>

        <h2 style="color: #b91c1c; margin-bottom: 1rem;">Metodologia</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #ffffff; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-bottom: 0.5rem;">Análise Atual</h3>
            <p style="font-size: 0.9rem; color: #6b7280;">Avaliação completa da situação atual</p>
          </div>
          <div style="background: #ffffff; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-bottom: 0.5rem;">Recomendações</h3>
            <p style="font-size: 0.9rem; color: #6b7280;">Plano de ação detalhado</p>
          </div>
        </div>

        <h2 style="color: #b91c1c; margin-bottom: 1rem;">Áreas de Foco</h2>
        <ul style="margin-bottom: 2rem;">
          <li>Arquitetura de sistemas</li>
          <li>Performance e escalabilidade</li>
          <li>Segurança e compliance</li>
          <li>Processos e metodologias</li>
        </ul>

        <div style="background: #fef7cd; padding: 2rem; border-radius: 8px; text-align: center;">
          <p style="font-size: 1.5rem; font-weight: bold; color: #92400e;">R$ 200/hora</p>
          <p style="color: #92400e;">Valor da consultoria</p>
        </div>
      `,
      tags: ['consultoria', 'análise', 'técnica']
    },
    {
      id: '4',
      name: 'Proposta Simples',
      description: 'Template básico para propostas rápidas e diretas',
      category: 'geral',
      content: `
        <h1 style="text-align: center; color: #059669; margin-bottom: 2rem;">Proposta Comercial</h1>
        
        <p style="margin-bottom: 2rem;">Prezado(a) Cliente,</p>
        
        <p style="margin-bottom: 2rem;">Apresentamos nossa proposta para atender às suas necessidades:</p>

        <h2 style="color: #047857; margin-bottom: 1rem;">Serviços Inclusos</h2>
        <ul style="margin-bottom: 2rem;">
          <li>[Descrever serviço 1]</li>
          <li>[Descrever serviço 2]</li>
          <li>[Descrever serviço 3]</li>
        </ul>

        <h2 style="color: #047857; margin-bottom: 1rem;">Prazo de Entrega</h2>
        <p style="margin-bottom: 2rem;">[Definir prazo]</p>

        <h2 style="color: #047857; margin-bottom: 1rem;">Investimento</h2>
        <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 2rem;">R$ [Valor]</p>

        <p style="margin-bottom: 2rem;">Aguardamos seu retorno.</p>
        
        <p>Atenciosamente,<br>[Seu nome]</p>
      `,
      tags: ['simples', 'rápido', 'básico']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: FileText },
    { id: 'desenvolvimento', name: 'Desenvolvimento', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'consultoria', name: 'Consultoria', icon: Briefcase },
    { id: 'geral', name: 'Geral', icon: FileText }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = () => {
    // Implementar criação de template personalizado
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
              <DialogDescription>
                Crie um template personalizado para reutilizar em futuras propostas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Template</label>
                <Input placeholder="Ex: Proposta de E-commerce" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea placeholder="Descreva o uso deste template..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Input placeholder="Ex: desenvolvimento" />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTemplate}>
                  Criar Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.name}
                    {template.isPopular && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Preview do template */}
                <div 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-hidden"
                  dangerouslySetInnerHTML={{ 
                    __html: template.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                  }}
                />
                
                {/* Botões de ação */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Usar Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum template encontrado para os filtros selecionados
          </p>
        </div>
      )}
    </div>
  );
}