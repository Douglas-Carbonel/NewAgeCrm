
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from '@shared/schema';

// Supabase client for direct operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are required");
}

// Create Supabase clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database connection for Drizzle ORM
const getDatabaseUrl = () => {
  const url = new URL(supabaseUrl);
  const host = url.hostname;
  const projectId = host.split('.')[0];
  
  return `postgresql://postgres.${projectId}:${supabaseServiceKey}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;
};

let db: ReturnType<typeof drizzle>;
let isSupabaseConnected = false;

try {
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
  throw error;
}

export { db, isSupabaseConnected };
