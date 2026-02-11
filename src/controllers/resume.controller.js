const resumeService = require('../services/resume.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new resume
 * @route   POST /api/v1/resumes
 * @access  Private
 */
const createResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.createResume(req.user._id, req.body);

    res.status(201).json({
        success: true,
        data: { resume },
    });
});

/**
 * @desc    Get all resumes for current user
 * @route   GET /api/v1/resumes
 * @access  Private
 */
const getResumes = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    const result = await resumeService.getUserResumes(req.user._id, {
        page,
        limit,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
});

/**
 * @desc    Get single resume by ID
 * @route   GET /api/v1/resumes/:id
 * @access  Private
 */
const getResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.getResumeById(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        data: { resume },
    });
});

/**
 * @desc    Update a resume
 * @route   PUT /api/v1/resumes/:id
 * @access  Private
 */
const updateResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.updateResume(
        req.params.id,
        req.user._id,
        req.body
    );

    res.status(200).json({
        success: true,
        data: { resume },
    });
});

/**
 * @desc    Delete a resume
 * @route   DELETE /api/v1/resumes/:id
 * @access  Private
 */
const deleteResume = asyncHandler(async (req, res) => {
    await resumeService.deleteResume(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        data: {},
        message: 'Resume deleted successfully',
    });
});

module.exports = {
    createResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
};
