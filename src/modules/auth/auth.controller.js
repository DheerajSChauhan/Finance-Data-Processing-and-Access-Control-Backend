const { register, login } = require('./auth.service');
const { success } = require('../../utils/response');

async function registerUser(req, res, next) {
  try {
    const user = await register(req.body);
    return success(res, user, 201);
  } catch (error) {
    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const result = await login(req.body);
    return success(res, result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { registerUser, loginUser };