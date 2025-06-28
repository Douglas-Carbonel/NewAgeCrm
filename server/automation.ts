import { storage } from "./storage";
import { notificationService } from "./notifications";

interface AutomationSettings {
  emailNotifications: boolean;
  taskReminders: boolean;
  contractAlerts: boolean;
  invoiceReminders: boolean;
  projectDeadlines: boolean;
  reminderDays: number;
  contractExpiryDays: number;
  invoiceOverdueDays: number;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  workingHours: {
    start: string;
    end: string;
  };
}

class AutomationService {
  private settings: AutomationSettings = {
    emailNotifications: true,
    taskReminders: true,
    contractAlerts: true,
    invoiceReminders: true,
    projectDeadlines: true,
    reminderDays: 3,
    contractExpiryDays: 30,
    invoiceOverdueDays: 7,
    emailFrequency: 'daily',
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  };

  private isWithinWorkingHours(): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    return currentTime >= this.settings.workingHours.start && 
           currentTime <= this.settings.workingHours.end;
  }

  async updateSettings(newSettings: AutomationSettings): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    console.log('Automation settings updated:', this.settings);
  }

  async getSettings(): Promise<AutomationSettings> {
    return this.settings;
  }

  async runAutomatedChecks(): Promise<void> {
    if (!this.isWithinWorkingHours() && this.settings.emailFrequency !== 'immediate') {
      return;
    }

    try {
      // Generate notifications based on current settings
      const notifications = await notificationService.getNotifications();
      
      if (this.settings.emailNotifications && notifications.length > 0) {
        await this.sendEmailDigest(notifications);
      }

      console.log(`Automation check completed. Generated ${notifications.length} notifications.`);
    } catch (error) {
      console.error('Error in automated checks:', error);
    }
  }

  private async sendEmailDigest(notifications: any[]): Promise<void> {
    // Simulate email sending
    const highPriorityNotifications = notifications.filter(n => n.priority === 'high');
    const mediumPriorityNotifications = notifications.filter(n => n.priority === 'medium');
    const lowPriorityNotifications = notifications.filter(n => n.priority === 'low');

    console.log('Sending email digest:', {
      high: highPriorityNotifications.length,
      medium: mediumPriorityNotifications.length,
      low: lowPriorityNotifications.length,
      total: notifications.length
    });

    // In a real implementation, this would integrate with an email service
    // like SendGrid, Mailgun, or AWS SES
  }

  async sendTestNotification(): Promise<boolean> {
    try {
      console.log('Sending test notification email...');
      
      // Simulate test email
      const testEmail = {
        to: 'user@example.com',
        subject: 'Teste de Notificação - CRM Sistema',
        body: `
          <h2>Teste de Notificação</h2>
          <p>Este é um email de teste do sistema de automação do CRM.</p>
          <p>Se você recebeu este email, as notificações estão funcionando corretamente.</p>
          <p>Configurações atuais:</p>
          <ul>
            <li>Frequência: ${this.settings.emailFrequency}</li>
            <li>Horário de trabalho: ${this.settings.workingHours.start} - ${this.settings.workingHours.end}</li>
            <li>Lembretes de tarefas: ${this.settings.taskReminders ? 'Ativo' : 'Inativo'}</li>
          </ul>
          <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
        `
      };

      console.log('Test email would be sent:', testEmail);
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  // Schedule automated checks
  startAutomation(): void {
    // Run checks every hour
    setInterval(() => {
      this.runAutomatedChecks();
    }, 60 * 60 * 1000); // 1 hour

    // Initial check
    setTimeout(() => {
      this.runAutomatedChecks();
    }, 5000); // 5 seconds after startup

    console.log('Automation service started');
  }

  async generateDashboardAlerts(): Promise<{
    urgent: number;
    upcoming: number;
    overdue: number;
    suggestions: string[];
  }> {
    const now = new Date();
    const notifications = await notificationService.getNotifications();
    
    const urgent = notifications.filter(n => n.priority === 'high').length;
    const upcoming = notifications.filter(n => n.priority === 'medium').length;
    const overdue = notifications.filter(n => n.type === 'project_overdue' || n.type === 'invoice_due').length;

    const suggestions: string[] = [];
    
    if (urgent > 0) {
      suggestions.push(`${urgent} item${urgent > 1 ? 's' : ''} requer${urgent === 1 ? '' : 'em'} atenção imediata`);
    }
    
    if (upcoming > 3) {
      suggestions.push('Considere reorganizar as prioridades das tarefas');
    }
    
    if (overdue > 0) {
      suggestions.push('Revise os prazos dos projetos em atraso');
    }

    // Check for projects without recent activity
    const projects = await storage.getProjects();
    const inactiveProjects = projects.filter(p => 
      p.status !== 'completed' && 
      // Simulate "no recent activity" check
      Math.random() < 0.2
    );
    
    if (inactiveProjects.length > 0) {
      suggestions.push(`${inactiveProjects.length} projeto${inactiveProjects.length > 1 ? 's' : ''} sem atividade recente`);
    }

    return { urgent, upcoming, overdue, suggestions };
  }
}

export const automationService = new AutomationService();