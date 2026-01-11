const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://daryna2003tk_db_user:<db_password>@configuratorcluaster.fyusirq.mongodb.net/configurator?retryWrites=true&w=majority';
        
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
        
        await mongoose.connect(mongoURI);
        
        console.log('✅ MongoDB connected successfully');
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
