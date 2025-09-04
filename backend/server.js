import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/pass.env' }); // โหลด .env จาก path ที่ระบุ

const app = express();
app.use(cors());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

app.get('/api/requests', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT TOP 10 Name FROM HIS_DATA_HNEMPLOYEE ORDER BY Name`;
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ SQL Error:', err);
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('✅ API Server running on port 3000'));
