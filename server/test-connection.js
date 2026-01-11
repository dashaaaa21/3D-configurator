require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const testConnection = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI || mongoURI.includes('<db_password>')) {
            process.exit(1);
        }
        await mongoose.connect(mongoURI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(col => {
        });
        if (collections.length === 0) {
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        if (error.message.includes('bad auth')) {
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
        }
        process.exit(1);
    }
};
testConnection();
