import { storage } from './storage.js';

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

interface TaskEfficiencyData {
  week: string;
  completed: number;
  created: number;
  efficiency: number;
}

interface ClientPerformanceData {
  client: string;
  projectsCompleted: number;
  totalRevenue: number;
  averageProjectDuration: number;
}

interface AdvancedReportData {
  revenueChart: RevenueData[];
  projectStatusChart: ProjectStatusData[];
  taskEfficiencyChart: TaskEfficiencyData[];
  clientPerformance: ClientPerformanceData[];
  kpis: {
    averageProjectDuration: number;
    clientRetentionRate: number;
    profitMargin: number;
    taskCompletionRate: number;
    invoiceCollectionTime: number;
  };
}

class ReportsService {
  async generateAdvancedReport(): Promise<AdvancedReportData> {
    const [projects, tasks, invoices, clients] = await Promise.all([
      storage.getProjects(),
      storage.getTasks(),
      storage.getInvoices(),
      storage.getClients()
    ]);

    // Generate revenue chart data (last 6 months)
    const revenueChart = this.generateRevenueChart(invoices);
    
    // Generate project status chart
    const projectStatusChart = this.generateProjectStatusChart(projects);
    
    // Generate task efficiency chart
    const taskEfficiencyChart = this.generateTaskEfficiencyChart(tasks);
    
    // Generate client performance data
    const clientPerformance = this.generateClientPerformance(projects, invoices, clients);
    
    // Calculate KPIs
    const kpis = this.calculateKPIs(projects, tasks, invoices, clients);

    return {
      revenueChart,
      projectStatusChart,
      taskEfficiencyChart,
      clientPerformance,
      kpis
    };
  }

  private generateRevenueChart(invoices: any[]): RevenueData[] {
    const months = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      // Calculate revenue for this month
      const monthRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear() &&
                 invoice.status === 'paid';
        })
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

      // Set target as 20% above current revenue or minimum 10000
      const target = Math.max(monthRevenue * 1.2, 10000);

      months.push({
        month: monthName,
        revenue: monthRevenue,
        target: target
      });
    }

    return months;
  }

  private generateProjectStatusChart(projects: any[]): ProjectStatusData[] {
    const statusColors = {
      planning: '#3b82f6',     // blue
      in_progress: '#10b981',  // green
      completed: '#6b7280',    // gray
      on_hold: '#f59e0b'       // yellow
    };

    const statusCounts = {
      planning: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0
    };

    projects.forEach(project => {
      if (statusCounts.hasOwnProperty(project.status)) {
        statusCounts[project.status as keyof typeof statusCounts]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status === 'in_progress' ? 'Em Andamento' : 
            status === 'planning' ? 'Planejamento' :
            status === 'completed' ? 'Concluído' : 'Em Espera',
      value: count,
      color: statusColors[status as keyof typeof statusColors]
    }));
  }

  private generateTaskEfficiencyChart(tasks: any[]): TaskEfficiencyData[] {
    const weeks = [];
    const now = new Date();
    
    // Generate last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      
      const weekLabel = `Sem ${8 - i}`;
      
      const tasksInWeek = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      const completedInWeek = tasksInWeek.filter(task => task.status === 'completed').length;
      const createdInWeek = tasksInWeek.length;
      const efficiency = createdInWeek > 0 ? Math.round((completedInWeek / createdInWeek) * 100) : 0;

      weeks.push({
        week: weekLabel,
        completed: completedInWeek,
        created: createdInWeek,
        efficiency: efficiency
      });
    }

    return weeks;
  }

  private generateClientPerformance(projects: any[], invoices: any[], clients: any[]): ClientPerformanceData[] {
    return clients.map(client => {
      const clientProjects = projects.filter(p => p.clientId === client.id);
      const completedProjects = clientProjects.filter(p => p.status === 'completed');
      const clientInvoices = invoices.filter(i => i.clientId === client.id && i.status === 'paid');
      
      const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
      
      // Calculate average project duration
      let averageDuration = 0;
      if (completedProjects.length > 0) {
        const totalDuration = completedProjects.reduce((sum, project) => {
          const start = new Date(project.createdAt);
          const end = project.deadline ? new Date(project.deadline) : new Date();
          return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        averageDuration = Math.round(totalDuration / completedProjects.length);
      }

      return {
        client: client.company || client.name,
        projectsCompleted: completedProjects.length,
        totalRevenue: totalRevenue,
        averageProjectDuration: averageDuration
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private calculateKPIs(projects: any[], tasks: any[], invoices: any[], clients: any[]) {
    // Average project duration
    const completedProjects = projects.filter(p => p.status === 'completed');
    let averageProjectDuration = 0;
    if (completedProjects.length > 0) {
      const totalDuration = completedProjects.reduce((sum, project) => {
        const start = new Date(project.createdAt);
        const end = project.deadline ? new Date(project.deadline) : new Date();
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      averageProjectDuration = Math.round(totalDuration / completedProjects.length);
    }

    // Client retention rate (clients with more than 1 project)
    const clientProjectCounts = clients.map(client => 
      projects.filter(p => p.clientId === client.id).length
    );
    const returningClients = clientProjectCounts.filter(count => count > 1).length;
    const clientRetentionRate = clients.length > 0 ? Math.round((returningClients / clients.length) * 100) : 0;

    // Task completion rate
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return {
      averageProjectDuration,
      clientRetentionRate,
      profitMargin: 75, // Placeholder - would need cost data
      taskCompletionRate,
      invoiceCollectionTime: 15 // Placeholder - average days to collect
    };
  }
}

export const reportsService = new ReportsService();