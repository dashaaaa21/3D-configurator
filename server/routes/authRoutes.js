const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
    validateRegistration, 
    validateLogin, 
    handleValidationErrors 
} = require('../middleware/validationMiddleware');
const { authenticateUser } = require('../middleware/authMiddleware');
router.post(
    '/register', 
    validateRegistration, 
    handleValidationErrors, 
    authController.register
);
router.post(
    '/login', 
    validateLogin, 
    handleValidationErrors, 
    authController.login
);
router.post('/logout', authenticateUser, authController.logout);
router.get('/me', authenticateUser, authController.getCurrentUser);
module.exports = router;
