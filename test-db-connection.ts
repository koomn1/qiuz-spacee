import pkg from 'pg';
const { Client } = pkg;

async function run() {
  console.log("Connecting to diagnose database...");
  const client = new Client({
    host: "ep-ancient-unit-ata8emu6-pooler.c-9.us-east-1.aws.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_OPDjcFI7GUY8",
    database: "neondb",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully!\n");
    
    // Get all tables
    const tablesQuery = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
    `);
    const tables = tablesQuery.rows.map(r => r.table_name);
    
    for (const table of tables) {
      // Get row count
      const countRes = await client.query(`SELECT COUNT(*) as cnt FROM "${table}"`);
      const count = countRes.rows[0].cnt;
      
      // Get columns
      const colsRes = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      const cols = colsRes.rows.map(r => r.column_name);
      
      console.log(`📊 ${table}: ${count} rows | Columns: ${cols.join(', ')}`);
    }
    
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await client.end();
  }
}

run();

