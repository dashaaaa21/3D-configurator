const User = require('../models/User');
const database = require('../config/database');
const { generateToken } = require('../utils/jwtUtils');
const { days } = require('../utils/timeHelper');


const register = async (request, response) => {
    try {
        const { email, password, name } = request.body;
        
       
        const existingUser = database.findUserByEmail(email);
        if (existingUser) {
            return response.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
    
        const hashedPassword = await User.hashPassword(password);
        
     
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });
        
      
        database.createUser(newUser);
        
  
        const token = generateToken(newUser.userId);
        
     
        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: days(7)
        });
        
        return response.status(201).json({
            success: true,
            message: 'Registration successful',
            user: newUser.toJSON(),
            token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        return response.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Вхід користувача
const login = async (request, response) => {
    try {
        const { email, password, remember } = request.body;
        
        // Пошук користувача
        const user = database.findUserByEmail(email);
        if (!user) {
            return response.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Перевірка паролю
        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
       
        const token = generateToken(user.userId);
        
        const cookieTime = remember ? days(30) : days(7);
        
        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: cookieTime
        });
        
        return response.status(200).json({
            success: true,
            message: 'Login successful',
            user: user.toJSON(),
            token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return response.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Вихід користувача
const logout = (request, response) => {
    try {
        response.clearCookie('token');
        return response.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return response.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

// Отримання поточного користувача
const getCurrentUser = (request, response) => {
    try {
        return response.status(200).json({
            success: true,
            user: request.user.toJSON()
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return response.status(500).json({
            success: false,
            message: 'Failed to get user data',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};
