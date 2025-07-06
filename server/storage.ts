import { 
  clients, projects, tasks, contracts, invoices,
  type Client, type InsertClient,
  type Project, type InsertProject, type ProjectWithClient,
  type Task, type InsertTask, type TaskWithProject,
  type Contract, type InsertContract, type ContractWithClient,
  type Invoice, type InsertInvoice, type InvoiceWithClient
} from "@shared/schema";
import { supabase, supabaseAdmin } from "./db";

export interface IStorage {
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Projects
  getProjects(): Promise<ProjectWithClient[]>;
  getProject(id: number): Promise<ProjectWithClient | undefined>;
  getProjectsByClient(clientId: number): Promise<ProjectWithClient[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Tasks
  getTasks(): Promise<TaskWithProject[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<TaskWithProject[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Contracts
  getContracts(): Promise<ContractWithClient[]>;
  getContract(id: number): Promise<Contract | undefined>;
  getContractsByClient(clientId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;

  // Invoices
  getInvoices(): Promise<InvoiceWithClient[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByClient(clientId: number): Promise<Invoice[]>;
  getInvoicesByProject(projectId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  // Analytics
  getDashboardMetrics(): Promise<{
    activeProjects: number;
    totalClients: number;
    pendingTasks: number;
    totalRevenue: number;
  }>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client> = new Map();
  private projects: Map<number, Project> = new Map();
  private tasks: Map<number, Task> = new Map();
  private contracts: Map<number, Contract> = new Map();
  private invoices: Map<number, Invoice> = new Map();
  
  private currentClientId: number = 1;
  private currentProjectId: number = 1;
  private currentTaskId: number = 1;
  private currentContractId: number = 1;
  private currentInvoiceId: number = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample clients
    const client1: Client = {
      id: this.currentClientId++,
      name: "John Smith",
      email: "john@techstart.com",
      phone: "+1-555-0123",
      company: "TechStart Inc.",
      address: "123 Tech Street, San Francisco, CA",
      createdAt: new Date(),
    };
    
    const client2: Client = {
      id: this.currentClientId++,
      name: "Sarah Johnson",
      email: "sarah@digitalsolutions.com",
      phone: "+1-555-0456",
      company: "Digital Solutions",
      address: "456 Digital Ave, New York, NY",
      createdAt: new Date(),
    };

    this.clients.set(client1.id, client1);
    this.clients.set(client2.id, client2);
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const client: Client = {
      ...insertClient,
      id: this.currentClientId++,
      createdAt: new Date(),
    };
    this.clients.set(client.id, client);
    return client;
  }

  async updateClient(id: number, update: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...update };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Projects
  async getProjects(): Promise<ProjectWithClient[]> {
    const projects = Array.from(this.projects.values());
    return projects.map(project => {
      const client = this.clients.get(project.clientId);
      return { ...project, client: client! };
    });
  }

  async getProject(id: number): Promise<ProjectWithClient | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const client = this.clients.get(project.clientId);
    return { ...project, client: client! };
  }

  async getProjectsByClient(clientId: number): Promise<ProjectWithClient[]> {
    const projects = Array.from(this.projects.values()).filter(p => p.clientId === clientId);
    return projects.map(project => {
      const client = this.clients.get(project.clientId);
      return { ...project, client: client! };
    });
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      ...insertProject,
      id: this.currentProjectId++,
      createdAt: new Date(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, update: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...update };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Tasks
  async getTasks(): Promise<TaskWithProject[]> {
    const tasks = Array.from(this.tasks.values());
    return tasks.map(task => {
      const project = this.projects.get(task.projectId);
      return { ...task, project: project! };
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(t => t.projectId === projectId);
  }

  async getTasksByStatus(status: string): Promise<TaskWithProject[]> {
    const tasks = Array.from(this.tasks.values()).filter(t => t.status === status);
    return tasks.map(task => {
      const project = this.projects.get(task.projectId);
      return { ...task, project: project! };
    });
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = {
      ...insertTask,
      id: this.currentTaskId++,
      createdAt: new Date(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: number, update: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...update };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Contracts
  async getContracts(): Promise<ContractWithClient[]> {
    const contracts = Array.from(this.contracts.values());
    return contracts.map(contract => {
      const client = this.clients.get(contract.clientId);
      return { ...contract, client: client! };
    });
  }

  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async getContractsByClient(clientId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(c => c.clientId === clientId);
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const contract: Contract = {
      ...insertContract,
      id: this.currentContractId++,
      createdAt: new Date(),
    };
    this.contracts.set(contract.id, contract);
    return contract;
  }

  async updateContract(id: number, update: Partial<InsertContract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...update };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }

  async deleteContract(id: number): Promise<boolean> {
    return this.contracts.delete(id);
  }

  // Invoices
  async getInvoices(): Promise<InvoiceWithClient[]> {
    const invoices = Array.from(this.invoices.values());
    return invoices.map(invoice => {
      const client = this.clients.get(invoice.clientId);
      return { ...invoice, client: client! };
    });
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(i => i.clientId === clientId);
  }

  async getInvoicesByProject(projectId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(i => i.projectId === projectId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const invoice: Invoice = {
      ...insertInvoice,
      id: this.currentInvoiceId++,
      createdAt: new Date(),
    };
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  async updateInvoice(id: number, update: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updatedInvoice = { ...invoice, ...update };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  // Analytics
  async getDashboardMetrics(): Promise<{
    activeProjects: number;
    totalClients: number;
    pendingTasks: number;
    totalRevenue: number;
  }> {
    const activeProjects = Array.from(this.projects.values()).filter(p => 
      p.status === "in_progress" || p.status === "planning"
    ).length;
    
    const totalClients = this.clients.size;
    
    const pendingTasks = Array.from(this.tasks.values()).filter(t => 
      !t.completed
    ).length;
    
    const totalRevenue = Array.from(this.invoices.values())
      .filter(i => i.status === "paid")
      .reduce((sum, invoice) => sum + parseFloat(invoice.amount || "0"), 0);

    return {
      activeProjects,
      totalClients,
      pendingTasks,
      totalRevenue,
    };
  }
}

import { supabaseStorage } from './supabase-storage';

export const storage = supabaseStorage;
