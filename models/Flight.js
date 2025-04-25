const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: String,
    departureAirport: String,
    arrivalAirport: String,
    departureDate: Date,
    airline: String,
    travelerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Flight', flightSchema);
