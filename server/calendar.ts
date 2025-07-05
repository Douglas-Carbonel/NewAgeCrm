import { storage } from "./storage";
import type { CalendarEvent, InsertCalendarEvent, CalendarEventWithDetails } from "@shared/schema";

interface CalendarStats {
  totalEvents: number;
  upcomingEvents: number;
  overdueEvents: number;
  eventsThisWeek: number;
  eventsByType: {
    meeting: number;
    deadline: number;
    reminder: number;
    milestone: number;
  };
  nextUpcoming: Array<{
    title: string;
    date: string;
    type: string;
    priority: string;
  }>;
}

interface ConflictCheck {
  hasConflict: boolean;
  conflictingEvents: CalendarEvent[];
}

class CalendarService {
  private events: Map<number, CalendarEvent> = new Map();
  private currentEventId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleEvents = [
      {
        title: "Project Kickoff Meeting",
        description: "Initial meeting with client to discuss project requirements",
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        allDay: false,
        type: "meeting" as const,
        entityType: "project" as const,
        entityId: 1,
        clientId: 1,
        projectId: 1,
        priority: "high" as const,
        location: "Conference Room A",
        attendees: ["client@example.com", "manager@company.com"],
        reminderMinutes: 30,
        isRecurring: false,
        recurringPattern: null
      },
      {
        title: "Project Deadline",
        description: "Final delivery deadline for website project",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        allDay: true,
        type: "deadline" as const,
        entityType: "project" as const,
        entityId: 1,
        clientId: 1,
        projectId: 1,
        priority: "high" as const,
        location: null,
        attendees: [],
        reminderMinutes: 24 * 60, // 24 hours
        isRecurring: false,
        recurringPattern: null
      }
    ];

