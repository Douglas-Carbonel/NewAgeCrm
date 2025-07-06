import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { TopBar } from "@/components/TopBar";
import { ClientModal } from "@/components/ClientModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  Building,
  Grid3X3,
  List,
  Settings,
  Eye,
  Tag,
  X
} from "lucide-react";
import type { Client } from "@shared/schema";

export default function Clients() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    email: true,
    company: true,
    phone: true,
    address: false,
    tags: true,
  });
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Extract all unique tags from clients
  const allUniqueTag = clients.reduce<string[]>((tags, client) => {
    if (client.tags) {
      client.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags.sort();
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  const filteredClients = clients.filter(client => {
    // Text search filter
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tag filter
    const matchesTags = selectedTagFilters.length === 0 || 
      (client.tags && selectedTagFilters.some(tag => client.tags!.includes(tag)));
    
    return matchesSearch && matchesTags;
  });

  const handleEdit = (client: Client) => {
    setLocation(`/clients/${client.id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteMutation.mutate(id);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !allUniqueTag.includes(newTag.trim())) {
      setAllTags([...allTags, newTag.trim()].sort());
      setNewTag("");
      toast({
        title: "Sucesso",
        description: "Tag adicionada com sucesso",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setAllTags(allTags.filter(tag => tag !== tagToRemove));
    // Also remove from selected filters if it was selected
    setSelectedTagFilters(selectedTagFilters.filter(tag => tag !== tagToRemove));
    toast({
      title: "Sucesso", 
      description: "Tag removida com sucesso",
    });
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTagFilters.includes(tag)) {
      setSelectedTagFilters(selectedTagFilters.filter(t => t !== tag));
    } else {
      setSelectedTagFilters([...selectedTagFilters, tag]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Empresa', 'Telefone', 'Endereço', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.email || ''}"`,
        `"${client.company || ''}"`,
        `"${client.phone || ''}"`,
        `"${client.address || ''}"`,
        `"${client.tags ? client.tags.join('; ') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sucesso",
      description: "Arquivo CSV exportado com sucesso",
    });
  };

  const renderListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleFields.name && <TableHead>Nome</TableHead>}
          {visibleFields.email && <TableHead>Email</TableHead>}
          {visibleFields.company && <TableHead>Empresa</TableHead>}
          {visibleFields.phone && <TableHead>Telefone</TableHead>}
          {visibleFields.address && <TableHead>Endereço</TableHead>}
          {visibleFields.tags && <TableHead>Tags</TableHead>}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredClients.map((client) => (
          <TableRow key={client.id}>
            {visibleFields.name && (
              <TableCell className="font-medium">{client.name}</TableCell>
            )}
            {visibleFields.email && (
              <TableCell>{client.email || 'Não informado'}</TableCell>
            )}
            {visibleFields.company && (
              <TableCell>{client.company || 'Não informado'}</TableCell>
            )}
            {visibleFields.phone && (
              <TableCell>{client.phone || 'Não informado'}</TableCell>
            )}
            {visibleFields.address && (
              <TableCell>{client.address || 'Não informado'}</TableCell>
            )}
            {visibleFields.tags && (
              <TableCell>
                {client.tags && client.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  'Nenhuma tag'
                )}
              </TableCell>
            )}
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(client)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(client.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEdit(client)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(client.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{client.company}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{client.email || 'Não informado'}</span>
                </div>
                
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
                
                {client.address && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                )}
                
                {client.tags && client.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {client.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Adicionado {formatDate(client.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Clients" 
        subtitle="Manage your client relationships" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Clientes</CardTitle>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  setSelectedClient(undefined);
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              {/* Left Side - Search and Filter */}
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filter by Status/Tags */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Filtro
                      {selectedTagFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 text-xs">
                          {selectedTagFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Filtrar por Tags</p>
                      <div className="space-y-1">
                        {allUniqueTag.map((tag) => (
                          <DropdownMenuCheckboxItem 
                            key={tag} 
                            checked={selectedTagFilters.includes(tag)}
                            onCheckedChange={() => toggleTagFilter(tag)}
                          >
                            {tag}
                          </DropdownMenuCheckboxItem>
                        ))}
                        {allUniqueTag.length === 0 && (
                          <p className="text-xs text-gray-500">Nenhuma tag disponível</p>
                        )}
                      </div>
                      {selectedTagFilters.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setSelectedTagFilters([])}
                            className="cursor-pointer text-red-600"
                          >
                            Limpar filtros
                          </DropdownMenuItem>
                        </>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right Side - View Controls, Tags Management, Export */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Field Visibility Control (only visible in list mode) */}
                {viewMode === 'list' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="p-2">
                        <p className="text-sm font-medium mb-2">Campos Visíveis</p>
                        <div className="space-y-1">
                          {Object.entries(visibleFields).map(([field, visible]) => (
                            <DropdownMenuCheckboxItem
                              key={field}
                              checked={visible}
                              onCheckedChange={(checked) =>
                                setVisibleFields({ ...visibleFields, [field]: checked })
                              }
                            >
                              {field === 'name' && 'Nome'}
                              {field === 'email' && 'Email'}
                              {field === 'company' && 'Empresa'}
                              {field === 'phone' && 'Telefone'}
                              {field === 'address' && 'Endereço'}
                              {field === 'tags' && 'Tags'}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Options Menu - Tags and Export */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => setShowTagsDialog(true)}
                      className="cursor-pointer"
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      Gerenciar Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={exportToCSV}
                      className="cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Exportar CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'list' ? renderListView() : renderCardView()}

            {filteredClients.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhum cliente encontrado" : "Nenhum cliente ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Adicione seu primeiro cliente para começar"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ClientModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedClient(undefined);
        }}
        client={selectedClient}
      />

      {/* Tags Management Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Nome da nova tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag}>Adicionar</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Tags existentes:</p>
              <div className="flex flex-wrap gap-2">
                {allUniqueTag.map((tag) => (
                  <div key={tag} className="flex items-center space-x-1">
                    <Badge variant="outline">{tag}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              {allUniqueTag.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma tag disponível</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
