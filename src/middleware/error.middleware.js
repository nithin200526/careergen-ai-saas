const ApiError = require('../utils/ApiError');

/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the app and sends a uniform JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(', ');
        error = ApiError.conflict(`Duplicate value for field: ${field}`);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        error = ApiError.badRequest(messages.join('. '));
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = ApiError.unauthorized('Invalid token.');
    }

    if (err.name === 'TokenExpiredError') {
        error = ApiError.unauthorized('Token has expired.');
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
    });
};

module.exports = errorHandler;
