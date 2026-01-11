const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('❌ MONGODB_URI is not defined in environment variables!');
            process.exit(1);
        }
        
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI exists:', !!mongoURI);
        console.log('MongoDB URI starts with:', mongoURI.substring(0, 20) + '...');
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB connected successfully');
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};
module.exports = connectDB;
