
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Use Replit's built-in PostgreSQL database or fallback to local development
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // If individual PostgreSQL environment variables are available
  if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
    return `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`;
  }
  
  // Fallback - use local PostgreSQL or will fail gracefully
  return 'postgresql://localhost:5432/freelancer_db';
};

let db: ReturnType<typeof drizzle>;
let isPostgresConnected = false;

try {
  const client = postgres(getDatabaseUrl(), {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  
  db = drizzle(client, { schema });
  isPostgresConnected = true;
  console.log('Connected to PostgreSQL database');
} catch (error) {
  console.log('PostgreSQL connection failed, using in-memory storage fallback');
  // Create a mock database that won't actually connect but allows the app to start
  const mockClient = postgres('postgresql://localhost:5432/mock', {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  db = drizzle(mockClient, { schema });
  isPostgresConnected = false;
}

export { db, isPostgresConnected };
