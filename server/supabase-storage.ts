import { supabase, supabaseAdmin, isSupabaseConnected } from "./db";
import { IStorage } from "./storage";
import { 
  type Client, type InsertClient,
  type Project, type InsertProject, type ProjectWithClient,
  type Task, type InsertTask, type TaskWithProject,
  type Contract, type InsertContract, type ContractWithClient,
  type Invoice, type InsertInvoice, type InvoiceWithClient
} from "@shared/schema";

export class SupabaseStorage implements IStorage {
  // Clients
  async getClients(): Promise<Client[]> {
    if (!isSupabaseConnected || !supabase) {
      throw new Error("Supabase not connected");
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getClient(id: number): Promise<Client | undefined> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async deleteClient(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Projects
  async getProjects(): Promise<ProjectWithClient[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getProject(id: number): Promise<ProjectWithClient | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getProjectsByClient(clientId: number): Promise<ProjectWithClient[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async deleteProject(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Tasks
  async getTasks(): Promise<TaskWithProject[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(
          *,
          client:clients(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getTask(id: number): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getTasksByStatus(status: string): Promise<TaskWithProject[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(
          *,
          client:clients(*)
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async deleteTask(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Contracts
  async getContracts(): Promise<ContractWithClient[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getContractsByClient(clientId: number): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined> {
    const { data, error } = await supabase
      .from('contracts')
      .update(contract)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async deleteContract(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Invoices
  async getInvoices(): Promise<InvoiceWithClient[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getInvoicesByClient(clientId: number): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getInvoicesByProject(projectId: number): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Analytics
  async getDashboardMetrics(): Promise<{
    activeProjects: number;
    totalClients: number;
    pendingTasks: number;
    totalRevenue: number;
  }> {
    const [
      { count: activeProjects },
      { count: totalClients },
      { count: pendingTasks },
      { data: invoiceData }
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .in('status', ['in_progress', 'planning']),
      supabase
        .from('clients')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completed', false),
      supabase
        .from('invoices')
        .select('total_amount')
        .eq('status', 'paid')
    ]);

    const totalRevenue = invoiceData?.reduce((sum, invoice) => 
      sum + parseFloat(invoice.total_amount || '0'), 0) || 0;

    return {
      activeProjects: activeProjects || 0,
      totalClients: totalClients || 0,
      pendingTasks: pendingTasks || 0,
      totalRevenue,
    };
  }
}

export const supabaseStorage = new SupabaseStorage();