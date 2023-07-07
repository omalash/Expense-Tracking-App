const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    refreshToken: String,
    verificationToken: String
});

module.exports = mongoose.model('User', userSchema);