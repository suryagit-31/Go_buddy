const mongoose = require('mongoose');

const companionRequestSchema = new mongoose.Schema({
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: "" },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CompanionRequest', companionRequestSchema);
