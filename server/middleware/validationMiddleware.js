const { body, validationResult } = require('express-validator');


const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Email is not valid')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password needs 8 characters minimum')
        .matches(/[a-z]/)
        .withMessage('Password needs one small letter')
        .matches(/[A-Z]/)
        .withMessage('Password needs one big letter')
        .matches(/[0-9]/)
        .withMessage('Password needs one number'),
    
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2 to 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only have English letters and spaces')
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
