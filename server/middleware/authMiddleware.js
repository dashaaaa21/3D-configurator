const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');
const authenticateUser = async (request, response, next) => {
    try {
        const token = request.cookies.token || request.headers.authorization?.split(' ')[1];
        if (!token) {
            return response.status(401).json({
                success: false,
                message: 'You need to login first'
            });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return response.status(401).json({
                success: false,
                message: 'Token is not valid. Please login again'
            });
        }
        const user = await User.findOne({ userId: decoded.userId });
        if (!user) {
            return response.status(401).json({
                success: false,
                message: 'User not found. Please login again'
            });
        }
        request.user = user;
        next();
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: 'Login check failed',
            error: error.message
        });
    }
};
module.exports = {
    authenticateUser
};
