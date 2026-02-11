require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start server
 * 1. Connect to MongoDB
 * 2. Start Express server
 * 3. Handle unhandled rejections & uncaught exceptions
 */
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start listening
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error(`❌ Unhandled Rejection: ${err.message}`);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error(`❌ Uncaught Exception: ${err.message}`);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('💤 Process terminated.');
            });
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
