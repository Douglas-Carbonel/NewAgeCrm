import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, DollarSign, Clock, Users } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Desenvolvimento Web",
      description: "Criação de sites e aplicações web personalizadas",
      price: 85,
      unit: "hora",
      category: "Desenvolvimento",
      active: true,
      estimatedHours: 40
    },
    {
      id: 2,
      name: "Consultoria em TI",
      description: "Consultoria especializada em tecnologia da informação",
      price: 150,
      unit: "hora",
      category: "Consultoria",
      active: true,
      estimatedHours: 8
    },
    {
      id: 3,
      name: "Design UX/UI",
      description: "Design de interfaces e experiência do usuário",
      price: 95,
      unit: "hora",
      category: "Design",
      active: true,
      estimatedHours: 24
    },
    {
      id: 4,
      name: "Manutenção de Sistema",
      description: "Manutenção e suporte técnico de sistemas",
      price: 2500,
      unit: "mensal",
      category: "Suporte",
      active: true,
      estimatedHours: 20
    }
  ]);

  const categories = ["Desenvolvimento", "Consultoria", "Design", "Suporte", "Marketing"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const ServiceCard = ({ service }: { service: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </div>
          </div>
          <Badge variant={service.active ? "default" : "secondary"}>
            {service.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preço</p>
            <p className="font-semibold text-green-600">
              {formatCurrency(service.price)}/{service.unit}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
            <p className="font-semibold">{service.category}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {service.estimatedHours}h estimadas
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Serviços</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus serviços e preços</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Serviço</DialogTitle>
              <DialogDescription>
                Adicione um novo serviço ao seu catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Serviço</label>
                <Input placeholder="Ex: Desenvolvimento Web" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea placeholder="Descrição detalhada do serviço" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unidade</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="hora">Por hora</option>
                    <option value="projeto">Por projeto</option>
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select className="w-full p-2 border rounded-md">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Horas Estimadas</label>
                  <Input type="number" placeholder="8" />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Serviço</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total de Serviços</span>
                <span className="font-semibold">{services.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Serviços Ativos</span>
                <span className="font-semibold">{services.filter(s => s.active).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Preço Médio/Hora</span>
                <span className="font-semibold">
                  {formatCurrency(services.reduce((acc, s) => acc + s.price, 0) / services.length)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map(category => {
                const count = services.filter(s => s.category === category).length;
                return (
                  <div key={category} className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Duplicar Serviço
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Editar em Lote
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Ajustar Preços
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}