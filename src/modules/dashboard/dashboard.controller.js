const { success } = require('../../utils/response');
const { summary, byCategory, trends, recent } = require('./dashboard.service');

async function summaryHandler(req, res, next) {
  try {
    return success(res, await summary());
  } catch (error) {
    return next(error);
  }
}

async function byCategoryHandler(req, res, next) {
  try {
    return success(res, await byCategory());
  } catch (error) {
    return next(error);
  }
}

async function trendsHandler(req, res, next) {
  try {
    return success(res, await trends());
  } catch (error) {
    return next(error);
  }
}

async function recentHandler(req, res, next) {
  try {
    return success(res, await recent());
  } catch (error) {
    return next(error);
  }
}

module.exports = { summaryHandler, byCategoryHandler, trendsHandler, recentHandler };