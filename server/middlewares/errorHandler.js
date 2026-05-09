import AppError from "../utils/AppError.js";
import logger from "../configs/logger.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field} already exists`, 409);
  }

  // Mongoose: invalid ObjectId
  if (err.name === "CastError") {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose: validation failed
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new AppError(messages.join(". "), 422);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") err = new AppError("Invalid token. Please log in again", 401);
  if (err.name === "TokenExpiredError") err = new AppError("Token expired. Please log in again", 401);

  //  Log based on error type
  if (err.isOperational) {
    // Expected errors — just a warning
    logger.warn(`${err.statusCode} ${err.status.toUpperCase()} - ${err.message} | ${req.method} ${req.originalUrl}`);
  } else {
    // Unexpected bugs — full stack, needs attention
    logger.error(`UNHANDLED ERROR - ${err.message} | ${req.method} ${req.originalUrl}`, {
      stack: err.stack,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
