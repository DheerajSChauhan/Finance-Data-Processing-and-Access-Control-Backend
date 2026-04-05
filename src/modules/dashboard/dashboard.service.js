const db = require('../../config/db');

async function summary() {
  const result = await db.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance
     FROM transactions
     WHERE is_deleted = false`
  );

  return result.rows[0];
}

async function byCategory() {
  const result = await db.query(
    `SELECT category, SUM(amount) AS total
     FROM transactions
     WHERE is_deleted = false
     GROUP BY category
     ORDER BY total DESC, category ASC`
  );
  return result.rows;
}

async function trends() {
  const result = await db.query(
    `SELECT
       TO_CHAR(date, 'YYYY-MM') AS month,
       type,
       SUM(amount) AS total
     FROM transactions
     WHERE is_deleted = false AND date >= NOW() - INTERVAL '6 months'
     GROUP BY month, type
     ORDER BY month ASC, type ASC`
  );
  return result.rows;
}

async function recent() {
  const result = await db.query(
    `SELECT id, user_id, amount, type, category, date, notes, created_at, updated_at
     FROM transactions
     WHERE is_deleted = false
     ORDER BY date DESC, created_at DESC
     LIMIT 10`
  );
  return result.rows;
}

module.exports = { summary, byCategory, trends, recent };