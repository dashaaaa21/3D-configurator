const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        default: () => require('uuid').v4()
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function() {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
});
userSchema.methods.comparePassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};
userSchema.statics.hashPassword = async function(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
