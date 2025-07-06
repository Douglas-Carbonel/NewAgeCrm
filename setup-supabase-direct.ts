import { supabaseAdmin } from './server/db';

async function setupSupabaseDirect() {
  console.log('🚀 Configurando Supabase usando REST API...');

  try {
    // Primeiro vamos tentar criar uma tabela simples para testar
    console.log('📝 Criando tabela clients...');
    
    // Use raw SQL execution through Supabase
    const createClientsTable = `
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        address TEXT,
        notes TEXT,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Execute via RPC if available
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: createClientsTable 
    });

    if (error) {
      console.log('⚠️  RPC não disponível, tentando abordagem alternativa...');
      
      // Try alternative approach - insert sample data directly
      console.log('📝 Inserindo dados de teste para verificar conexão...');
      
      const { data: testData, error: testError } = await supabaseAdmin
        .from('clients')
        .select('*')
        .limit(1);

      if (testError) {
        console.log('❌ Tabelas não existem. Por favor, execute o SQL manualmente no painel do Supabase.');
        console.log('📋 SQL para copiar:');
        console.log(`
-- Execute este SQL no painel do Supabase (SQL Editor):

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning',
  start_date DATE NOT NULL,
  deadline DATE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  budget DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_id INTEGER REFERENCES projects(id) NOT NULL,
  assignee TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  type TEXT NOT NULL DEFAULT 'fixed',
  status TEXT NOT NULL DEFAULT 'draft',
  amount DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE NOT NULL,
  issue_date DATE NOT NULL,
  paid_date DATE,
  description TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS time_entries (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) NOT NULL,
  task_id INTEGER REFERENCES tasks(id),
  user_name TEXT NOT NULL,
  description TEXT,
  hours DECIMAL(5, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  billable BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  receipt_path TEXT,
  approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS automation_rules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_condition JSONB,
  action_type TEXT NOT NULL,
  action_config JSONB,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inserir dados de exemplo
INSERT INTO clients (name, email, phone, company, address, notes, tags)
VALUES 
  ('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'São Paulo, SP', 'Cliente VIP', ARRAY['vip', 'recorrente']),
  ('Maria Santos', 'maria@startup.com', '(11) 88888-8888', 'Startup XYZ', 'Rio de Janeiro, RJ', 'Cliente novo', ARRAY['novo', 'tecnologia']);

INSERT INTO projects (name, description, client_id, status, start_date, deadline, progress, budget)
VALUES 
  ('Website Corporativo', 'Desenvolvimento de site institucional', 1, 'in_progress', '2024-01-15', '2024-03-01', 65, 15000.00),
  ('App Mobile', 'Aplicativo para iOS e Android', 2, 'planning', '2024-02-01', '2024-06-01', 10, 25000.00);
        `);
        
        return false;
      } else {
        console.log('✅ Conexão com tabelas existentes OK!');
        return true;
      }
    } else {
      console.log('✅ Tabela criada via RPC!');
      return true;
    }

  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    return false;
  }
}

setupSupabaseDirect().then((success) => {
  if (success) {
    console.log('🎉 Configuração concluída!');
  } else {
    console.log('⚠️  Execute o SQL manualmente no painel do Supabase');
  }
});