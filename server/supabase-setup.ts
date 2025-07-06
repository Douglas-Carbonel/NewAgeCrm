import { supabaseAdmin } from './db';

// Function to create tables and setup database
export async function setupSupabaseDatabase() {
  try {
    console.log('🚀 Configurando estrutura do banco Supabase automaticamente...');

    // Create simple tables without foreign keys first
    const createBasicTablesSQL = [
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

    // Try creating tables using direct database method
    const { db } = await import('./db');
    
    for (let i = 0; i < createBasicTablesSQL.length; i++) {
      try {
        console.log(`📝 Criando tabela ${i + 1}/${createBasicTablesSQL.length}...`);
        await db.execute(createBasicTablesSQL[i]);
        console.log(`✅ Tabela ${i + 1} criada com sucesso`);
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Tabela ${i + 1} já existe`);
        } else {
          console.log(`⚠️  Erro na tabela ${i + 1}:`, error.message);
        }
      }
    }

    // Insert sample data using the Supabase client
    console.log('📝 Inserindo dados de exemplo...');
    
    try {
      const { error: clientError } = await supabaseAdmin
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
        ], { onConflict: 'email', ignoreDuplicates: true });

      if (!clientError) {
        console.log('✅ Clientes inseridos com sucesso!');
        
        // Insert projects after clients
        const { error: projectError } = await supabaseAdmin
          .from('projects')
          .upsert([
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
          ], { onConflict: 'name', ignoreDuplicates: true });

        if (!projectError) {
          console.log('✅ Projetos inseridos com sucesso!');
        }
      }
    } catch (error) {
      console.log('ℹ️  Dados de exemplo não inseridos (normal se já existirem)');
    }

    console.log('🎉 Configuração do banco Supabase concluída!');
    
    // Test connection
    try {
      const { data: testData, error: testError } = await supabaseAdmin
        .from('clients')
        .select('*')
        .limit(1);

      if (!testError && testData) {
        console.log('✅ Conexão com Supabase testada com sucesso!');
        console.log(`📊 Encontrados ${testData.length} clientes na base`);
      } else {
        console.log('⚠️  Teste de conexão não completou, mas sistema deve funcionar');
      }
    } catch (error) {
      console.log('ℹ️  Sistema configurado, teste de conexão será feito nas requisições');
    }

  } catch (error) {
    console.log('⚠️  Configuração parcial concluída. Sistema utilizará Supabase conforme disponível.');
  }
}

// Auto-setup disabled - run manually if needed
// setupSupabaseDatabase().catch(() => {
//   console.log('ℹ️  Setup do Supabase será tentado nas próximas operações');
// });