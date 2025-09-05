import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('backend/pass.env') });

const app = express();
app.use(cors());
app.use(express.json()); // รองรับ JSON body

// สร้าง connection pool หนึ่งครั้ง
const pool = new sql.ConnectionPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
});

const poolConnect = pool.connect().catch(err => {
  console.error('❌ Initial DB connection failed:', err);
});

// API route
app.get('/api/requests', async (req, res) => {
  try {
    await poolConnect; // รอให้ pool พร้อม
    const result = await pool.request()
      .query('SELECT TOP 10 Name FROM HIS_MASTER_CLOSEVISIT');

    console.log('✅ Query success:', result.recordset.length, 'rows');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Query error:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