    sampleEvents.forEach(eventData => {
      const event: CalendarEvent = {
        id: this.currentEventId++,
        ...eventData,
        createdAt: new Date()
      };
      this.events.set(event.id, event);
    });
  }

  async createEvent(eventData: InsertCalendarEvent): Promise<CalendarEvent> {
    try {
      const event: CalendarEvent = {
        id: this.currentEventId++,
        title: eventData.title,
        description: eventData.description || null,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        allDay: eventData.allDay || false,
        type: eventData.type || 'meeting',
        entityType: eventData.entityType || null,
        entityId: eventData.entityId || null,
        clientId: eventData.clientId || null,
        projectId: eventData.projectId || null,
        priority: eventData.priority || 'medium',
        location: eventData.location || null,
        attendees: eventData.attendees || [],
        reminderMinutes: eventData.reminderMinutes || null,
        isRecurring: eventData.isRecurring || false,
        recurringPattern: eventData.recurringPattern || null,
        createdAt: new Date()
      };

      // Check for conflicts if not all-day event
      if (!event.allDay) {
        const conflicts = await this.checkConflicts(event.startDate, event.endDate, event.id);
        if (conflicts.hasConflict) {
          console.warn(`Event created with ${conflicts.conflictingEvents.length} conflicts`);
        }
      }

      this.events.set(event.id, event);
      return event;
    } catch (error) {
      throw new Error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEventWithDetails[]> {
    try {
      let eventsList = Array.from(this.events.values());

      // Filter by date range if provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        eventsList = eventsList.filter(event => {
          const eventStart = new Date(event.startDate);
          return eventStart >= start && eventStart <= end;
        });
      }

      // Enrich with client and project details
      const enrichedEvents = await Promise.all(
        eventsList.map(async (event) => {
          let client = undefined;
          let project = undefined;

          if (event.clientId) {
            client = await storage.getClient(event.clientId);
          }

          if (event.projectId) {
            const projectWithClient = await storage.getProject(event.projectId);
            project = projectWithClient;
          }

          return {
            ...event,
            client,
            project
          };
        })
      );

      return enrichedEvents.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    } catch (error) {
      throw new Error(`Failed to get events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getEvent(id: number): Promise<CalendarEventWithDetails | null> {
    try {
      const event = this.events.get(id);
      if (!event) return null;

      let client = undefined;
      let project = undefined;

      if (event.clientId) {
        client = await storage.getClient(event.clientId);
      }

      if (event.projectId) {
        const projectWithClient = await storage.getProject(event.projectId);
        project = projectWithClient;
      }

      return {
        ...event,
        client,
        project
      };
    } catch (error) {
      throw new Error(`Failed to get event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const existingEvent = this.events.get(id);
      if (!existingEvent) return null;

      const updatedEvent: CalendarEvent = {
        ...existingEvent,
        ...updates
      };

      this.events.set(id, updatedEvent);
      return updatedEvent;
    } catch (error) {
      throw new Error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteEvent(id: number): Promise<boolean> {
    try {
      return this.events.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkConflicts(startDate: Date, endDate: Date, excludeEventId?: number): Promise<ConflictCheck> {
    try {
      const conflictingEvents = Array.from(this.events.values()).filter(event => {
        if (excludeEventId && event.id === excludeEventId) return false;
        if (event.allDay) return false; // Skip all-day events for conflict checking

        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        // Check for time overlap
        return (startDate < eventEnd && endDate > eventStart);
      });

      return {
        hasConflict: conflictingEvents.length > 0,
        conflictingEvents
      };
    } catch (error) {
      throw new Error(`Failed to check conflicts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCalendarStats(): Promise<CalendarStats> {
    try {
      const allEvents = Array.from(this.events.values());
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const totalEvents = allEvents.length;
      const upcomingEvents = allEvents.filter(event => new Date(event.startDate) > now).length;
      const overdueEvents = allEvents.filter(event => 
        event.type === 'deadline' && new Date(event.startDate) < now
      ).length;
      const eventsThisWeek = allEvents.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= now && eventDate <= weekFromNow;
      }).length;

      const eventsByType = {
        meeting: allEvents.filter(e => e.type === 'meeting').length,
        deadline: allEvents.filter(e => e.type === 'deadline').length,
        reminder: allEvents.filter(e => e.type === 'reminder').length,
        milestone: allEvents.filter(e => e.type === 'milestone').length
      };

      const nextUpcoming = allEvents
        .filter(event => new Date(event.startDate) > now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5)
        .map(event => ({
          title: event.title,
          date: event.startDate.toISOString(),
          type: event.type,
          priority: event.priority
        }));

      return {
        totalEvents,
        upcomingEvents,
        overdueEvents,
        eventsThisWeek,
        eventsByType,
        nextUpcoming
      };
    } catch (error) {
      throw new Error(`Failed to get calendar stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createEventFromEntity(
    entityType: string, 
    entityId: number, 
    eventType: 'meeting' | 'deadline' | 'reminder' | 'milestone',
    customTitle?: string
  ): Promise<CalendarEvent | null> {
    try {
      let title = customTitle || '';
      let clientId: number | undefined;
      let projectId: number | undefined;
      let startDate = new Date();
      let endDate = new Date();

      switch (entityType) {
        case 'project':
          const project = await storage.getProject(entityId);
          if (!project) return null;
          title = title || `${eventType === 'deadline' ? 'Project Deadline' : 'Project Meeting'}: ${project.name}`;
          clientId = project.clientId;
          projectId = project.id;
          if (project.deadline) {
            startDate = new Date(project.deadline);
            endDate = new Date(project.deadline);
          }
          break;

        case 'task':
          const task = await storage.getTask(entityId);
          if (!task) return null;
          title = title || `Task ${eventType}: ${task.title}`;
          projectId = task.projectId;
          if (task.dueDate) {
            startDate = new Date(task.dueDate);
            endDate = new Date(task.dueDate);
          }
          break;

        case 'contract':
          const contract = await storage.getContract(entityId);
          if (!contract) return null;
          title = title || `Contract ${eventType}: ${contract.name}`;
          clientId = contract.clientId;
          if (contract.endDate) {
            startDate = new Date(contract.endDate);
            endDate = new Date(contract.endDate);
          }
          break;

        default:
          return null;
      }

      const eventData: InsertCalendarEvent = {
        title,
        description: `Auto-generated ${eventType} event for ${entityType}`,
        startDate,
        endDate,
        allDay: eventType === 'deadline',
        type: eventType,
        entityType,
        entityId,
        clientId,
        projectId,
        priority: eventType === 'deadline' ? 'high' : 'medium',
        location: eventType === 'meeting' ? 'TBD' : null,
        attendees: [],
        reminderMinutes: eventType === 'deadline' ? 24 * 60 : 30,
        isRecurring: false,
        recurringPattern: null
      };

      return await this.createEvent(eventData);
    } catch (error) {
      throw new Error(`Failed to create event from entity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const calendarService = new CalendarService();