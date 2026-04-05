require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

async function seed() {
  console.log('Seeding users...');

  const users = [
    { name: 'Admin User', email: 'admin@finance.com', password: 'Admin@123', role: 'admin' },
    { name: 'Analyst User', email: 'analyst@finance.com', password: 'Analyst@123', role: 'analyst' },
    { name: 'Viewer User', email: 'viewer@finance.com', password: 'Viewer@123', role: 'viewer' },
  ];

  const insertedUsers = [];

  for (const user of users) {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [user.email]);
    if (existing.rows.length > 0) {
      console.log(`  Skipping existing user: ${user.email}`);
      insertedUsers.push(existing.rows[0]);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user.name, user.email, passwordHash, user.role]
    );
    insertedUsers.push(result.rows[0]);
    console.log(`  Created user: ${user.email} (${user.role})`);
  }

  const adminId = insertedUsers[0].id;

  console.log('Seeding transactions...');

  const transactions = [
    { user_id: adminId, amount: 5000.00, type: 'income',  category: 'Salary',      date: '2024-01-15', notes: 'January salary' },
    { user_id: adminId, amount: 1200.00, type: 'expense', category: 'Rent',         date: '2024-01-20', notes: 'Monthly rent' },
    { user_id: adminId, amount: 300.00,  type: 'expense', category: 'Groceries',    date: '2024-01-25', notes: 'Weekly groceries' },
    { user_id: adminId, amount: 5000.00, type: 'income',  category: 'Salary',      date: '2024-02-15', notes: 'February salary' },
    { user_id: adminId, amount: 150.00,  type: 'expense', category: 'Utilities',    date: '2024-02-18', notes: 'Electricity bill' },
    { user_id: adminId, amount: 800.00,  type: 'income',  category: 'Freelance',   date: '2024-02-22', notes: 'Web design project' },
    { user_id: adminId, amount: 250.00,  type: 'expense', category: 'Transport',   date: '2024-03-05', notes: 'Monthly commute pass' },
    { user_id: adminId, amount: 5000.00, type: 'income',  category: 'Salary',      date: '2024-03-15', notes: 'March salary' },
    { user_id: adminId, amount: 90.00,   type: 'expense', category: 'Subscriptions', date: '2024-03-20', notes: 'Streaming + cloud storage' },
    { user_id: adminId, amount: 1500.00, type: 'income',  category: 'Freelance',   date: '2024-03-28', notes: 'Mobile app consulting' },
  ];

  for (const tx of transactions) {
    await db.query(
      `INSERT INTO transactions (user_id, amount, type, category, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tx.user_id, tx.amount, tx.type, tx.category, tx.date, tx.notes || null]
    );
    console.log(`  Created transaction: ${tx.type} €${tx.amount} (${tx.category})`);
  }

  console.log('Seed completed successfully.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
