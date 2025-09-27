const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL');
    await client.query('SELECT inet_server_addr() AS us');
    
    console.log('✅ Database is responding');
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
  } finally {
    // Close pool
    await pool.end();
  }
}

// Run test if file is executed directly
if (require.main === module) {
  testConnection();
}

module.exports = pool;