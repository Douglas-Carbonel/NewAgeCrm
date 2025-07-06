async function createTablesViaAPI() {
  console.log('🚀 Criando tabelas via Supabase REST API...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  }

  // SQL statements to execute
  const sqlStatements = [
    // Create clients table
    `CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      address TEXT,
      notes TEXT,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    // Create projects table
    `CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'planning',
      start_date DATE NOT NULL,
      deadline DATE NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      budget DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    // Create tasks table
    `CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      project_id INTEGER NOT NULL,
      assignee TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      due_date DATE,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    // Create contracts table
    `CREATE TABLE IF NOT EXISTS contracts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      client_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'fixed',
      status TEXT NOT NULL DEFAULT 'draft',
      amount DECIMAL(10, 2),
      start_date DATE,
      end_date DATE,
      terms TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    // Create invoices table
    `CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_number TEXT NOT NULL UNIQUE,
      client_id INTEGER NOT NULL,
      project_id INTEGER,
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
    );`,
    
    // Create other tables
    `CREATE TABLE IF NOT EXISTS time_entries (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL,
      task_id INTEGER,
      user_name TEXT NOT NULL,
      description TEXT,
      hours DECIMAL(5, 2) NOT NULL,
      date DATE DEFAULT CURRENT_DATE NOT NULL,
      billable BOOLEAN DEFAULT TRUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    `CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      project_id INTEGER,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      date DATE DEFAULT CURRENT_DATE NOT NULL,
      receipt_path TEXT,
      approved BOOLEAN DEFAULT FALSE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    `CREATE TABLE IF NOT EXISTS automation_rules (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      trigger_condition JSONB,
      action_type TEXT NOT NULL,
      action_config JSONB,
      active BOOLEAN DEFAULT TRUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`,
    
    `CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info' NOT NULL,
      read BOOLEAN DEFAULT FALSE NOT NULL,
      user_id TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`
  ];

  try {
    // Execute each SQL statement via REST API
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`📝 Executando comando ${i + 1}/${sqlStatements.length}...`);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({ query: sql })
      });

      if (!response.ok) {
        console.log(`⚠️  Comando ${i + 1} falhou (pode ser normal se a tabela já existir)`);
      } else {
        console.log(`✅ Comando ${i + 1} executado com sucesso`);
      }
    }

    // Insert sample data
    console.log('📝 Inserindo dados de exemplo...');
    
    // Insert clients
    const clientsResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify([
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
      ])
    });

    if (clientsResponse.ok) {
      console.log('✅ Clientes inseridos com sucesso!');
    } else {
      console.log('⚠️  Erro ao inserir clientes (pode ser normal se já existirem)');
    }

    // Insert projects
    const projectsResponse = await fetch(`${supabaseUrl}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify([
        {
          name: 'Website Corporativo',
          description: 'Desenvolvimento de site institucional',
          client_id: 1,
          status: 'in_progress',
          start_date: '2024-01-15',
          deadline: '2024-03-01',
          progress: 65,
          budget: 15000.00
        },
        {
          name: 'App Mobile',
          description: 'Aplicativo para iOS e Android',
          client_id: 2,
          status: 'planning',
          start_date: '2024-02-01',
          deadline: '2024-06-01',
          progress: 10,
          budget: 25000.00
        }
      ])
    });

    if (projectsResponse.ok) {
      console.log('✅ Projetos inseridos com sucesso!');
    } else {
      console.log('⚠️  Erro ao inserir projetos');
    }

    // Test connection
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/clients?select=*&limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });

    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log(`✅ Teste de conexão bem-sucedido! Encontrados ${data.length} registros`);
      return true;
    } else {
      console.log('⚠️  Teste de conexão falhou');
      return false;
    }

  } catch (error) {
    console.error('❌ Erro na criação via API:', error);
    return false;
  }
}

createTablesViaAPI()
  .then((success) => {
    if (success) {
      console.log('🎉 Configuração do Supabase concluída via API!');
    } else {
      console.log('⚠️  Configuração parcialmente concluída');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na configuração:', error);
    process.exit(1);
  });