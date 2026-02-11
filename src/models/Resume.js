const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Resume title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        personalInfo: {
            fullName: { type: String, trim: true },
            email: { type: String, trim: true },
            phone: { type: String, trim: true },
            location: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            portfolio: { type: String, trim: true },
        },
        summary: {
            type: String,
            trim: true,
            maxlength: [2000, 'Summary cannot exceed 2000 characters'],
        },
        experience: [
            {
                company: { type: String, trim: true },
                position: { type: String, trim: true },
                startDate: { type: Date },
                endDate: { type: Date },
                current: { type: Boolean, default: false },
                description: { type: String, trim: true },
            },
        ],
        education: [
            {
                institution: { type: String, trim: true },
                degree: { type: String, trim: true },
                field: { type: String, trim: true },
                startDate: { type: Date },
                endDate: { type: Date },
                gpa: { type: String, trim: true },
            },
        ],
        skills: [
            {
                name: { type: String, trim: true },
                level: {
                    type: String,
                    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                    default: 'intermediate',
                },
            },
        ],
        certifications: [
            {
                name: { type: String, trim: true },
                issuer: { type: String, trim: true },
                date: { type: Date },
                url: { type: String, trim: true },
            },
        ],
        languages: [
            {
                name: { type: String, trim: true },
                proficiency: {
                    type: String,
                    enum: ['basic', 'conversational', 'fluent', 'native'],
                    default: 'conversational',
                },
            },
        ],
        templateId: {
            type: String,
            default: 'default',
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient user-based queries
resumeSchema.index({ user: 1, createdAt: -1 });

resumeSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('Resume', resumeSchema);
