import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{title}</h2>
          {subtitle && (
            <p className="text-slate-600 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar projetos, clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-white/70 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
            />
          </div>
          <NotificationCenter />
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 via-slate-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border border-slate-300/20">
              <span className="text-white font-bold text-xs brand-logo">DC</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">DEV CONTROL Admin</p>
              <p className="text-sm text-slate-600 brand-subtitle">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
