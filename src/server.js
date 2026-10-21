require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN === '*' ? '*' : process.env.CORS_ORIGIN?.split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'unavailable' }); }
});

app.get('/api/idols', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const conditions = [];
    const values = [];
    for (const key of ['country', 'group_name']) {
      if (req.query[key]) { values.push(String(req.query[key]).slice(0, 120)); conditions.push(`${key} ILIKE $${values.length}`); values[values.length - 1] = `%${values.at(-1)}%`; }
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const count = await pool.query(`SELECT COUNT(*) FROM idols ${where}`, values);
    values.push(limit, offset);
    const rows = await pool.query(`SELECT * FROM idols ${where} ORDER BY id LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
    res.json({ data: rows.rows, pagination: { total: Number(count.rows[0].count), limit, offset } });
  } catch (err) { next(err); }
});

app.get('/api/idols/:id', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'El id debe ser numérico' });
    const result = await pool.query('SELECT * FROM idols WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Idol no encontrado' });
    res.json({ data: result.rows[0] });
  } catch (err) { next(err); }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const port = Number(process.env.PORT) || 3000;
async function start() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf8');
    await pool.query(schema);
    app.listen(port, '0.0.0.0', () => console.log(`Idols API escuchando en puerto ${port}`));
  } catch (err) {
    console.error('No se pudo inicializar PostgreSQL:', err.message);
    process.exit(1);
  }
}
start();
