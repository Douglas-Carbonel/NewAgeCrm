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
      "bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 shadow-2xl flex-shrink-0 transition-all duration-300 border-r border-slate-600/50",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "border-b border-slate-700/50 flex items-center backdrop-blur-sm",
        isCollapsed ? "p-2 justify-center" : "p-4 justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Sophisticated Logo Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30 backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                
                {/* Main icon - Circuit/Tech pattern */}
                <div className="w-8 h-8 relative z-10">
                  {/* Central processor chip */}
                  <div className="absolute inset-2 bg-white/90 rounded-sm border border-blue-200/50"></div>
                  
                  {/* Circuit lines - horizontal */}
                  <div className="absolute top-1 left-0 w-2 h-0.5 bg-white/80"></div>
                  <div className="absolute top-3 left-0 w-2 h-0.5 bg-white/80"></div>
                  <div className="absolute top-5 left-0 w-2 h-0.5 bg-white/80"></div>
                  
                  <div className="absolute top-1 right-0 w-2 h-0.5 bg-white/80"></div>
                  <div className="absolute top-3 right-0 w-2 h-0.5 bg-white/80"></div>
                  <div className="absolute top-5 right-0 w-2 h-0.5 bg-white/80"></div>
                  
                  {/* Circuit lines - vertical */}
                  <div className="absolute left-1 top-0 w-0.5 h-2 bg-white/80"></div>
                  <div className="absolute left-3 top-0 w-0.5 h-2 bg-white/80"></div>
                  <div className="absolute left-5 top-0 w-0.5 h-2 bg-white/80"></div>
                  
                  <div className="absolute left-1 bottom-0 w-0.5 h-2 bg-white/80"></div>
                  <div className="absolute left-3 bottom-0 w-0.5 h-2 bg-white/80"></div>
                  <div className="absolute left-5 bottom-0 w-0.5 h-2 bg-white/80"></div>
                  
                  {/* Corner connection points */}
                  <div className="absolute top-0 left-0 w-1 h-1 bg-blue-300 rounded-full"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-blue-300 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-300 rounded-full"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-blue-300 rounded-full"></div>
                  
                  {/* Central indicators */}
                  <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-ping"></div>
            </div>
            
            {/* Premium Typography */}
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2 min-w-0">
                <h1 className="text-xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent tracking-tight leading-none whitespace-nowrap">
                  DEV
                </h1>
                <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300 bg-clip-text text-transparent tracking-tight leading-none whitespace-nowrap">
                  CONTROL
                </h1>
              </div>
              <p className="text-xs font-semibold text-blue-300/80 tracking-wider uppercase whitespace-nowrap">
                Sistema de Gestão
              </p>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-xs text-slate-400/70 font-medium whitespace-nowrap">Online</span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 hover:scale-105",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-slate-300" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-300" />
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
                      "flex items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer group relative hover:scale-105",
                      isItemActiveState
                        ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
                    )}
                    title={item.name}
                  >
                    <ItemIcon className="w-5 h-5" />
                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-slate-600 shadow-xl">
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
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]",
                    isActive 
                      ? "bg-gradient-to-r from-slate-600/20 to-blue-500/20 text-blue-300 border border-blue-500/30" 
                      : "text-slate-400 hover:bg-slate-600/30 hover:text-slate-200"
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
                            "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]",
                            isItemActiveState
                              ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white font-medium shadow-lg"
                              : "text-slate-300 hover:bg-slate-600/40 hover:text-white"
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
          "border-t border-slate-700/50", 
          isCollapsed ? "pt-3 mt-3" : "pt-4 mt-4"
        )}>
          <Link href={settingsItem.href}>
            <div
              className={cn(
                "flex items-center rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.02]",
                isCollapsed 
                  ? "justify-center p-3" 
                  : "space-x-3 px-3 py-2.5 text-sm",
                isItemActive(settingsItem.href)
                  ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white font-medium shadow-lg"
                  : "text-slate-300 hover:bg-slate-600/40 hover:text-white"
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
