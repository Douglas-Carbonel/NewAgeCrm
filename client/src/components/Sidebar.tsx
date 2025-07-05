import { useState } from "react";
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
  Clock,
  CreditCard,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Building2,
  DollarSign,
  Activity,
  Menu,
  X
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface NavigationGroup {
  name: string;
  icon: any;
  items: NavigationItem[];
  defaultOpen?: boolean;
}

const navigationGroups: NavigationGroup[] = [
  {
    name: "Principal",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { name: "Painel", href: "/", icon: LayoutDashboard },
      { name: "Agenda", href: "/calendar", icon: Calendar }
    ]
  },
  {
    name: "Gestão",
    icon: Building2,
    defaultOpen: true,
    items: [
      { name: "Projetos", href: "/projects", icon: FolderOpen },
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Tarefas", href: "/tasks", icon: CheckSquare },
      { name: "Contratos", href: "/contracts", icon: FileText }
    ]
  },
  {
    name: "Financeiro",
    icon: DollarSign,
    defaultOpen: false,
    items: [
      { name: "Faturamento", href: "/invoicing", icon: Receipt },
      { name: "Controle de Horas", href: "/time-tracking", icon: Clock },
      { name: "Cobrança", href: "/billing", icon: CreditCard }
    ]
  },
  {
    name: "Análises",
    icon: Activity,
    defaultOpen: false,
    items: [
      { name: "Relatórios", href: "/reports", icon: BarChart3 },
      { name: "Aprovações", href: "/approvals", icon: CheckCircle }
    ]
  }
];

const settingsItem = { name: "Configurações", href: "/settings", icon: Settings };

export function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navigationGroups.reduce((acc, group) => ({
      ...acc,
      [group.name]: group.defaultOpen ?? false
    }), {})
  );

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenGroups({});
    } else {
      setOpenGroups(
        navigationGroups.reduce((acc, group) => ({
          ...acc,
          [group.name]: group.defaultOpen ?? false
        }), {})
      );
    }
  };

  const isItemActive = (href: string) => location === href;
  const isGroupActive = (items: NavigationItem[]) => 
    items.some(item => isItemActive(item.href));

  return (
    <aside className={cn(
      "bg-white shadow-lg flex-shrink-0 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "border-b border-gray-200 flex items-center",
        isCollapsed ? "p-2 justify-center" : "p-4 justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DevCRM</h1>
              <p className="text-xs text-gray-500">CRM para Pequenas Empresas</p>
            </div>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <nav className={cn("space-y-1", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? (
          // Modo colapsado - apenas ícones principais
          <>
            {navigationGroups.flatMap(group => group.items).map((item) => {
              const isItemActiveState = isItemActive(item.href);
              const ItemIcon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg transition-colors cursor-pointer group relative",
                      isItemActiveState
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    title={item.name}
                  >
                    <ItemIcon className="w-5 h-5" />
                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          // Modo expandido - grupos com categorias
          navigationGroups.map((group) => {
            const isOpen = openGroups[group.name];
            const isActive = isGroupActive(group.items);
            const GroupIcon = group.icon;
            
            return (
              <div key={group.name}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-50 text-primary" 
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <GroupIcon className="w-4 h-4" />
                    <span>{group.name}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              
              {/* Group Items */}
              {isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {group.items.map((item) => {
                    const isItemActiveState = isItemActive(item.href);
                    const ItemIcon = item.icon;
                    
                    return (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer",
                            isItemActiveState
                              ? "bg-primary text-white font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <ItemIcon className="w-4 h-4" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
        )}
        
        {/* Settings - sempre visível */}
        <div className={cn(
          "border-t border-gray-200", 
          isCollapsed ? "pt-2 mt-2" : "pt-4 mt-4"
        )}>
          <Link href={settingsItem.href}>
            <div
              className={cn(
                "flex items-center rounded-lg transition-colors cursor-pointer",
                isCollapsed 
                  ? "justify-center p-3" 
                  : "space-x-2 px-3 py-2 text-sm",
                isItemActive(settingsItem.href)
                  ? "bg-primary text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              title={isCollapsed ? settingsItem.name : undefined}
            >
              <Settings className="w-4 h-4" />
              {!isCollapsed && <span>{settingsItem.name}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {settingsItem.name}
                </div>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
