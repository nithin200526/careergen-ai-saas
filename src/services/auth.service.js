const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - { name, email, password }
     * @returns {Object} - { user, token }
     */
    async register({ name, email, password }) {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw ApiError.conflict('Email already registered');
        }

        // Create user (password hashed via pre-save hook)
        const user = await User.create({ name, email, password });

        // Generate JWT
        const token = this.generateToken(user._id);

        return { user, token };
    }

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Object} - { user, token }
     */
    async login({ email, password }) {
        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Generate JWT
        const token = this.generateToken(user._id);

        return { user, token };
    }

    /**
     * Get current user profile
     * @param {String} userId
     * @returns {Object} user
     */
    async getProfile(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }
        return user;
    }

    /**
     * Generate JWT token
     * @param {String} userId
     * @returns {String} token
     */
    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
    }
}

module.exports = new AuthService();
