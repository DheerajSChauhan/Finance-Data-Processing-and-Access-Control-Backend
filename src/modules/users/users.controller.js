const { success } = require('../../utils/response');
const { NotFoundError } = require('../../utils/errors');
const {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
} = require('./users.service');

async function index(req, res, next) {
  try {
    return success(res, await listUsers());
  } catch (error) {
    return next(error);
  }
}

async function show(req, res, next) {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return success(res, user);
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    return success(res, await createUser(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return success(res, user);
  } catch (error) {
    return next(error);
  }
}

async function destroy(req, res, next) {
  try {
    const user = await deactivateUser(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return success(res, user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { index, show, store, update, destroy };