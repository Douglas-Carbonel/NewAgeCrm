
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
  ChevronLeft,
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
  subItems: SubMenuItem[];
}

const mainMenuItems: MainMenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [
      { name: "Painel", href: "/", icon: LayoutDashboard },
      { name: "Agenda", href: "/calendar", icon: Calendar }
    ]
  },
  {
    id: "clients",
    name: "Client Management",
    icon: Users,
    subItems: [
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Contratos", href: "/contracts", icon: FileText }
    ]
  },
  {
    id: "projects",
    name: "Project Management",
    icon: Building2,
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

  const handleMenuClick = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  const handleCollapseSubmenu = () => {
    setActiveMenu(null);
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
    <div className="flex h-screen">
      {/* Main Sidebar */}
      <aside className="bg-white dark:bg-gray-900 shadow-sm flex-shrink-0 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 w-20">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
          {/* Logo minimalista */}
          <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-white dark:bg-gray-900 rounded-md"></div>
          </div>
        </div>

        <nav className="p-3 space-y-2 flex-1">
          {mainMenuItems.map((menu) => {
            const isMenuActive = menu.id === activeMenu || (activeMainMenu && activeMainMenu.id === menu.id);
            const MenuIcon = menu.icon;

            return (
              <button
                key={menu.id}
                onClick={() => handleMenuClick(menu.id)}
                className={cn(
                  "w-full flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 cursor-pointer group relative",
                  isMenuActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
                title={menu.name}
              >
                <MenuIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium truncate w-full text-center">
                  {menu.name.split(' ')[0]}
                </span>

                {/* Tooltip completo */}
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {menu.name}
                </div>

                {/* Indicador de menu ativo */}
                {isMenuActive && (
                  <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings no final */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <Link href="/settings">
            <button
              className={cn(
                "w-full flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 cursor-pointer group",
                isItemActive("/settings")
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
              title="Configurações"
            >
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Config</span>

              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                Configurações
              </div>
            </button>
          </Link>
        </div>
      </aside>

      {/* Submenu Sidebar */}
      {activeMenu && (
        <aside className="bg-white dark:bg-gray-900 shadow-lg flex-shrink-0 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 w-72">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const menu = mainMenuItems.find(m => m.id === activeMenu);
                  const MenuIcon = menu?.icon;
                  return (
                    <>
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <MenuIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {menu?.name}
                      </h2>
                    </>
                  );
                })()}
              </div>
              
              {/* Botão para recolher sidebar */}
              <button
                onClick={handleCollapseSubmenu}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                title="Recolher menu"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
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
                        "flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 cursor-pointer group",
                        isItemActiveState
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                        isItemActiveState
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      )}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                      
                      {/* Indicador ativo */}
                      {isItemActiveState && (
                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
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
