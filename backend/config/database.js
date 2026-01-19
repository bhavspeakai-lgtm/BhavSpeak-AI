import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Supabase connection configuration
const pool = new Pool({
  host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST,
  port: process.env.SUPABASE_DB_PORT || process.env.DB_PORT || 5432,
  database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME,
  user: process.env.SUPABASE_DB_USER || process.env.DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD,
  ssl: process.env.SUPABASE_DB_HOST ? {
    rejectUnauthorized: false // Required for Supabase
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
  if (process.env.SUPABASE_DB_HOST) {
    console.log('📦 Connected to Supabase');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

