import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from '@shared/schema';

// Configurações forçadas do Supabase
const supabaseUrl = 'https://ohbrxijpiowiciefuceg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYnJ4aWpwaW93aWNpZWZ1Y2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NjcwMzcsImV4cCI6MjA2NzM0MzAzN30.6CbzF2SYTkANhA1SX1XoENGaVpdv08UXmqRdNyjD4y4';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYnJ4aWpwaW93aWNpZWZ1Y2VnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTc2NzAzNywiZXhwIjoyMDY3MzQzMDM3fQ.ZT_fSXULoOlSRirDRvrdxN8CtPWAR9uu8a-qfbDEDc4';

// Variáveis sempre configuradas agora
let supabase: any = null;
let supabaseAdmin: any = null;
let db: ReturnType<typeof drizzle> | null = null;
let isSupabaseConnected = false;

// Forçar configuração do Supabase
if (true) {
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
}

export { db, supabase, supabaseAdmin, isSupabaseConnected };