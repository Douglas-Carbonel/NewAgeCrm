import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FlowDeskIcon } from "@/components/FlowDeskIcon";
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
  X,
  FileEdit,
  Globe,
  Timer,
  ClipboardList,
  UsersIcon,
  CreditCard as PaymentIcon,
  TrendingUp,
  Wallet,
  User,
  LogOut,
  Palette,
  Settings as SettingsIcon
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
    name: "Painel",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard }
    ]
  },
  {
    name: "Gestão de Clientes",
    icon: Users,
    defaultOpen: true,
    items: [
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Contatos", href: "/contacts", icon: User },
      { name: "Propostas", href: "/proposals", icon: FileEdit },
      { name: "Contratos", href: "/contracts", icon: FileText },
      { name: "Agenda", href: "/calendar", icon: Calendar },
      { name: "Serviços", href: "/services", icon: Settings },
      { name: "Portal do Cliente", href: "/client-portal", icon: Globe }
    ]
  },
  {
    name: "Gestão de Projetos",
    icon: FolderOpen,
    defaultOpen: true,
    items: [
      { name: "Projetos", href: "/projects", icon: FolderOpen },
      { name: "Tarefas", href: "/tasks", icon: CheckSquare },
      { name: "Time Tracking", href: "/time-tracking", icon: Timer },
      { name: "Timesheets", href: "/timesheets", icon: ClipboardList },
      { name: "Resourcing", href: "/resourcing", icon: UsersIcon }
    ]
  },
  {
    name: "Financeiro",
    icon: DollarSign,
    defaultOpen: false,
    items: [
      { name: "Faturas", href: "/invoicing", icon: Receipt },
      { name: "Pagamentos", href: "/payments", icon: PaymentIcon },
      { name: "Renda", href: "/revenue", icon: TrendingUp },
      { name: "Despesas", href: "/expenses", icon: Wallet }
    ]
  }
];

// Menu de usuário será adicionado no rodapé
const userMenuItems = [
  { name: "Definir Tema", href: "/theme", icon: Palette },
  { name: "Equipe", href: "/team", icon: UsersIcon },
  { name: "Configurações", href: "/settings", icon: SettingsIcon },
  { name: "Logout", href: "/logout", icon: LogOut }
];

export function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
      "bg-slate-800 dark:bg-gray-900 border-r border-slate-700 dark:border-gray-700 transition-all duration-300 flex flex-col h-full",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "flex items-center justify-between border-b border-slate-700/50 dark:border-gray-700/50 flex-shrink-0",
        isCollapsed ? "p-3" : "p-4"
      )}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <FlowDeskIcon size="md" />
            <div>
              <h1 className="text-lg font-bold text-white">FlowDesk</h1>
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
            "p-2 rounded-lg hover:bg-slate-700/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-slate-300 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-gray-400" />
          )}
        </button>
      </div>

      <nav className={cn("space-y-1 flex-1 overflow-y-auto", isCollapsed ? "p-2" : "p-3")}>
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
                        ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white font-medium shadow-lg"
                        : "text-slate-300 dark:text-gray-400 hover:bg-slate-600/40 dark:hover:bg-gray-700/40 hover:text-white"
                    )}
                    title={item.name}
                  >
                    <ItemIcon className="w-5 h-5" />
                    {/* Tooltip no hover */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          // Modo expandido - com grupos
          navigationGroups.map((group) => {
            const isGroupActiveState = isGroupActive(group.items);
            const isGroupOpen = openGroups[group.name];
            const GroupIcon = group.icon;

            return (
              <div key={group.name} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-slate-700/30 dark:hover:bg-gray-700/30 group",
                    isGroupActiveState 
                      ? "text-blue-400 bg-slate-700/20 dark:bg-gray-700/20" 
                      : "text-slate-300 dark:text-gray-400"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <GroupIcon className="w-4 h-4" />
                    <span className="font-medium">{group.name}</span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isGroupOpen ? "rotate-180" : ""
                  )} />
                </button>

                {isGroupOpen && (
                  <div className="ml-6 space-y-1">
                    {group.items.map((item) => {
                      const isItemActiveState = isItemActive(item.href);
                      const ItemIcon = item.icon;

                      return (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02]",
                              isItemActiveState
                                ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white font-medium shadow-lg"
                                : "text-slate-400 dark:text-gray-500 hover:bg-slate-700/40 dark:hover:bg-gray-700/40 hover:text-white"
                            )}
                          >
                            <ItemIcon className="w-4 h-4" />
                            <span className="text-sm">{item.name}</span>
                            {item.badge && (
                              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-auto">
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
      </nav>

      {/* Menu do usuário */}
      <div className={cn(
        "border-t border-slate-700/50 dark:border-gray-700/50 flex-shrink-0", 
        isCollapsed ? "p-2" : "p-3"
      )}>
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              "flex items-center rounded-xl transition-all duration-200 cursor-pointer group hover:scale-[1.02] w-full",
              isCollapsed 
                ? "justify-center p-3" 
                : "space-x-3 px-3 py-2.5 text-sm",
              "text-slate-300 dark:text-gray-400 hover:bg-slate-600/40 dark:hover:bg-gray-700/40 hover:text-white"
            )}
            title={isCollapsed ? "Menu do usuário" : undefined}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            {!isCollapsed && (
              <>
                <span>Usuário</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isUserMenuOpen && "rotate-180")} />
              </>
            )}
          </button>

          {/* Dropdown do menu do usuário */}
          {isUserMenuOpen && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 dark:bg-gray-800 rounded-lg shadow-lg border border-slate-700 dark:border-gray-700 overflow-hidden">
              {userMenuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 dark:text-gray-400 hover:bg-slate-700/50 dark:hover:bg-gray-700/50 hover:text-white transition-colors cursor-pointer">
                      <ItemIcon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}