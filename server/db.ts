
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

if (!process.env.SUPABASE_DB_URL) {
  throw new Error("SUPABASE_DB_URL environment variable is required");
}

const client = postgres(process.env.SUPABASE_DB_URL);
export const db = drizzle(client, { schema });
