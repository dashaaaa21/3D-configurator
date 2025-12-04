// Завантажуємо .env якщо він є (опціонально)
try {
    require('dotenv').config({ path: './.env' });
} catch (error) {
    console.log('No .env file found, using default values');
}

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!process.env.JWT_SECRET) process.env.JWT_SECRET = JWT_SECRET;
if (!process.env.JWT_EXPIRE) process.env.JWT_EXPIRE = JWT_EXPIRE;
if (!process.env.NODE_ENV) process.env.NODE_ENV = NODE_ENV;

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API роути
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler для API
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.use(express.static(path.join(__dirname, '../dist')));


app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
        next();
    }
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    if (!process.env.PORT) {
        console.log(' Using default port 3000 (no .env file)');
    }
    console.log('\n Server ready to accept connections!\n');
});

// Обробка помилок сервера
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(` Port ${PORT} is already in use`);
        console.log(' Try using a different port or stop the other process');
        process.exit(1);
    } else {
        console.error(' Server error:', error);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n SIGTERM received, closing server gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n SIGINT received, closing server gracefully...');
    server.close(() => {
        console.log(' Server closed');
        process.exit(0);
    });
});

// Обробка необроблених помилок
process.on('uncaughtException', (error) => {
    console.error(' Uncaught Exception:', error);
    console.log(' Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('Server will continue running...');
});

module.exports = app;
