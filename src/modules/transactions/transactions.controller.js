const { success } = require('../../utils/response');
const { NotFoundError } = require('../../utils/errors');
const {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('./transactions.service');

async function index(req, res, next) {
  try {
    return success(res, await listTransactions(req.query));
  } catch (error) {
    return next(error);
  }
}

async function show(req, res, next) {
  try {
    const transaction = await getTransaction(req.params.id);
    if (!transaction || transaction.is_deleted) {
      throw new NotFoundError('Transaction not found');
    }
    return success(res, transaction);
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    return success(res, await createTransaction(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const transaction = await updateTransaction(req.params.id, req.body);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    return success(res, transaction);
  } catch (error) {
    return next(error);
  }
}

async function destroy(req, res, next) {
  try {
    const transaction = await deleteTransaction(req.params.id);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    return success(res, transaction);
  } catch (error) {
    return next(error);
  }
}

module.exports = { index, show, store, update, destroy };