import { storage } from "./storage";

export interface Notification {
  id: string;
  type: 'task_due' | 'contract_expiring' | 'project_overdue' | 'invoice_due';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  read: boolean;
  entityId: number;
  entityType: string;
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private notificationId = 1;

  async generateNotifications(): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const now = new Date();
    
    // Check for tasks due soon
    const tasks = await storage.getTasks();
    tasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff <= 3 && daysDiff >= 0 && task.status !== 'completed') {
          const priority = daysDiff <= 1 ? 'high' : daysDiff <= 2 ? 'medium' : 'low';
          notifications.push({
            id: `task_${task.id}_${Date.now()}`,
            type: 'task_due',
            title: 'Tarefa com prazo próximo',
            message: `"${task.title}" vence em ${daysDiff} dia${daysDiff === 1 ? '' : 's'}`,
            priority,
            date: now.toISOString(),
            read: false,
            entityId: task.id,
            entityType: 'task'
          });
        }
      }
    });

    // Check for expiring contracts
    const contracts = await storage.getContracts();
    contracts.forEach(contract => {
      if (contract.endDate && contract.status === 'active') {
        const endDate = new Date(contract.endDate);
        const daysDiff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff <= 30 && daysDiff >= 0) {
          const priority = daysDiff <= 7 ? 'high' : daysDiff <= 15 ? 'medium' : 'low';
          notifications.push({
            id: `contract_${contract.id}_${Date.now()}`,
            type: 'contract_expiring',
            title: 'Contrato expirando',
            message: `Contrato "${contract.name}" expira em ${daysDiff} dia${daysDiff === 1 ? '' : 's'}`,
            priority,
            date: now.toISOString(),
            read: false,
            entityId: contract.id,
            entityType: 'contract'
          });
        }
      }
    });

    // Check for overdue projects
    const projects = await storage.getProjects();
    projects.forEach(project => {
      if (project.deadline && project.status !== 'completed') {
        const deadline = new Date(project.deadline);
        const daysDiff = Math.ceil((now.getTime() - deadline.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff > 0) {
          notifications.push({
            id: `project_${project.id}_${Date.now()}`,
            type: 'project_overdue',
            title: 'Projeto em atraso',
            message: `Projeto "${project.name}" está atrasado há ${daysDiff} dia${daysDiff === 1 ? '' : 's'}`,
            priority: 'high',
            date: now.toISOString(),
            read: false,
            entityId: project.id,
            entityType: 'project'
          });
        }
      }
    });

    // Check for overdue invoices
    const invoices = await storage.getInvoices();
    invoices.forEach(invoice => {
      if (invoice.dueDate && invoice.status === 'pending') {
        const dueDate = new Date(invoice.dueDate);
        const daysDiff = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff > 0) {
          const priority = daysDiff <= 7 ? 'medium' : 'high';
          notifications.push({
            id: `invoice_${invoice.id}_${Date.now()}`,
            type: 'invoice_due',
            title: 'Fatura em atraso',
            message: `Fatura ${invoice.invoiceNumber} está vencida há ${daysDiff} dia${daysDiff === 1 ? '' : 's'}`,
            priority,
            date: now.toISOString(),
            read: false,
            entityId: invoice.id,
            entityType: 'invoice'
          });
        }
      }
    });

    // Store notifications
    notifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });

    return notifications.sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  async getNotifications(): Promise<Notification[]> {
    return this.generateNotifications();
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set(notificationId, notification);
      return true;
    }
    return false;
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }
}

export const notificationService = new NotificationService();