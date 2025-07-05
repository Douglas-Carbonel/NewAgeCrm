import { storage } from "./storage";
import type { Approval, InsertApproval, ApprovalWithEntity } from "@shared/schema";

interface ApprovalRequest {
  entityType: 'project' | 'task' | 'invoice' | 'contract';
  entityId: number;
  requestedBy: string;
  reason?: string;
}

interface ApprovalDecision {
  status: 'approved' | 'rejected';
  comments?: string;
  approvedBy: string;
}

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  averageProcessingTime: number; // in hours
  byEntityType: {
    project: number;
    task: number;
    invoice: number;
    contract: number;
  };
}

interface AutoApprovalRule {
  id: number;
  entityType: string;
  maxAmount?: number;
  trustedUsers: string[];
  isActive: boolean;
  description: string;
}

class ApprovalsService {
  private approvals: Map<number, Approval> = new Map();
  private autoApprovalRules: Map<number, AutoApprovalRule> = new Map();
  private currentApprovalId = 1;
  private currentRuleId = 1;

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    // Auto-approve small invoices
    const smallInvoiceRule: AutoApprovalRule = {
      id: this.currentRuleId++,
      entityType: 'invoice',
      maxAmount: 1000,
      trustedUsers: [],
      isActive: true,
      description: 'Auto-approve invoices under R$ 1,000'
    };

    // Auto-approve tasks from trusted users
    const trustedTaskRule: AutoApprovalRule = {
      id: this.currentRuleId++,
      entityType: 'task',
      trustedUsers: ['admin', 'project_manager'],
      isActive: true,
      description: 'Auto-approve tasks from trusted users'
    };

