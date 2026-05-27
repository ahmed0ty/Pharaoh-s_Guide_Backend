import { ApiResponse } from '../utils/apiResponse.util.js';

// Not found handler — يتحط قبل الـ global error handler
export const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message || 'Internal Server Error';
  let errors     = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = 'Validation failed';
    errors     = Object.values(err.errors).map((e) => ({
      field  : e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired'; }

  // في الـ dev اطبع الـ stack
  if (process.env.NODE_ENV === 'development') {
    console.error('💥', err.stack);
  }

  return ApiResponse.error(res, message, statusCode, errors);
};