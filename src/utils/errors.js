class AppError extends Error {
  constructor(message, status = 500, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors = []) {
    super(message, 400, errors);
  }
}

module.exports = { AppError, NotFoundError, BadRequestError };