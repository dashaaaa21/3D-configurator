try {
    require('dotenv').config({ path: __dirname + '/.env' });
} catch (error) {
}
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const VERCEL_URLS = [
    'https://3-d-configurator-omega.vercel.app',
    'https://3-d-configurator-rnhxlyau0-dashas-projects-fa234119.vercel.app',
    'https://3-d-configurator-8gloxxtlu-dashas-projects-fa234119.vercel.app'
];
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = JWT_SECRET;
if (!process.env.JWT_EXPIRE) process.env.JWT_EXPIRE = JWT_EXPIRE;
if (!process.env.NODE_ENV) process.env.NODE_ENV = NODE_ENV;
connectDB();
app.use(cors({
    origin: [FRONTEND_URL, ...VERCEL_URLS],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
app.use((err, req, res, next) => {
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
    if (!process.env.PORT) {
    }
});
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        process.exit(1);
    } else {
        process.exit(1);
    }
});
process.on('SIGTERM', () => {
    server.close(() => {
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    server.close(() => {
        process.exit(0);
    });
});
process.on('uncaughtException', (error) => {
});
process.on('unhandledRejection', (reason, promise) => {
});
module.exports = app;
