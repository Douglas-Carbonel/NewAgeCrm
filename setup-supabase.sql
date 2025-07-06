-- Freelancer Management System - Supabase Setup
-- This script creates all tables, indexes, and security policies

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create clients table
CREATE TABLE IF NOT EXISTS "clients" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "company" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "tags" TEXT[] DEFAULT '{}',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create client_contacts table
CREATE TABLE IF NOT EXISTS "client_contacts" (
  "id" SERIAL PRIMARY KEY,
  "client_id" INTEGER REFERENCES "clients"("id") ON DELETE CASCADE NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "position" TEXT,
  "is_primary" BOOLEAN DEFAULT FALSE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'planning',
  "start_date" DATE NOT NULL,
  "deadline" DATE NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "budget" DECIMAL(10, 2),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "project_id" INTEGER REFERENCES "projects"("id") NOT NULL,
  "assignee" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "due_date" DATE,
  "completed" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS "contracts" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'fixed',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "amount" DECIMAL(10, 2),
  "start_date" DATE,
  "end_date" DATE,
  "terms" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" SERIAL PRIMARY KEY,
  "invoice_number" TEXT NOT NULL UNIQUE,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "project_id" INTEGER REFERENCES "projects"("id"),
  "amount" DECIMAL(10, 2) NOT NULL,
  "tax_amount" DECIMAL(10, 2) DEFAULT 0,
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "due_date" DATE NOT NULL,
  "issue_date" DATE NOT NULL,
  "paid_date" DATE,
  "description" TEXT,
  "items" JSONB DEFAULT '[]',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS "time_entries" (
  "id" SERIAL PRIMARY KEY,
  "project_id" INTEGER REFERENCES "projects"("id") NOT NULL,
  "task_id" INTEGER REFERENCES "tasks"("id"),
  "user_name" TEXT NOT NULL,
  "description" TEXT,
  "hours" DECIMAL(5, 2) NOT NULL,
  "date" DATE DEFAULT CURRENT_DATE NOT NULL,
  "billable" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS "expenses" (
  "id" SERIAL PRIMARY KEY,
  "project_id" INTEGER REFERENCES "projects"("id"),
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "date" DATE DEFAULT CURRENT_DATE NOT NULL,
  "receipt_path" TEXT,
  "approved" BOOLEAN DEFAULT FALSE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create automation_rules table
CREATE TABLE IF NOT EXISTS "automation_rules" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "trigger_type" TEXT NOT NULL,
  "trigger_condition" JSONB,
  "action_type" TEXT NOT NULL,
  "action_config" JSONB,
  "active" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT DEFAULT 'info' NOT NULL,
  "read" BOOLEAN DEFAULT FALSE NOT NULL,
  "user_id" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_clients_email" ON "clients"("email");
CREATE INDEX IF NOT EXISTS "idx_projects_client_id" ON "projects"("client_id");
CREATE INDEX IF NOT EXISTS "idx_projects_status" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "idx_tasks_project_id" ON "tasks"("project_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_status" ON "tasks"("status");
CREATE INDEX IF NOT EXISTS "idx_tasks_assignee" ON "tasks"("assignee");
CREATE INDEX IF NOT EXISTS "idx_contracts_client_id" ON "contracts"("client_id");
CREATE INDEX IF NOT EXISTS "idx_contracts_status" ON "contracts"("status");
CREATE INDEX IF NOT EXISTS "idx_invoices_client_id" ON "invoices"("client_id");
CREATE INDEX IF NOT EXISTS "idx_invoices_project_id" ON "invoices"("project_id");
CREATE INDEX IF NOT EXISTS "idx_invoices_status" ON "invoices"("status");
CREATE INDEX IF NOT EXISTS "idx_time_entries_project_id" ON "time_entries"("project_id");
CREATE INDEX IF NOT EXISTS "idx_time_entries_date" ON "time_entries"("date");
CREATE INDEX IF NOT EXISTS "idx_expenses_project_id" ON "expenses"("project_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications"("user_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_read" ON "notifications"("read");

-- Enable Row Level Security on all tables
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "client_contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contracts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "time_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "automation_rules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth system)
CREATE POLICY "Enable all access for authenticated users" ON "clients"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "client_contacts"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "projects"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "tasks"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "contracts"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "invoices"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "time_entries"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "expenses"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "automation_rules"
  FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "notifications"
  FOR ALL USING (true);

-- Insert some sample data
INSERT INTO "clients" ("name", "email", "phone", "company", "address", "notes", "tags")
VALUES 
  ('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'São Paulo, SP', 'Cliente VIP', ARRAY['vip', 'recorrente']),
  ('Maria Santos', 'maria@startup.com', '(11) 88888-8888', 'Startup XYZ', 'Rio de Janeiro, RJ', 'Cliente novo', ARRAY['novo', 'tecnologia'])
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO "projects" ("name", "description", "client_id", "status", "start_date", "deadline", "progress", "budget")
VALUES 
  ('Website Corporativo', 'Desenvolvimento de site institucional', 1, 'in_progress', '2024-01-15', '2024-03-01', 65, 15000.00),
  ('App Mobile', 'Aplicativo para iOS e Android', 2, 'planning', '2024-02-01', '2024-06-01', 10, 25000.00)
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO "tasks" ("title", "description", "project_id", "assignee", "status", "priority", "due_date")
VALUES 
  ('Design da Homepage', 'Criar layout da página inicial', 1, 'Designer', 'completed', 'high', '2024-01-25'),
  ('Desenvolvimento Frontend', 'Implementar interface do usuário', 1, 'Dev Frontend', 'in_progress', 'high', '2024-02-15'),
  ('Planejamento do App', 'Definir arquitetura e funcionalidades', 2, 'Product Owner', 'pending', 'medium', '2024-02-10')
ON CONFLICT DO NOTHING;

-- Insert sample contracts
INSERT INTO "contracts" ("title", "description", "client_id", "type", "status", "amount", "start_date", "end_date", "terms")
VALUES 
  ('Contrato Website', 'Desenvolvimento e manutenção do site', 1, 'fixed', 'active', 15000.00, '2024-01-15', '2024-12-31', 'Pagamento em 3 parcelas'),
  ('Contrato App Mobile', 'Desenvolvimento de aplicativo mobile', 2, 'hourly', 'draft', 25000.00, '2024-02-01', '2024-06-01', 'Pagamento por milestone')
ON CONFLICT DO NOTHING;

-- Insert sample invoices
INSERT INTO "invoices" ("invoice_number", "client_id", "project_id", "amount", "tax_amount", "total_amount", "status", "due_date", "issue_date", "description", "items")
VALUES 
  ('INV-2024-001', 1, 1, 5000.00, 500.00, 5500.00, 'sent', '2024-02-15', '2024-01-15', 'Primeira parcela do projeto', '[{"description": "Desenvolvimento", "quantity": 1, "rate": 5000.00, "amount": 5000.00}]'),
  ('INV-2024-002', 2, 2, 8000.00, 800.00, 8800.00, 'draft', '2024-03-01', '2024-02-01', 'Primeira milestone do app', '[{"description": "Planejamento", "quantity": 1, "rate": 8000.00, "amount": 8000.00}]')
ON CONFLICT DO NOTHING;

-- Insert sample time entries
INSERT INTO "time_entries" ("project_id", "task_id", "user_name", "description", "hours", "date", "billable")
VALUES 
  (1, 1, 'Designer', 'Criação de mockups', 8.5, '2024-01-20', true),
  (1, 2, 'Dev Frontend', 'Implementação da homepage', 12.0, '2024-02-01', true),
  (2, 3, 'Product Owner', 'Levantamento de requisitos', 4.0, '2024-02-05', true)
ON CONFLICT DO NOTHING;

-- Insert sample expenses
INSERT INTO "expenses" ("project_id", "category", "description", "amount", "date", "approved")
VALUES 
  (1, 'Software', 'Licença Adobe Creative Suite', 299.99, '2024-01-16', true),
  (2, 'Hardware', 'Dispositivo de teste iOS', 899.00, '2024-02-01', false)
ON CONFLICT DO NOTHING;

-- Insert sample automation rules
INSERT INTO "automation_rules" ("name", "trigger_type", "trigger_condition", "action_type", "action_config", "active")
VALUES 
  ('Alerta de Deadline', 'deadline_approaching', '{"days_before": 3}', 'send_notification', '{"type": "email", "template": "deadline_alert"}', true),
  ('Fatura Vencida', 'invoice_overdue', '{"days_after": 7}', 'send_notification', '{"type": "email", "template": "overdue_invoice"}', true)
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO "notifications" ("title", "message", "type", "read", "user_id")
VALUES 
  ('Projeto Website em Progresso', 'O projeto Website Corporativo está 65% completo', 'info', false, 'user_1'),
  ('Fatura Enviada', 'Fatura INV-2024-001 foi enviada para o cliente', 'success', true, 'user_1'),
  ('Deadline Próximo', 'Tarefa "Desenvolvimento Frontend" vence em 3 dias', 'warning', false, 'user_1')
ON CONFLICT DO NOTHING;