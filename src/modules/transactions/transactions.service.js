const db = require('../../config/db');

function buildFilters({ type, category, from, to }) {
  const clauses = ['is_deleted = false'];
  const values = [];

  if (type) {
    values.push(type);
    clauses.push(`type = $${values.length}`);
  }

  if (category) {
    values.push(category);
    clauses.push(`category ILIKE $${values.length}`);
  }

  if (from) {
    values.push(from);
    clauses.push(`date >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    clauses.push(`date <= $${values.length}`);
  }

  return { clauses, values };
}

async function listTransactions(filters) {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;
  const { clauses, values } = buildFilters(filters);

  const whereClause = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const queryValues = [...values, limit, offset];

  const result = await db.query(
    `SELECT id, user_id, amount, type, category, date, notes, is_deleted, created_at, updated_at
     FROM transactions
     ${whereClause}
     ORDER BY date DESC, created_at DESC
     LIMIT $${queryValues.length - 1} OFFSET $${queryValues.length}`,
    queryValues
  );

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM transactions
     ${whereClause}`,
    values
  );

  return {
    items: result.rows,
    pagination: {
      page,
      limit,
      total: countResult.rows[0].total,
    },
  };
}

async function getTransaction(id) {
  const result = await db.query(
    `SELECT id, user_id, amount, type, category, date, notes, is_deleted, created_at, updated_at
     FROM transactions
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function createTransaction(data) {
  const result = await db.query(
    `INSERT INTO transactions (user_id, amount, type, category, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, amount, type, category, date, notes, is_deleted, created_at, updated_at`,
    [data.user_id || null, data.amount, data.type, data.category, data.date, data.notes || null]
  );
  return result.rows[0];
}

async function updateTransaction(id, data) {
  const result = await db.query(
    `UPDATE transactions
     SET user_id = COALESCE($2, user_id),
         amount = COALESCE($3, amount),
         type = COALESCE($4, type),
         category = COALESCE($5, category),
         date = COALESCE($6, date),
         notes = COALESCE($7, notes),
         updated_at = NOW()
     WHERE id = $1 AND is_deleted = false
     RETURNING id, user_id, amount, type, category, date, notes, is_deleted, created_at, updated_at`,
    [
      id,
      data.user_id ?? null,
      data.amount ?? null,
      data.type ?? null,
      data.category ?? null,
      data.date ?? null,
      data.notes ?? null,
    ]
  );
  return result.rows[0] || null;
}

async function deleteTransaction(id) {
  const result = await db.query(
    `UPDATE transactions
     SET is_deleted = true,
         updated_at = NOW()
     WHERE id = $1 AND is_deleted = false
     RETURNING id, user_id, amount, type, category, date, notes, is_deleted, created_at, updated_at`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { listTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction };