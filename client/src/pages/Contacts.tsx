
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ContactModal } from "@/components/ContactModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  User,
  Star
} from "lucide-react";
import type { ClientContact } from "@shared/schema";

type ContactWithClient = ClientContact & {
  clientName?: string;
  clientCompany?: string;
};

export default function Contacts() {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactWithClient | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery<ContactWithClient[]>({
    queryKey: ["/api/contacts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Sucesso",
        description: "Contato excluído com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir contato",
        variant: "destructive",
      });
    },
  });

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.clientName?.toLowerCase().includes(searchLower) ||
      contact.clientCompany?.toLowerCase().includes(searchLower) ||
      contact.position?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (contact: ContactWithClient) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este contato?")) {
      deleteMutation.mutate(id);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Cargo', 'Cliente', 'Contato Principal'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.email || ''}"`,
        `"${contact.phone || ''}"`,
        `"${contact.position || ''}"`,
        `"${contact.clientName || ''} ${contact.clientCompany ? `(${contact.clientCompany})` : ''}"`,
        `"${contact.isPrimary ? 'Sim' : 'Não'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contatos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sucesso",
      description: "Arquivo CSV exportado com sucesso",
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Contatos" 
        subtitle="Gerencie os contatos dos seus clientes" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Contatos</CardTitle>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  setSelectedContact(undefined);
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Contato
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </Button>
            </div>

            {/* Contacts Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          {contact.isPrimary && (
                            <div className="flex items-center text-xs text-amber-600">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Principal
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.clientName}</div>
                        {contact.clientCompany && (
                          <div className="text-sm text-gray-500">{contact.clientCompany}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.email ? (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{contact.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.phone ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{contact.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.position ? (
                        <Badge variant="outline">{contact.position}</Badge>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.isPrimary ? (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          Principal
                        </Badge>
                      ) : (
                        <Badge variant="outline">Secundário</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(contact)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
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

            {filteredContacts.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhum contato encontrado" : "Nenhum contato cadastrado"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Adicione seu primeiro contato para começar"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ContactModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedContact(undefined);
        }}
        contact={selectedContact}
      />
    </div>
  );
}
