
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Code,
  Smartphone,
  Monitor,
  Database,
  Settings,
  Users
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  duration: string;
  active: boolean;
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Mock data - replace with actual API call
  const services: Service[] = [
    {
      id: 1,
      name: "Desenvolvimento de Website",
      description: "Criação de website responsivo e moderno",
      category: "Desenvolvimento Web",
      price: 2500,
      unit: "projeto",
      duration: "2-4 semanas",
      active: true
    },
    {
      id: 2,
      name: "Aplicativo Mobile",
      description: "Desenvolvimento de app para iOS e Android",
      category: "Mobile",
      price: 8000,
      unit: "projeto",
      duration: "8-12 semanas",
      active: true
    },
    {
      id: 3,
      name: "Consultoria Técnica",
      description: "Consultoria especializada em tecnologia",
      category: "Consultoria",
      price: 150,
      unit: "hora",
      duration: "conforme demanda",
      active: true
    },
    {
      id: 4,
      name: "Manutenção de Sistemas",
      description: "Suporte e manutenção de sistemas existentes",
      category: "Suporte",
      price: 80,
      unit: "hora",
      duration: "mensal",
      active: true
    }
  ];

  const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Desenvolvimento Web": return Code;
      case "Mobile": return Smartphone;
      case "Consultoria": return Users;
      case "Suporte": return Settings;
      default: return Monitor;
    }
  };

  const handleEdit = (service: Service) => {
    toast({
      title: "Editar Serviço",
      description: `Editando ${service.name}`,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso",
      });
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Serviços" 
        subtitle="Gerencie seu catálogo de serviços" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Catálogo de Serviços</CardTitle>
              <Button 
                variant="default" 
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "Todas" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const IconComponent = getCategoryIcon(service.category);
                
                return (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(service.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              por {service.unit}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Duração: {service.duration}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <Badge 
                              className={service.active ? 
                                "bg-green-100 text-green-800" : 
                                "bg-red-100 text-red-800"
                              }
                            >
                              {service.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery ? "Nenhum serviço encontrado" : "Nenhum serviço ainda"}
                </p>
                <p>
                  {searchQuery 
                    ? "Tente ajustar sua busca" 
                    : "Adicione seu primeiro serviço para começar"
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
