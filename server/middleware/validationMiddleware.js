const { body, validationResult } = require('express-validator');
const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Email is not valid')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password needs 6 characters minimum'),
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2 to 50 characters')
];
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Email is not valid')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];
const handleValidationErrors = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            success: false,
            message: 'Check your data',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};
module.exports = {
    validateRegistration,
    validateLogin,
    handleValidationErrors
};
