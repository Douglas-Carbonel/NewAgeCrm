import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Clients from "@/pages/Clients";
import Contracts from "@/pages/Contracts";
import Tasks from "@/pages/Tasks";
import Invoicing from "@/pages/Invoicing";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import TimeTracking from "@/pages/TimeTracking";

function Router() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/projects" component={Projects} />
        <Route path="/clients" component={Clients} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/invoicing" component={Invoicing} />
        <Route path="/reports" component={Reports} />
        <Route path="/time-tracking" component={TimeTracking} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
