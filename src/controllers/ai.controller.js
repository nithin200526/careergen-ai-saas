const aiService = require('../services/ai.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Generate a professional summary using AI
 * @route   POST /api/v1/ai/generate-summary
 * @access  Private
 */
const generateSummary = asyncHandler(async (req, res) => {
    const { jobTitle, experience, skills, tone } = req.body;

    const summary = await aiService.generateSummary({
        jobTitle,
        experience,
        skills,
        tone,
    });

    res.status(200).json({
        success: true,
        data: { summary },
    });
});

module.exports = {
    generateSummary,
};
