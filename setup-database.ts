import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configure Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Configurando banco de dados Supabase...');
    
    // Read the SQL setup file
    const sqlFile = path.join(process.cwd(), 'setup-supabase.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    console.log(`📝 Executando ${statements.length} comandos SQL...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`⚠️  Comando ${i + 1} falhou (pode ser normal se a tabela já existir):`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.warn(`⚠️  Erro no comando ${i + 1}:`, err);
        }
      }
    }
    
    console.log('🎉 Configuração do banco de dados concluída!');
    
    // Test the connection by querying some data
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Erro ao testar conexão:', error);
    } else {
      console.log(`✅ Conexão testada com sucesso! Encontrados ${clients?.length || 0} clientes`);
    }
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();