

import AppError from '../utils/AppError.js';

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Mongoose: duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field} already exists`, 409);
  }

  // Mongoose: invalid ObjectId
  if (err.name === 'CastError') {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    err = new AppError(messages.join('. '), 422);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') err = new AppError('Invalid token. Please log in again', 401);
  if (err.name === 'TokenExpiredError') err = new AppError('Token expired. Please log in again', 401);

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
