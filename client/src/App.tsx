import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Contracts from "@/pages/Contracts";
import Tasks from "@/pages/Tasks";
import Invoicing from "@/pages/Invoicing";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import TimeTracking from "@/pages/TimeTracking";
import Billing from "@/pages/Billing";
import Approvals from "@/pages/Approvals";
import Calendar from "@/pages/Calendar";

// Novas páginas da reestruturação
import ProposalsPage from "@/pages/ProposalsPage";
import ProposalEditorPage from "@/pages/ProposalEditorPage";
import ServicesPage from "@/pages/ServicesPage";
import ClientPortalPage from "@/pages/ClientPortalPage";
import TimesheetsPage from "@/pages/TimesheetsPage";
import ResourcingPage from "@/pages/ResourcingPage";
import PaymentsPage from "@/pages/PaymentsPage";
import RevenuePage from "@/pages/RevenuePage";
import ExpensesPage from "@/pages/ExpensesPage";

function Router() {
  return (
    <div className="min-h-screen flex w-full">
      <Switch>
        {/* Editor de Propostas - Página isolada sem sidebar */}
        <Route path="/proposals/editor/:id?" component={ProposalEditorPage} />

        {/* Todas as outras páginas com sidebar */}
        <Route>
          <div className="min-h-screen flex w-full">
            <Sidebar />
            <main className="flex-1 w-full min-w-0">
              <Switch>
                <Route path="/" component={Dashboard} />

                {/* Gestão de Clientes */}
                <Route path="/clients" component={Clients} />
                <Route path="/clients/:id" component={ClientDetail} />
                <Route path="/proposals" component={ProposalsPage} />
                <Route path="/contracts" component={Contracts} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/services" component={ServicesPage} />
                <Route path="/client-portal" component={ClientPortalPage} />

                {/* Gestão de Projetos */}
                <Route path="/projects" component={Projects} />
                <Route path="/tasks" component={Tasks} />
                <Route path="/time-tracking" component={TimeTracking} />
                <Route path="/timesheets" component={TimesheetsPage} />
                <Route path="/resourcing" component={ResourcingPage} />

                {/* Financeiro */}
                <Route path="/invoicing" component={Invoicing} />
                <Route path="/payments" component={PaymentsPage} />
                <Route path="/revenue" component={RevenuePage} />
                <Route path="/expenses" component={ExpensesPage} />

                {/* Outras páginas */}
                <Route path="/reports" component={Reports} />
                <Route path="/billing" component={Billing} />
                <Route path="/approvals" component={Approvals} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;