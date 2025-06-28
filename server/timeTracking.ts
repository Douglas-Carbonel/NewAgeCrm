import { storage } from './storage.js';

interface TimeEntry {
  id: number;
  projectId: number;
  taskId?: number;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  hourlyRate: number;
  totalCost: number;
  isActive: boolean;
  createdAt: string;
}

interface TimeTrackingStats {
  totalHours: number;
  totalRevenue: number;
  averageHourlyRate: number;
  topProject: string;
  efficiency: number;
}

interface ProjectTimeStats {
  projectId: number;
  projectName: string;
  totalHours: number;
  totalCost: number;
  taskBreakdown: Array<{
    taskId: number;
    taskName: string;
    hours: number;
    cost: number;
  }>;
}

class TimeTrackingService {
  private timeEntries: Map<number, TimeEntry> = new Map();
  private currentEntryId = 1;
  private defaultHourlyRate = 85; // R$ 85/hour

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add some sample time entries
    const sampleEntries: Omit<TimeEntry, 'id'>[] = [
      {
        projectId: 1,
        taskId: 1,
        description: "Desenvolvimento da interface de login",
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        duration: 90,
        hourlyRate: this.defaultHourlyRate,
        totalCost: 127.50,
        isActive: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        projectId: 1,
        taskId: 2,
        description: "Configuração do banco de dados",
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        hourlyRate: this.defaultHourlyRate,
        totalCost: 85.00,
        isActive: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    sampleEntries.forEach(entry => {
      const timeEntry: TimeEntry = { ...entry, id: this.currentEntryId++ };
      this.timeEntries.set(timeEntry.id, timeEntry);
    });
  }

  async startTimer(data: { projectId: number; taskId?: number; description: string }): Promise<TimeEntry> {
    // Stop any active timers first
    await this.stopAllActiveTimers();

    const entry: TimeEntry = {
      id: this.currentEntryId++,
      projectId: data.projectId,
      taskId: data.taskId,
      description: data.description,
      startTime: new Date().toISOString(),
      duration: 0,
      hourlyRate: this.defaultHourlyRate,
      totalCost: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.timeEntries.set(entry.id, entry);
    return entry;
  }

  async stopTimer(entryId: number): Promise<TimeEntry | null> {
    const entry = this.timeEntries.get(entryId);
    if (!entry || !entry.isActive) return null;

    const endTime = new Date().toISOString();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(entry.startTime).getTime()) / 1000 / 60);
    const totalCost = (duration / 60) * entry.hourlyRate;

    const updatedEntry: TimeEntry = {
      ...entry,
      endTime,
      duration,
      totalCost,
      isActive: false
    };

    this.timeEntries.set(entryId, updatedEntry);
    return updatedEntry;
  }

  async stopAllActiveTimers(): Promise<void> {
    for (const [id, entry] of this.timeEntries) {
      if (entry.isActive) {
        await this.stopTimer(id);
      }
    }
  }

  async getTimeEntries(projectId?: number): Promise<TimeEntry[]> {
    const entries = Array.from(this.timeEntries.values());
    
    if (projectId) {
      return entries.filter(entry => entry.projectId === projectId);
    }
    
    return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveTimer(): Promise<TimeEntry | null> {
    for (const entry of this.timeEntries.values()) {
      if (entry.isActive) return entry;
    }
    return null;
  }

  async deleteTimeEntry(entryId: number): Promise<boolean> {
    return this.timeEntries.delete(entryId);
  }

  async updateTimeEntry(entryId: number, updates: Partial<Omit<TimeEntry, 'id'>>): Promise<TimeEntry | null> {
    const entry = this.timeEntries.get(entryId);
    if (!entry) return null;

    const updatedEntry = { ...entry, ...updates };
    
    // Recalculate total cost if duration or hourly rate changed
    if (updates.duration !== undefined || updates.hourlyRate !== undefined) {
      updatedEntry.totalCost = (updatedEntry.duration / 60) * updatedEntry.hourlyRate;
    }

    this.timeEntries.set(entryId, updatedEntry);
    return updatedEntry;
  }

  async getTimeTrackingStats(dateRange?: { start: string; end: string }): Promise<TimeTrackingStats> {
    let entries = Array.from(this.timeEntries.values()).filter(entry => !entry.isActive);

    if (dateRange) {
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= new Date(dateRange.start) && entryDate <= new Date(dateRange.end);
      });
    }

