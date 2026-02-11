const morgan = require('morgan');

/**
 * Configure Morgan HTTP request logger
 * - 'dev' format for development (colored, concise)
 * - 'combined' format for production (Apache-style)
 */
const getLoggerMiddleware = () => {
    const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    return morgan(format);
};

module.exports = getLoggerMiddleware;
