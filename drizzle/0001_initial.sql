-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  "status" TEXT DEFAULT 'planning' NOT NULL,
  "start_date" DATE,
  "end_date" DATE,
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
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "priority" TEXT DEFAULT 'medium' NOT NULL,
  "due_date" DATE,
  "completed" BOOLEAN DEFAULT FALSE NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS "contracts" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "project_id" INTEGER REFERENCES "projects"("id"),
  "file_path" TEXT,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "value" DECIMAL(10, 2),
  "start_date" DATE,
  "end_date" DATE,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS "proposals" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "content" TEXT,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "total_value" DECIMAL(10, 2),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create invoices table  
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" SERIAL PRIMARY KEY,
  "invoice_number" TEXT NOT NULL UNIQUE,
  "client_id" INTEGER REFERENCES "clients"("id") NOT NULL,
  "project_id" INTEGER REFERENCES "projects"("id"),
  "contract_id" INTEGER REFERENCES "contracts"("id"),
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "due_date" DATE,
  "issued_date" DATE DEFAULT CURRENT_DATE,
  "description" TEXT,
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
CREATE INDEX IF NOT EXISTS "idx_client_contacts_client_id" ON "client_contacts"("client_id");
CREATE INDEX IF NOT EXISTS "idx_projects_client_id" ON "projects"("client_id");
CREATE INDEX IF NOT EXISTS "idx_tasks_project_id" ON "tasks"("project_id");
CREATE INDEX IF NOT EXISTS "idx_contracts_client_id" ON "contracts"("client_id");
CREATE INDEX IF NOT EXISTS "idx_proposals_client_id" ON "proposals"("client_id");
CREATE INDEX IF NOT EXISTS "idx_invoices_client_id" ON "invoices"("client_id");
CREATE INDEX IF NOT EXISTS "idx_time_entries_project_id" ON "time_entries"("project_id");
CREATE INDEX IF NOT EXISTS "idx_expenses_project_id" ON "expenses"("project_id");