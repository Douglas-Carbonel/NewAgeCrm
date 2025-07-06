
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '@shared/schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');

// Run migrations on startup
try {
  migrate(db, { migrationsFolder: 'drizzle' });
} catch (error) {
  console.log('Migration error (this is normal on first run):', error);
}
