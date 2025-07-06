
import { supabaseAdmin } from './server/db';

async function createSupabaseTablesSimple() {
  console.log('🚀 Criando tabelas no Supabase usando cliente...');

  try {
    // Primeiro, vamos tentar inserir dados de teste para verificar se as tabelas existem
    console.log('📝 Verificando se as tabelas existem...');
    
    const { data: existingClients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(1);

    if (clientsError && clientsError.code === '42P01') {
      console.log('❌ Tabelas não existem. Você precisa criar as tabelas manualmente no painel do Supabase.');
      console.log('');
      console.log('📋 Por favor, acesse o painel do Supabase (https://supabase.com/dashboard)');
      console.log('📋 Vá para SQL Editor e execute o seguinte SQL:');
      console.log('');
      console.log(`
-- Copie e cole este SQL no SQL Editor do Supabase:

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
  name TEXT NOT NULL,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  value DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_id INTEGER REFERENCES clients(id) NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE NOT NULL,
  paid_date DATE,
  description TEXT,
  is_auto_generated BOOLEAN DEFAULT FALSE,
  time_entries_ids TEXT[],
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  requested_by TEXT NOT NULL,
  approved_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  comments TEXT,
  requested_at TIMESTAMP DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  type TEXT NOT NULL DEFAULT 'meeting',
  entity_type TEXT,
  entity_id INTEGER,
  client_id INTEGER REFERENCES clients(id),
  project_id INTEGER REFERENCES projects(id),
  priority TEXT NOT NULL DEFAULT 'medium',
  location TEXT,
  attendees TEXT[],
  reminder_minutes INTEGER DEFAULT 15,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_contacts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  is_primary BOOLEAN DEFAULT FALSE NOT NULL,
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

-- Inserir dados de exemplo
INSERT INTO clients (name, email, phone, company, address, notes, tags)
VALUES 
  ('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'São Paulo, SP', 'Cliente VIP', ARRAY['vip', 'recorrente']),
  ('Maria Santos', 'maria@startup.com', '(11) 88888-8888', 'Startup XYZ', 'Rio de Janeiro, RJ', 'Cliente novo', ARRAY['novo', 'tecnologia'])
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (name, description, client_id, status, start_date, deadline, progress, budget)
VALUES 
  ('Website Corporativo', 'Desenvolvimento de site institucional', 1, 'in_progress', '2024-01-15', '2024-03-01', 65, 15000.00),
  ('App Mobile', 'Aplicativo para iOS e Android', 2, 'planning', '2024-02-01', '2024-06-01', 10, 25000.00)
ON CONFLICT DO NOTHING;
      `);
      
      return false;
    } else if (!clientsError) {
      console.log('✅ Tabelas já existem!');
      
      // Inserir dados de exemplo se não existirem
      console.log('📝 Verificando dados de exemplo...');
      
      if (existingClients && existingClients.length === 0) {
        console.log('📝 Inserindo dados de exemplo...');
        
        const { error: insertError } = await supabaseAdmin
          .from('clients')
          .insert([
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

        if (!insertError) {
          console.log('✅ Dados de exemplo inseridos!');
        }
      }
      
      return true;
    } else {
      console.log('❌ Erro inesperado:', clientsError);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro na verificação das tabelas:', error);
    return false;
  }
}

// Executar o setup
createSupabaseTablesSimple()
  .then((success) => {
    if (success) {
      console.log('🎉 Tabelas verificadas/criadas com sucesso!');
    } else {
      console.log('⚠️  Por favor, execute o SQL manualmente no painel do Supabase');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na verificação:', error);
    process.exit(1);
  });
