const Resume = require('../models/Resume');
const ApiError = require('../utils/ApiError');

class ResumeService {
    /**
     * Create a new resume
     * @param {String} userId - Owner's user ID
     * @param {Object} resumeData - Resume fields
     * @returns {Object} resume
     */
    async createResume(userId, resumeData) {
        const resume = await Resume.create({
            ...resumeData,
            user: userId,
        });
        return resume;
    }

    /**
     * Get all resumes for a user
     * @param {String} userId
     * @param {Object} query - Pagination params { page, limit }
     * @returns {Object} - { resumes, total, page, pages }
     */
    async getUserResumes(userId, { page = 1, limit = 10 } = {}) {
        const skip = (page - 1) * limit;

        const [resumes, total] = await Promise.all([
            Resume.find({ user: userId })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Resume.countDocuments({ user: userId }),
        ]);

        return {
            resumes,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        };
    }

    /**
     * Get a single resume by ID (with ownership check)
     * @param {String} resumeId
     * @param {String} userId
     * @returns {Object} resume
     */
    async getResumeById(resumeId, userId) {
        const resume = await Resume.findOne({ _id: resumeId, user: userId });
        if (!resume) {
            throw ApiError.notFound('Resume not found');
        }
        return resume;
    }

    /**
     * Update a resume (with ownership check)
     * @param {String} resumeId
     * @param {String} userId
     * @param {Object} updateData
     * @returns {Object} updated resume
     */
    async updateResume(resumeId, userId, updateData) {
        const resume = await Resume.findOneAndUpdate(
            { _id: resumeId, user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!resume) {
            throw ApiError.notFound('Resume not found');
        }

        return resume;
    }

    /**
     * Delete a resume (with ownership check)
     * @param {String} resumeId
     * @param {String} userId
     * @returns {Object} deleted resume
     */
    async deleteResume(resumeId, userId) {
        const resume = await Resume.findOneAndDelete({
            _id: resumeId,
            user: userId,
        });

        if (!resume) {
            throw ApiError.notFound('Resume not found');
        }

        return resume;
    }
}

module.exports = new ResumeService();
