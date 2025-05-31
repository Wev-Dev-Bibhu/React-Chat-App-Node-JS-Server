require('dotenv').config();
const { Pool } = require('pg');
const isSSL = process.env.DB_SSL === 'true';


const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_CATCHWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (query, params) => pool.query(query, params),
};