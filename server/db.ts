import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from '@shared/schema';

// Supabase client for direct operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only require Supabase environment variables if explicitly configured
let supabase: any = null;
let supabaseAdmin: any = null;
let db: ReturnType<typeof drizzle> | null = null;
let isSupabaseConnected = false;

if (supabaseUrl && supabaseAnonKey && supabaseServiceKey) {
  try {
    // Create Supabase clients
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Database connection for Drizzle ORM
    const getDatabaseUrl = () => {
      const url = new URL(supabaseUrl);
      const host = url.hostname;
      const projectId = host.split('.')[0];

      return `postgresql://postgres.${projectId}:${supabaseServiceKey}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;
    };

    const client = postgres(getDatabaseUrl(), {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    db = drizzle(client, { schema });
    isSupabaseConnected = true;
    console.log('Connected to Supabase database');
  } catch (error) {
    console.error('Supabase connection failed:', error);
    console.log('Falling back to in-memory storage for development');
  }
} else {
  console.log('❌ Supabase not configured, using in-memory storage for development');
  console.log('🔧 Para usar o Supabase, configure as variáveis de ambiente:');
  console.log('- SUPABASE_URL:', supabaseUrl || 'FALTANDO');
  console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? 'CONFIGURADO' : 'FALTANDO');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'CONFIGURADO' : 'FALTANDO');
}

export { db, supabase, supabaseAdmin, isSupabaseConnected };