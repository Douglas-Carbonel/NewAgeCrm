import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  CheckSquare, 
  Receipt, 
  BarChart3, 
  Settings,
  Code,
  Clock,
  CreditCard,
  CheckCircle,
  Calendar
} from "lucide-react";

const navigation = [
  {
    name: "Painel",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projetos",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Clientes",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Contratos",
    href: "/contracts",
    icon: FileText,
  },
  {
    name: "Tarefas",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Faturamento",
    href: "/invoicing",
    icon: Receipt,
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Controle de Horas",
    href: "/time-tracking",
    icon: Clock,
  },
  {
    name: "Cobrança",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Aprovações",
    href: "/approvals",
    icon: CheckCircle,
  },
  {
    name: "Agenda",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DevCRM</h1>
            <p className="text-sm text-gray-500">CRM para Pequenas Empresas</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "bg-blue-50 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        

      </nav>
    </aside>
  );
}
