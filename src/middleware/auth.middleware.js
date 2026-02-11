const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authentication Middleware
 * Extracts JWT from Authorization header, verifies it,
 * and attaches the user object to req.user
 */
const auth = asyncHandler(async (req, res, next) => {
    let token;

    // Extract token from "Bearer <token>" format
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw ApiError.unauthorized('Access denied. No token provided.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (exclude password)
        const user = await User.findById(decoded.id);
        if (!user) {
            throw ApiError.unauthorized('User belonging to this token no longer exists.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw ApiError.unauthorized('Invalid or expired token.');
    }
});

/**
 * Role-based Authorization Middleware
 * Restricts access to specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden('You do not have permission to perform this action.');
        }
        next();
    };
};

module.exports = { auth, authorize };