    const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const totalRevenue = entries.reduce((sum, entry) => sum + entry.totalCost, 0);
    const averageHourlyRate = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.hourlyRate, 0) / entries.length 
      : 0;

    // Find top project by hours
    const projectHours = new Map<number, number>();
    entries.forEach(entry => {
      const current = projectHours.get(entry.projectId) || 0;
      projectHours.set(entry.projectId, current + entry.duration);
    });

    let topProjectId = 0;
    let maxHours = 0;
    for (const [projectId, hours] of projectHours) {
      if (hours > maxHours) {
        maxHours = hours;
        topProjectId = projectId;
      }
    }

    const projects = await storage.getProjects();
    const topProject = projects.find(p => p.id === topProjectId)?.name || "Nenhum";

    // Calculate efficiency (entries with tasks vs without tasks)
    const entriesWithTasks = entries.filter(entry => entry.taskId).length;
    const efficiency = entries.length > 0 ? Math.round((entriesWithTasks / entries.length) * 100) : 0;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageHourlyRate: Math.round(averageHourlyRate * 100) / 100,
      topProject,
      efficiency
    };
  }

  async getProjectTimeStats(): Promise<ProjectTimeStats[]> {
    const entries = Array.from(this.timeEntries.values()).filter(entry => !entry.isActive);
    const projects = await storage.getProjects();
    const tasks = await storage.getTasks();

    const projectStats = new Map<number, ProjectTimeStats>();

    entries.forEach(entry => {
      const project = projects.find(p => p.id === entry.projectId);
      if (!project) return;

      if (!projectStats.has(entry.projectId)) {
        projectStats.set(entry.projectId, {
          projectId: entry.projectId,
          projectName: project.name,
          totalHours: 0,
          totalCost: 0,
          taskBreakdown: []
        });
      }

      const stats = projectStats.get(entry.projectId)!;
      stats.totalHours += entry.duration / 60;
      stats.totalCost += entry.totalCost;

      // Update task breakdown
      if (entry.taskId) {
        const task = tasks.find(t => t.id === entry.taskId);
        if (task) {
          let taskBreakdown = stats.taskBreakdown.find(tb => tb.taskId === entry.taskId);
          if (!taskBreakdown) {
            taskBreakdown = {
              taskId: entry.taskId,
              taskName: task.title,
              hours: 0,
              cost: 0
            };
            stats.taskBreakdown.push(taskBreakdown);
          }
          taskBreakdown.hours += entry.duration / 60;
          taskBreakdown.cost += entry.totalCost;
        }
      }
    });

    return Array.from(projectStats.values())
      .map(stats => ({
        ...stats,
        totalHours: Math.round(stats.totalHours * 100) / 100,
        totalCost: Math.round(stats.totalCost * 100) / 100,
        taskBreakdown: stats.taskBreakdown.map(tb => ({
          ...tb,
          hours: Math.round(tb.hours * 100) / 100,
          cost: Math.round(tb.cost * 100) / 100
        }))
      }))
      .sort((a, b) => b.totalHours - a.totalHours);
  }

  async generateTimesheet(projectId?: number, dateRange?: { start: string; end: string }): Promise<{
    entries: TimeEntry[];
    summary: {
      totalHours: number;
      totalCost: number;
      entriesCount: number;
    };
  }> {
    let entries = await this.getTimeEntries(projectId);

    if (dateRange) {
      entries = entries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= new Date(dateRange.start) && entryDate <= new Date(dateRange.end);
      });
    }

    const summary = {
      totalHours: Math.round(entries.reduce((sum, entry) => sum + entry.duration, 0) / 60 * 100) / 100,
      totalCost: Math.round(entries.reduce((sum, entry) => sum + entry.totalCost, 0) * 100) / 100,
      entriesCount: entries.length
    };

    return { entries, summary };
  }
}

export const timeTrackingService = new TimeTrackingService();