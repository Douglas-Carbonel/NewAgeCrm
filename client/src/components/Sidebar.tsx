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
  Settings,
  Clock,
  CreditCard,
  CheckCircle,
  Calendar,
  Building2,
  DollarSign,
  BarChart3,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

interface SubMenuItem {
  name: string;
  href: string;
  icon: any;
}

interface MainMenuItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  subItems: SubMenuItem[];
}

const mainMenuItems: MainMenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    color: "bg-blue-500",
    subItems: [
      { name: "Painel", href: "/", icon: LayoutDashboard },
      { name: "Agenda", href: "/calendar", icon: Calendar }
    ]
  },
  {
    id: "clients",
    name: "Client Management",
    icon: Users,
    color: "bg-green-500",
    subItems: [
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Contratos", href: "/contracts", icon: FileText }
    ]
  },
  {
    id: "projects",
    name: "Project Management",
    icon: Building2,
    color: "bg-orange-500",
    subItems: [
      { name: "Projetos", href: "/projects", icon: FolderOpen },
      { name: "Tarefas", href: "/tasks", icon: CheckSquare },
      { name: "Controle de Horas", href: "/time-tracking", icon: Clock }
    ]
  },
  {
    id: "financial",
    name: "Financial",
    icon: DollarSign,
    color: "bg-purple-500",
    subItems: [
      { name: "Faturamento", href: "/invoicing", icon: Receipt },
      { name: "Cobrança", href: "/billing", icon: CreditCard },
      { name: "Relatórios", href: "/reports", icon: BarChart3 },
      { name: "Aprovações", href: "/approvals", icon: CheckCircle }
    ]
  }
];

export function Sidebar() {
  const [location] = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(
    // Determinar qual menu está ativo baseado na rota atual
    (() => {
      for (const menu of mainMenuItems) {
        if (menu.subItems.some(item => item.href === location)) {
          return menu.id;
        }
      }
      return null;
    })()
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMenuClick = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  const isItemActive = (href: string) => location === href;

  const getActiveMainMenu = () => {
    for (const menu of mainMenuItems) {
      if (menu.subItems.some(item => item.href === location)) {
        return menu;
      }
    }
    return null;
  };

  const activeMainMenu = getActiveMainMenu();

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <aside className="bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl flex-shrink-0 transition-all duration-300 border-r border-slate-600/50 dark:border-gray-700/50 w-20">
        <div className="p-4 border-b border-slate-700/50 dark:border-gray-700/50 flex items-center justify-center">
          {/* Logo compacto */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-2xl border border-blue-400/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl blur-xl"></div>
              <div className="w-6 h-6 relative z-10">
                <div className="absolute inset-1 bg-white/90 rounded-sm border border-blue-200/50"></div>
                <div className="absolute top-0 left-1 w-1 h-1 bg-blue-300 rounded-full"></div>
                <div className="absolute top-0 right-1 w-1 h-1 bg-blue-300 rounded-full"></div>
                <div className="absolute bottom-0 left-1 w-1 h-1 bg-blue-300 rounded-full"></div>
                <div className="absolute bottom-0 right-1 w-1 h-1 bg-blue-300 rounded-full"></div>
                <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-2">
          {mainMenuItems.map((menu) => {
            const isMenuActive = menu.id === activeMenu || (activeMainMenu && activeMainMenu.id === menu.id);
            const MenuIcon = menu.icon;

            return (
              <button
                key={menu.id}
                onClick={() => handleMenuClick(menu.id)}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer group relative hover:scale-105",
                  isMenuActive
                    ? `${menu.color} text-white shadow-lg`
                    : "text-slate-300 dark:text-gray-400 hover:bg-slate-600/50 dark:hover:bg-gray-700/50 hover:text-white"
                )}
                title={menu.name}
              >
                <MenuIcon className="w-6 h-6" />

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-slate-600 dark:border-gray-600 shadow-xl">
                  {menu.name}
                </div>

                {/* Indicador de menu ativo */}
                {isMenuActive && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings no final */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Link href="/settings">
            <button
              className={cn(
                "flex items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer group hover:scale-105",
                isItemActive("/settings")
                  ? "bg-gradient-to-r from-slate-600 to-blue-500 text-white shadow-lg"
                  : "text-slate-300 dark:text-gray-400 hover:bg-slate-600/50 dark:hover:bg-gray-700/50 hover:text-white"
              )}
              title="Configurações"
            >
              <Settings className="w-5 h-5" />

              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-slate-600 dark:border-gray-600 shadow-xl">
                Configurações
              </div>
            </button>
          </Link>
        </div>
      </aside>

      {/* Submenu Sidebar */}
      {activeMenu && (
        <aside className="bg-white dark:bg-gray-900 shadow-lg flex-shrink-0 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 w-64">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {(() => {
                const menu = mainMenuItems.find(m => m.id === activeMenu);
                const MenuIcon = menu?.icon;
                return (
                  <>
                    <div className={`w-8 h-8 ${menu?.color} rounded-lg flex items-center justify-center`}>
                      <MenuIcon className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {menu?.name}
                    </h2>
                  </>
                );
              })()}
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {(() => {
              const menu = mainMenuItems.find(m => m.id === activeMenu);
              return menu?.subItems.map((item) => {
                const isItemActiveState = isItemActive(item.href);
                const ItemIcon = item.icon;

                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]",
                        isItemActiveState
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-l-4 border-blue-500"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <ItemIcon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              });
            })()}
          </nav>
        </aside>
      )}
    </div>
  );
}