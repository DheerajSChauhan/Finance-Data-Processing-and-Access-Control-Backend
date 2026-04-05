const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { AppError } = require('../../utils/errors');

async function listUsers() {
  const result = await db.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
}

async function getUser(id) {
  const result = await db.query(
    `SELECT id, name, email, role, is_active, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function createUser({ name, email, password, role }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('Email already in use', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
}

async function updateUser(id, { name, role, is_active }) {
  const result = await db.query(
    `UPDATE users
     SET name = COALESCE($2, name),
         role = COALESCE($3, role),
         is_active = COALESCE($4, is_active)
     WHERE id = $1
     RETURNING id, name, email, role, is_active, created_at`,
    [id, name ?? null, role ?? null, typeof is_active === 'boolean' ? is_active : null]
  );
  return result.rows[0] || null;
}

async function deactivateUser(id) {
  const result = await db.query(
    `UPDATE users
     SET is_active = false
     WHERE id = $1
     RETURNING id, name, email, role, is_active, created_at`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { listUsers, getUser, createUser, updateUser, deactivateUser };