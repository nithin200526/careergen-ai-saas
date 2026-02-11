const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const { user, token } = await authService.register({ name, email, password });

    res.status(201).json({
        success: true,
        data: {
            user,
            token,
        },
    });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await authService.login({ email, password });

    res.status(200).json({
        success: true,
        data: {
            user,
            token,
        },
    });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);

    res.status(200).json({
        success: true,
        data: { user },
    });
});

module.exports = {
    register,
    login,
    getMe,
};
