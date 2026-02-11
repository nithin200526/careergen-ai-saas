const ApiError = require('../utils/ApiError');

/**
 * Validation Middleware Factory
 * Takes a Joi schema and returns middleware that validates req.body
 *
 * Usage: router.post('/route', validate(schema), controller);
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Return all errors, not just the first
        stripUnknown: true, // Remove unknown fields
    });

    if (error) {
        const messages = error.details.map((detail) => detail.message).join('. ');
        throw ApiError.badRequest(messages);
    }

    // Replace req.body with validated & sanitized value
    req.body = value;
    next();
};

module.exports = validate;
