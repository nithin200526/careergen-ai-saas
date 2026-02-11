const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const getLoggerMiddleware = require('./config/logger');
const errorHandler = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// ---------------------
// Security Middleware
// ---------------------

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        error: { message: 'Too many requests, please try again later.' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// ---------------------
// Body Parsing & Compression
// ---------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ---------------------
// Logging
// ---------------------
app.use(getLoggerMiddleware());

// ---------------------
// API Routes
// ---------------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: { message: `Route ${req.originalUrl} not found` },
    });
});

// ---------------------
// Global Error Handler
// ---------------------
app.use(errorHandler);

module.exports = app;
