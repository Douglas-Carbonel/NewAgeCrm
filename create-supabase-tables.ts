import { supabaseAdmin } from './server/db';

async function createSupabaseTables() {
  console.log('🚀 Criando tabelas no Supabase...');

  // SQL para criar todas as tabelas
  const createTablesSQL = `
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
  `;

  const indexesSQL = `
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
  `;

  try {
    // Execute SQL using Drizzle with raw SQL
    const { db } = await import('./server/db');
    
    // Split and execute each statement
    const statements = createTablesSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.execute(statement);
          console.log('✅ Tabela criada com sucesso');
        } catch (error: any) {
          if (error.message.includes('already exists')) {
            console.log('ℹ️  Tabela já existe');
          } else {
            console.log('⚠️  Erro:', error.message);
          }
        }
      }
    }

    // Execute indexes
    const indexStatements = indexesSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of indexStatements) {
      if (statement.trim()) {
        try {
          await db.execute(statement);
          console.log('✅ Índice criado com sucesso');
        } catch (error: any) {
          console.log('ℹ️  Índice já existe ou erro:', error.message);
        }
      }
    }

    console.log('🎉 Estrutura do banco criada com sucesso!');

    // Insert sample data
    console.log('📝 Inserindo dados de exemplo...');
    
    await supabaseAdmin
      .from('clients')
      .upsert([
        {
          name: 'João Silva',
          email: 'joao@empresa.com',
          phone: '(11) 99999-9999',
          company: 'Empresa ABC',
          address: 'São Paulo, SP',
          notes: 'Cliente VIP',
          tags: ['vip', 'recorrente']
        },
        {
          name: 'Maria Santos',
          email: 'maria@startup.com',
          phone: '(11) 88888-8888',
          company: 'Startup XYZ',
          address: 'Rio de Janeiro, RJ',
          notes: 'Cliente novo',
          tags: ['novo', 'tecnologia']
        }
      ]);

    console.log('✅ Dados de exemplo inseridos!');

    // Test the connection
    const { data: clients, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Erro ao testar conexão:', error);
    } else {
      console.log(`✅ Conexão testada! Encontrados ${clients?.length || 0} clientes`);
    }

  } catch (error) {
    console.error('❌ Erro na criação das tabelas:', error);
    throw error;
  }
}

// Execute the setup
createSupabaseTables()
  .then(() => {
    console.log('🎉 Setup do Supabase concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha no setup:', error);
    process.exit(1);
  });