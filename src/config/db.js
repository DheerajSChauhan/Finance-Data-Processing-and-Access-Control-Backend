const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

function ensurePool() {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }

  return pool;
}

module.exports = {
  query(text, params) {
    return ensurePool().query(text, params);
  },
  connect() {
    return ensurePool().connect();
  },
};