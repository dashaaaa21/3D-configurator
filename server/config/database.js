const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://daryna2003tk_db_user:<db_password>@configuratorcluaster.fyusirq.mongodb.net/configurator?retryWrites=true&w=majority';
        await mongoose.connect(mongoURI);
        mongoose.connection.on('error', (err) => {
        });
        mongoose.connection.on('disconnected', () => {
        });
    } catch (error) {
        process.exit(1);
    }
};
module.exports = connectDB;
