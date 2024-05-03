import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.USER)
const pool = new pg.Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
  });
  
  try {
    const { rows } = await pool.query('SELECT * FROM position');
    console.log(rows)
  } catch (err) {
    console.error(err);
  }