    this.autoApprovalRules.set(smallInvoiceRule.id, smallInvoiceRule);
    this.autoApprovalRules.set(trustedTaskRule.id, trustedTaskRule);
  }

  async requestApproval(request: ApprovalRequest): Promise<Approval> {
    try {
      // Check if auto-approval applies
      const autoApprovalResult = await this.checkAutoApproval(request);
      if (autoApprovalResult) {
        return autoApprovalResult;
      }

      const approval: Approval = {
        id: this.currentApprovalId++,
        entityType: request.entityType,
        entityId: request.entityId,
        requestedBy: request.requestedBy,
        status: 'pending',
        reason: request.reason || '',
        comments: '',
        requestedAt: new Date(),
        reviewedAt: null,
        createdAt: new Date(),
        approvedBy: null
      };

      this.approvals.set(approval.id, approval);
      return approval;
    } catch (error) {
      throw new Error(`Failed to request approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processApproval(approvalId: number, decision: ApprovalDecision): Promise<Approval> {
    try {
      const approval = this.approvals.get(approvalId);
      if (!approval) {
        throw new Error('Approval not found');
      }

      if (approval.status !== 'pending') {
        throw new Error('Approval already processed');
      }

      const updatedApproval: Approval = {
        ...approval,
        status: decision.status,
        approvedBy: decision.approvedBy,
        comments: decision.comments || '',
        reviewedAt: new Date()
      };

      this.approvals.set(approvalId, updatedApproval);

      // Here you would typically update the associated entity status
      await this.updateEntityStatus(approval.entityType, approval.entityId, decision.status);

      return updatedApproval;
    } catch (error) {
      throw new Error(`Failed to process approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getApprovals(status?: string): Promise<ApprovalWithEntity[]> {
    try {
      let approvalsList = Array.from(this.approvals.values());
      
      if (status) {
        approvalsList = approvalsList.filter(approval => approval.status === status);
      }

      // Enrich with entity names
      const enrichedApprovals = await Promise.all(
        approvalsList.map(async (approval) => {
          const entityName = await this.getEntityName(approval.entityType, approval.entityId);
          return {
            ...approval,
            entityName
          };
        })
      );

      return enrichedApprovals.sort((a, b) => 
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      );
    } catch (error) {
      throw new Error(`Failed to get approvals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getApprovalStats(): Promise<ApprovalStats> {
    try {
      const allApprovals = Array.from(this.approvals.values());
      
      const pending = allApprovals.filter(a => a.status === 'pending').length;
      const approved = allApprovals.filter(a => a.status === 'approved').length;
      const rejected = allApprovals.filter(a => a.status === 'rejected').length;

      // Calculate average processing time
      const processedApprovals = allApprovals.filter(a => a.reviewedAt);
      const averageProcessingTime = processedApprovals.length > 0
        ? processedApprovals.reduce((sum, approval) => {
            const requestTime = new Date(approval.requestedAt).getTime();
            const reviewTime = new Date(approval.reviewedAt!).getTime();
            return sum + (reviewTime - requestTime);
          }, 0) / processedApprovals.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      // Count by entity type
      const byEntityType = {
        project: allApprovals.filter(a => a.entityType === 'project').length,
        task: allApprovals.filter(a => a.entityType === 'task').length,
        invoice: allApprovals.filter(a => a.entityType === 'invoice').length,
        contract: allApprovals.filter(a => a.entityType === 'contract').length
      };

      return {
        pending,
        approved,
        rejected,
        averageProcessingTime,
        byEntityType
      };
    } catch (error) {
      throw new Error(`Failed to get approval stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkAutoApproval(request: ApprovalRequest): Promise<Approval | null> {
    const activeRules = Array.from(this.autoApprovalRules.values()).filter(rule => 
      rule.isActive && rule.entityType === request.entityType
    );

    for (const rule of activeRules) {
      let shouldAutoApprove = false;

      // Check trusted users
      if (rule.trustedUsers.length > 0 && rule.trustedUsers.includes(request.requestedBy)) {
        shouldAutoApprove = true;
      }

      // Check amount limit for invoices
      if (rule.maxAmount && request.entityType === 'invoice') {
        const invoice = await storage.getInvoice(request.entityId);
        if (invoice && parseFloat(invoice.amount) <= rule.maxAmount) {
          shouldAutoApprove = true;
        }
      }

      if (shouldAutoApprove) {
        const autoApproval: Approval = {
          id: this.currentApprovalId++,
          entityType: request.entityType,
          entityId: request.entityId,
          requestedBy: request.requestedBy,
          status: 'approved',
          reason: request.reason || '',
          comments: `Auto-approved by rule: ${rule.description}`,
          requestedAt: new Date(),
          reviewedAt: new Date(),
          createdAt: new Date(),
          approvedBy: 'system'
        };

        this.approvals.set(autoApproval.id, autoApproval);
        await this.updateEntityStatus(request.entityType, request.entityId, 'approved');
        return autoApproval;
      }
    }

    return null;
  }

  private async updateEntityStatus(entityType: string, entityId: number, status: string): Promise<void> {
    // Update the status of the associated entity
    try {
      switch (entityType) {
        case 'project':
          // In a real implementation, you might update project approval status
          break;
        case 'task':
          // Update task approval status
          break;
        case 'invoice':
          if (status === 'approved') {
            await storage.updateInvoice(entityId, { status: 'sent' });
          }
          break;
        case 'contract':
          // Update contract status
          break;
      }
    } catch (error) {
      console.error(`Failed to update entity status: ${error}`);
    }
  }

  private async getEntityName(entityType: string, entityId: number): Promise<string> {
    try {
      switch (entityType) {
        case 'project':
          const project = await storage.getProject(entityId);
          return project?.name || `Project #${entityId}`;
        case 'task':
          const task = await storage.getTask(entityId);
          return task?.title || `Task #${entityId}`;
        case 'invoice':
          const invoice = await storage.getInvoice(entityId);
          return invoice?.invoiceNumber || `Invoice #${entityId}`;
        case 'contract':
          const contract = await storage.getContract(entityId);
          return contract?.name || `Contract #${entityId}`;
        default:
          return `${entityType} #${entityId}`;
      }
    } catch (error) {
      return `${entityType} #${entityId}`;
    }
  }

  async bulkApprove(approvalIds: number[], approvedBy: string): Promise<number> {
    let approved = 0;
    for (const id of approvalIds) {
      try {
        await this.processApproval(id, { status: 'approved', approvedBy });
        approved++;
      } catch (error) {
        console.error(`Failed to approve ${id}: ${error}`);
      }
    }
    return approved;
  }
}

export const approvalsService = new ApprovalsService();