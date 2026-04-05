require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const transactionsRoutes = require('./modules/transactions/transactions.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const { failure } = require('./utils/response');
const { AppError } = require('./utils/errors');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  return failure(res, 'Route not found', [], 404);
});

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return failure(res, error.message, error.errors, error.status);
  }

  if (error?.status) {
    return failure(res, error.message || 'Request failed', error.errors || [], error.status);
  }

  console.error(error);
  return failure(res, 'Internal server error', [], 500);
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;