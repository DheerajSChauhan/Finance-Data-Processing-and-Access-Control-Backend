function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function failure(res, message, errors = [], status = 400) {
  return res.status(status).json({ success: false, message, errors });
}

module.exports = { success, failure };