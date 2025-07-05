import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg dark:shadow-2xl border-b border-slate-200/50 dark:border-gray-600/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">{title}</h2>
          {subtitle && (
            <p className="text-slate-600 dark:text-slate-300 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar projetos, clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-white/80 dark:bg-gray-800/80 border-slate-200 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
          <NotificationCenter />
          <ThemeToggle />
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-xl border border-blue-400/30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl blur-lg"></div>
                <span className="text-white font-black text-sm z-10 tracking-tight">DC</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full border border-white/50"></div>
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">DEV CONTROL Admin</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
