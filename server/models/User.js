const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
    constructor({ email, password, name, googleId = null }) {
        this.userId = uuidv4();
        this.email = email;
        this.name = name;
        this.password = password; 
        this.googleId = googleId;
        this.isVerified = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }


    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

   
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

   
    toJSON() {
        const userObject = { ...this };
        delete userObject.password;
        return userObject;
    }
}

module.exports = User;
