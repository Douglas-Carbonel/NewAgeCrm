import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, insertProjectSchema, insertTaskSchema,
  insertContractSchema, insertInvoiceSchema 
} from "@shared/schema";
import { z } from "zod";
import { notificationService } from "./notifications";
import { automationService } from "./automation";
import { reportsService } from "./reports";
import { timeTrackingService } from "./timeTracking";
import { billingService } from "./billing";
import { approvalsService } from "./approvals";
import { calendarService } from "./calendar";
import { clients, clientContacts, projects, tasks, contracts, invoices, approvals, calendarEvents } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await notificationService.getNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await notificationService.markAsRead(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Notification not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      await notificationService.markAllAsRead();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Automation routes
  app.post("/api/automation/settings", async (req, res) => {
    try {
      await automationService.updateSettings(req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/automation/settings", async (req, res) => {
    try {
      const settings = await automationService.getSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automation/test-notification", async (req, res) => {
    try {
      const success = await automationService.sendTestNotification();
      if (success) {
        res.json({ success: true, message: "Test notification sent" });
      } else {
        res.status(500).json({ error: "Failed to send test notification" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/automation/alerts", async (req, res) => {
    try {
      const alerts = await automationService.generateDashboardAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await db.select({
        id: clientContacts.id,
        name: clientContacts.name,
        email: clientContacts.email,
        phone: clientContacts.phone,
        position: clientContacts.position,
        isPrimary: clientContacts.isPrimary,
        clientId: clientContacts.clientId,
        createdAt: clientContacts.createdAt,
        clientName: clients.name,
        clientCompany: clients.company
      })
      .from(clientContacts)
      .leftJoin(clients, eq(clientContacts.clientId, clients.id))
      .orderBy(clientContacts.createdAt);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await db.select({
        id: clientContacts.id,
        name: clientContacts.name,
        email: clientContacts.email,
        phone: clientContacts.phone,
        position: clientContacts.position,
        isPrimary: clientContacts.isPrimary,
        clientId: clientContacts.clientId,
        createdAt: clientContacts.createdAt,
        clientName: clients.name,
        clientCompany: clients.company
      })
      .from(clientContacts)
      .leftJoin(clients, eq(clientContacts.clientId, clients.id))
      .where(eq(clientContacts.id, id))
      .limit(1);
      
      if (contact.length === 0) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact[0]);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = req.body;
      const result = await db.insert(clientContacts).values(contactData).returning();
      res.json(result[0]);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contactData = req.body;
      const result = await db.update(clientContacts).set(contactData).where(eq(clientContacts.id, id)).returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await db.delete(clientContacts).where(eq(clientContacts.id, id)).returning();
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Create client
  app.post("/api/clients", async (req, res) => {
    try {
      const { contacts, ...clientData } = req.body;
      const clientResult = await db.insert(clients).values(clientData).returning();
      const newClient = clientResult[0];

      if (contacts && contacts.length > 0) {
        const contactsData = contacts.map((contact: any) => ({
          ...contact,
          clientId: newClient.id,
        }));
        await db.insert(clientContacts).values(contactsData);
      }

      res.json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Update client
  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { contacts, ...clientData } = req.body;
      const result = await db.update(clients).set(clientData).where(eq(clients.id, id)).returning();

      if (contacts) {
        // Delete existing contacts
        await db.delete(clientContacts).where(eq(clientContacts.clientId, id));

        // Insert new contacts
        if (contacts.length > 0) {
          const contactsData = contacts.map((contact: any) => ({
            ...contact,
            clientId: id,
          }));
          await db.insert(clientContacts).values(contactsData);
        }
      }

      res.json(result[0]);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, data);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const tasks = await storage.getTasksByProject(projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, data);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Contracts routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const data = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(data);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.put("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertContractSchema.partial().parse(req.body);
      const contract = await storage.updateContract(id, data);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContract(id);
      if (!success) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Invoices routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const data = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(data);
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(id, data);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInvoice(id);
      if (!success) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Advanced Reports
  app.get("/api/reports/advanced", async (req, res) => {
    try {
      const reportData = await reportsService.generateAdvancedReport();
      res.json(reportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate advanced report" });
    }
  });

  // Time Tracking Routes
  app.get("/api/time-entries", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const entries = await timeTrackingService.getTimeEntries(projectId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.post("/api/time-entries", async (req, res) => {
    try {
      const { projectId, taskId, description } = req.body;
      const entry = await timeTrackingService.startTimer({ projectId, taskId, description });
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to start timer" });
    }
  });

  app.patch("/api/time-entries/:id/stop", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await timeTrackingService.stopTimer(id);
      if (!entry) {
        return res.status(404).json({ message: "Time entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop timer" });
    }
  });

  app.get("/api/time-entries/active", async (req, res) => {
    try {
      const activeTimer = await timeTrackingService.getActiveTimer();
      res.json(activeTimer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active timer" });
    }
  });

  app.delete("/api/time-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await timeTrackingService.deleteTimeEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Time entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete time entry" });
    }
  });

  app.patch("/api/time-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const entry = await timeTrackingService.updateTimeEntry(id, updates);
      if (!entry) {
        return res.status(404).json({ message: "Time entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update time entry" });
    }
  });

  app.get("/api/time-tracking/stats", async (req, res) => {
    try {
      const dateRange = req.query.start && req.query.end 
        ? { start: req.query.start as string, end: req.query.end as string }
        : undefined;
      const stats = await timeTrackingService.getTimeTrackingStats(dateRange);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time tracking stats" });
    }
  });

  app.get("/api/time-tracking/project-stats", async (req, res) => {
    try {
      const projectStats = await timeTrackingService.getProjectTimeStats();
      res.json(projectStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project time stats" });
    }
  });

  app.get("/api/time-tracking/timesheet", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const dateRange = req.query.start && req.query.end 
        ? { start: req.query.start as string, end: req.query.end as string }
        : undefined;
      const timesheet = await timeTrackingService.generateTimesheet(projectId, dateRange);
      res.json(timesheet);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate timesheet" });
    }
  });

  // Billing Service Routes
  app.get("/api/billing/settings", async (req, res) => {
    try {
      const settings = await billingService.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing settings" });
    }
  });

  app.put("/api/billing/settings", async (req, res) => {
    try {
      const settings = await billingService.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update billing settings" });
    }
  });

  app.post("/api/billing/generate-invoice", async (req, res) => {
    try {
      const { projectId, timeEntryIds } = req.body;
      const result = await billingService.generateInvoiceFromTimeEntries(projectId, timeEntryIds);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate invoice" });
    }
  });

  app.get("/api/billing/unbilled-entries", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const entries = await billingService.getUnbilledTimeEntries(projectId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unbilled entries" });
    }
  });

  app.get("/api/billing/stats", async (req, res) => {
    try {
      const stats = await billingService.getBillingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing stats" });
    }
  });

  app.post("/api/billing/run-automatic", async (req, res) => {
    try {
      const result = await billingService.runAutomaticBilling();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to run automatic billing" });
    }
  });

  // Approvals Service Routes
  app.get("/api/approvals", async (req, res) => {
    try {
      const status = req.query.status as string;
      const approvals = await approvalsService.getApprovals(status);
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch approvals" });
    }
  });

  app.post("/api/approvals", async (req, res) => {
    try {
      const approval = await approvalsService.createApprovalRequest(req.body);
      res.status(201).json(approval);
    } catch (error) {
      res.status(500).json({ message: "Failed to create approval request" });
    }
  });

  app.post("/api/approvals/:id/process", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { decision, approver, comments } = req.body;
      const approval = await approvalsService.processApproval(id, decision, approver, comments);
      res.json(approval);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to process approval" });
    }
  });

  app.get("/api/approvals/stats", async (req, res) => {
    try {
      const stats = await approvalsService.getApprovalStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch approval stats" });
    }
  });

  app.get("/api/approvals/pending-count", async (req, res) => {
    try {
      const count = await approvalsService.getPendingApprovalsCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending approvals count" });
    }
  });

  // Calendar Service Routes
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const startDate = req.query.start as string;
      const endDate = req.query.end as string;
      const events = await calendarService.getEvents(startDate, endDate);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar/events", async (req, res) => {
    try {
      const event = await calendarService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create event" });
    }
  });

  app.get("/api/calendar/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await calendarService.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.put("/api/calendar/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await calendarService.updateEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/calendar/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await calendarService.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.get("/api/calendar/view", async (req, res) => {
    try {
      const startDate = req.query.start as string;
      const endDate = req.query.end as string;
      const view = await calendarService.getCalendarView(startDate, endDate);
      res.json(view);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar view" });
    }
  });

  app.get("/api/calendar/upcoming", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const events = await calendarService.getUpcomingEvents(days);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/calendar/stats", async (req, res) => {
    try {
      const stats = await calendarService.getCalendarStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar stats" });
    }
  });

  app.post("/api/calendar/create-from-entity", async (req, res) => {
    try {
      const { entityType, entityId, eventType, customTitle } = req.body;
      const event = await calendarService.createEventFromEntity(entityType, entityId, eventType, customTitle);
      if (!event) {
        return res.status(400).json({ message: "Failed to create event from entity" });
      }
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to create event from entity" });
    }
  });

  // Time Tracking routes
  app.post("/api/time-tracking/start", async (req, res) => {
    try {
      const { projectId, taskId, description } = req.body;
      const entry = await timeTrackingService.startTimer({ projectId, taskId, description });
      res.json(entry);
    } catch (error) {
      console.error('Error starting timer:', error);
      res.status(500).json({ error: 'Failed to start timer' });
    }
  });

  app.post("/api/time-tracking/stop/:entryId", async (req, res) => {
    try {
      const entryId = parseInt(req.params.entryId);
      const entry = await timeTrackingService.stopTimer(entryId);
      res.json(entry);
    } catch (error) {
      console.error('Error stopping timer:', error);
      res.status(500).json({ error: 'Failed to stop timer' });
    }
  });

  app.get("/api/time-tracking/active", async (req, res) => {
    try {
      const activeTimer = await timeTrackingService.getActiveTimer();
      res.json(activeTimer);
    } catch (error) {
      console.error('Error getting active timer:', error);
      res.status(500).json({ error: 'Failed to get active timer' });
    }
  });

  app.get("/api/time-tracking/entries", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const entries = await timeTrackingService.getTimeEntries(projectId);
      res.json(entries);
    } catch (error) {
      console.error('Error getting time entries:', error);
      res.status(500).json({ error: 'Failed to get time entries' });
    }
  });

  app.put("/api/time-tracking/entries/:entryId", async (req, res) => {
    try {
      const entryId = parseInt(req.params.entryId);
      const updates = req.body;
      const entry = await timeTrackingService.updateTimeEntry(entryId, updates);
      res.json(entry);
    } catch (error) {
      console.error('Error updating time entry:', error);
      res.status(500).json({ error: 'Failed to update time entry' });
    }
  });

  app.delete("/api/time-tracking/entries/:entryId", async (req, res) => {
    try {
      const entryId = parseInt(req.params.entryId);
      const deleted = await timeTrackingService.deleteTimeEntry(entryId);
      res.json({ success: deleted });
    } catch (error) {
      console.error('Error deleting time entry:', error);
      res.status(500).json({ error: 'Failed to delete time entry' });
    }
  });

  app.get("/api/time-tracking/stats", async (req, res) => {
    try {
      const { dateRange } = req.query;
      let range;

      if (dateRange) {
        const now = new Date();
        switch (dateRange) {
          case 'today':
            range = {
              start: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
              end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
            };
            break;
          case 'this_week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            range = {
              start: startOfWeek.toISOString(),
              end: now.toISOString()
            };
            break;
          case 'this_month':
            range = {
              start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
              end: now.toISOString()
            };
            break;
          case 'last_30_days':
            range = {
              start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              end: now.toISOString()
            };
            break;
        }
      }

      const stats = await timeTrackingService.getTimeTrackingStats(range);
      res.json(stats);
    } catch (error) {
      console.error('Error getting time tracking stats:', error);
      res.status(500).json({ error: 'Failed to get time tracking stats' });
    }
  });

  app.get("/api/time-tracking/project-stats", async (req, res) => {
    try {
      const stats = await timeTrackingService.getProjectTimeStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting project time stats:', error);
      res.status(500).json({ error: 'Failed to get project time stats' });
    }
  });

  app.get("/api/time-tracking/timesheet", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const { start, end } = req.query;

      let dateRange;
      if (start && end) {
        dateRange = { start: start as string, end: end as string };
      }

      const timesheet = await timeTrackingService.generateTimesheet(projectId, dateRange);
      res.json(timesheet);
    } catch (error) {
      console.error('Error generating timesheet:', error);
      res.status(500).json({ error: 'Failed to generate timesheet' });
    }
  });

  // Billing routes
  app.get("/api/billing/unbilled-entries", async (req, res) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const entries = await billingService.getUnbilledTimeEntries(projectId);
      res.json(entries);
    } catch (error) {
      console.error('Error getting unbilled entries:', error);
      res.status(500).json({ error: 'Failed to get unbilled entries' });
    }
  });

  app.get("/api/billing/stats", async (req, res) => {
    try {
      const stats = await billingService.getBillingStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting billing stats:', error);
      res.status(500).json({ error: 'Failed to get billing stats' });
    }
  });

  app.post("/api/billing/generate-invoice", async (req, res) => {
    try {
      const { projectId, timeEntryIds } = req.body;
      const invoice = await billingService.generateInvoiceFromTimeEntries(projectId, timeEntryIds);
      res.json(invoice);
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ error: 'Failed to generate invoice' });
    }
  });

  app.post("/api/billing/run-automatic", async (req, res) => {
    try {
      const result = await billingService.runAutomaticBilling();
      res.json(result);
    } catch (error) {
      console.error('Error running automatic billing:', error);
      res.status(500).json({ error: 'Failed to run automatic billing' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}