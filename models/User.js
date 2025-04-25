const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    role: String, // traveler or family
    age: Number,
    phone: String,
    email: String,
    language: String,
    location: String,
    profileImage: String,
    createdBy: mongoose.Types.ObjectId,
    verified: Boolean
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
