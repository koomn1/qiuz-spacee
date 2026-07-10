import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.ts';

// Function to create a new connection pool using the Object Method.
export const createPool = () => {
  const useSsl = process.env.SQL_SSL === 'true';
  console.log("DB connection initializing with host:", process.env.SQL_HOST, "user:", process.env.SQL_USER, "ssl:", useSsl);

  return new Pool({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 20000,       // Close idle clients after 20s (Neon closes them anyway)
    max: 5,                          // Limit pool size for Neon serverless
    allowExitOnIdle: true,           // Allow pool to close when all clients are idle
  });
};

// Create the pool instance.
const pool = createPool();

// Prevent unhandled pool-level errors from crashing the application.
pool.on('error', (err: any) => {
  const msg = err.message || '';
  if (msg.includes('terminating connection due to administrator command') ||
      msg.includes('Connection terminated') ||
      msg.includes('Connection terminated unexpectedly') ||
      msg.includes('connection timeout') ||
      err.code === 'ECONNRESET' || err.code === 'EPIPE') {
    console.warn('Database pool idle connection closed (Neon scale-to-zero):', msg);
    return; // Ignore scale-to-zero idle connection terminations
  }
  console.error('Unexpected error on idle SQL pool client:', err);
});

// Capture and gracefully handle client-level errors when clients connect,
// preventing unhandled socket-level errors (such as EPIPE or ECONNRESET) from crashing the server.
pool.on('connect', (client: any) => {
  client.on('error', (err: any) => {
    // Gracefully capture EPIPE/ECONNRESET or other socket failures on active or disconnecting clients
    if (err.code === 'EPIPE' || err.code === 'ECONNRESET') {
      console.warn('Database socket error handled gracefully:', err.message);
      return;
    }
    console.error('Database client error:', err);
  });
});

// Initialize Drizzle with the pool and structured schema.
export const db = drizzle(pool, { schema });
