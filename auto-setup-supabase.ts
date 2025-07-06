import postgres from 'postgres';

async function autoSetupSupabase() {
  console.log('🚀 Criando estrutura do banco automaticamente...');

  // Get database connection string
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  }

  // Extract project info and create connection string
  const url = new URL(supabaseUrl);
  const host = url.hostname;
  const projectId = host.split('.')[0];
  
  // Try different connection formats
  const connectionStrings = [
    `postgresql://postgres:${supabaseKey}@db.${projectId}.supabase.co:5432/postgres`,
    `postgresql://postgres.${projectId}:${supabaseKey}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${projectId}:${supabaseKey}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
  ];

  let sql: ReturnType<typeof postgres> | null = null;

  // Try each connection string
  for (const connectionString of connectionStrings) {
    try {
      console.log(`Tentando conectar com: ${connectionString.replace(supabaseKey, '***')}`);
      sql = postgres(connectionString, {
        max: 1,
        connect_timeout: 30,
        idle_timeout: 30
      });
      
      // Test connection
      await sql`SELECT 1`;
      console.log('✅ Conexão estabelecida!');
      break;
    } catch (error) {
      console.log(`❌ Falha na conexão: ${error}`);
      if (sql) {
        await sql.end();
        sql = null;
      }
    }
  }

  if (!sql) {
    throw new Error('Não foi possível conectar ao Supabase com nenhum formato de URL');
  }

  try {
    // Create tables one by one
    console.log('📝 Criando tabela clients...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela client_contacts...');
    await sql`
      CREATE TABLE IF NOT EXISTS client_contacts (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        position TEXT,
        is_primary BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    console.log('📝 Criando tabela projects...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela tasks...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela contracts...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela invoices...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela time_entries...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela expenses...');
    await sql`
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
      )
    `;

    console.log('📝 Criando tabela automation_rules...');
    await sql`
      CREATE TABLE IF NOT EXISTS automation_rules (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        trigger_type TEXT NOT NULL,
        trigger_condition JSONB,
        action_type TEXT NOT NULL,
        action_config JSONB,
        active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    console.log('📝 Criando tabela notifications...');
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info' NOT NULL,
        read BOOLEAN DEFAULT FALSE NOT NULL,
        user_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    // Create indexes
    console.log('🔧 Criando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id)`;

    // Insert sample data
    console.log('📝 Inserindo dados de exemplo...');
    
    await sql`
      INSERT INTO clients (name, email, phone, company, address, notes, tags)
      VALUES 
        ('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC', 'São Paulo, SP', 'Cliente VIP', ARRAY['vip', 'recorrente']),
        ('Maria Santos', 'maria@startup.com', '(11) 88888-8888', 'Startup XYZ', 'Rio de Janeiro, RJ', 'Cliente novo', ARRAY['novo', 'tecnologia'])
      ON CONFLICT (email) DO NOTHING
    `;

    await sql`
      INSERT INTO projects (name, description, client_id, status, start_date, deadline, progress, budget)
      VALUES 
        ('Website Corporativo', 'Desenvolvimento de site institucional', 1, 'in_progress', '2024-01-15', '2024-03-01', 65, 15000.00),
        ('App Mobile', 'Aplicativo para iOS e Android', 2, 'planning', '2024-02-01', '2024-06-01', 10, 25000.00)
      ON CONFLICT DO NOTHING
    `;

    await sql`
      INSERT INTO tasks (title, description, project_id, assignee, status, priority, due_date)
      VALUES 
        ('Design da Homepage', 'Criar layout da página inicial', 1, 'Designer', 'completed', 'high', '2024-01-25'),
        ('Desenvolvimento Frontend', 'Implementar interface do usuário', 1, 'Dev Frontend', 'in_progress', 'high', '2024-02-15'),
        ('Planejamento do App', 'Definir arquitetura e funcionalidades', 2, 'Product Owner', 'pending', 'medium', '2024-02-10')
      ON CONFLICT DO NOTHING
    `;

    // Test the setup
    const clientsCount = await sql`SELECT COUNT(*) FROM clients`;
    const projectsCount = await sql`SELECT COUNT(*) FROM projects`;
    const tasksCount = await sql`SELECT COUNT(*) FROM tasks`;

    console.log(`✅ Setup concluído!`);
    console.log(`📊 Dados inseridos: ${clientsCount[0].count} clientes, ${projectsCount[0].count} projetos, ${tasksCount[0].count} tarefas`);

    await sql.end();
    return true;

  } catch (error) {
    console.error('❌ Erro durante setup:', error);
    await sql.end();
    throw error;
  }
}

// Execute setup
autoSetupSupabase()
  .then(() => {
    console.log('🎉 Banco de dados Supabase configurado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na configuração:', error);
    process.exit(1);
  });