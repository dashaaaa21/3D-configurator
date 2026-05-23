const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI чат доступний без авторизації
router.post('/chat', aiController.colorStyleChat);

module.exports = router;
