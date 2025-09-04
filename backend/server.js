import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true }
};

app.get('/api/requests', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM requests`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('✅ API Server running on port 3000'));
