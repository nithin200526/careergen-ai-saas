const Joi = require('joi');

/**
 * Resume Validation Schemas
 * All fields optional except title (create) and personalInfo.fullName
 */
const createResumeSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
        'string.min': 'Title is required',
        'any.required': 'Resume title is required',
    }),
    personalInfo: Joi.object({
        fullName: Joi.string().trim().max(100).allow(''),
        email: Joi.string().email().trim().allow(''),
        phone: Joi.string().trim().max(20).allow(''),
        location: Joi.string().trim().max(200).allow(''),
        linkedin: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
        portfolio: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
        github: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
    }).optional(),
    summary: Joi.string().trim().max(2000).allow('').optional(),
    education: Joi.array().items(Joi.object({
        institution: Joi.string().trim().max(200).allow(''),
        degree: Joi.string().trim().max(200).allow(''),
        field: Joi.string().trim().max(200).allow(''),
        location: Joi.string().trim().max(200).allow(''),
        startDate: Joi.string().trim().allow('').optional(),
        endDate: Joi.string().trim().allow('').optional(),
        gpa: Joi.string().trim().max(20).allow(''),
    })).optional(),
    technicalSkills: Joi.array().items(Joi.object({
        category: Joi.string().trim().max(100).allow(''),
        skills: Joi.string().trim().max(500).allow(''),
    })).optional(),
    internships: Joi.array().items(Joi.object({
        company: Joi.string().trim().max(200).allow(''),
        role: Joi.string().trim().max(200).allow(''),
        location: Joi.string().trim().max(200).allow(''),
        startDate: Joi.string().trim().allow('').optional(),
        endDate: Joi.string().trim().allow('').optional(),
        link: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
        description: Joi.string().trim().max(3000).allow(''),
    })).optional(),
    experience: Joi.array().items(Joi.object({
        company: Joi.string().trim().max(200).allow(''),
        position: Joi.string().trim().max(200).allow(''),
        location: Joi.string().trim().max(200).allow(''),
        startDate: Joi.string().trim().allow('').optional(),
        endDate: Joi.string().trim().allow('').optional(),
        current: Joi.boolean().default(false),
        description: Joi.string().trim().max(3000).allow(''),
    })).optional(),
    projects: Joi.array().items(Joi.object({
        name: Joi.string().trim().max(200).allow(''),
        link: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
        startDate: Joi.string().trim().allow('').optional(),
        endDate: Joi.string().trim().allow('').optional(),
        description: Joi.string().trim().max(3000).allow(''),
    })).optional(),
    skills: Joi.array().items(Joi.object({
        name: Joi.string().trim().max(100).allow(''),
        level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').default('intermediate'),
    })).optional(),
    certifications: Joi.array().items(Joi.object({
        name: Joi.string().trim().max(200).allow(''),
        issuer: Joi.string().trim().max(200).allow(''),
        date: Joi.string().trim().allow('').optional(),
        url: Joi.alternatives().try(Joi.string().uri(), Joi.string().allow('')).optional(),
    })).optional(),
    codingProfiles: Joi.array().items(Joi.object({
        platform: Joi.string().trim().max(100).allow(''),
        stats: Joi.string().trim().max(200).allow(''),
    })).optional(),
    leadership: Joi.array().items(Joi.object({
        title: Joi.string().trim().max(200).allow(''),
        description: Joi.string().trim().max(2000).allow(''),
    })).optional(),
    languages: Joi.array().items(Joi.object({
        name: Joi.string().trim().max(100).allow(''),
        proficiency: Joi.string().valid('basic', 'conversational', 'fluent', 'native').default('conversational'),
    })).optional(),
    templateId: Joi.string().trim().max(50).optional(),
    isPublic: Joi.boolean().optional(),
});

const updateResumeSchema = createResumeSchema.fork(
    ['title'],
    (field) => field.optional()
);

module.exports = {
    createResumeSchema,
    updateResumeSchema,
};
