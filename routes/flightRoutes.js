const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const createError = require('../utils/createError');
// Create a flight
router.post('/', async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all flights
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find().populate('travelerIds');
        if (!flight) {
            throw createError(404, 'Flight not found');
        }
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Traveler joins a flight
router.patch('/:flightId/join', async (req, res, next) => {
    try {
        const { travelerId } = req.body;

        const flight = await Flight.findById(req.params.flightId);
        if (!flight) {
            throw createError(404, 'Flight not found');
        }

        // prevent duplicate joins
        if (flight.travelerIds.includes(travelerId)) {
            throw createError(400, 'Traveler already joined this flight');
        }

        flight.travelerIds.push(travelerId);
        await flight.save();

        res.json({ success: true, flight });
    } catch (error) {
        next(error);
    }
});

// Get flights by departure/arrival/date
router.get('/search', async (req, res, next) => {
    try {
        const { from, to, date } = req.query;
        const query = {};

        if (from) query.departureAirport = from;
        if (to) query.arrivalAirport = to;
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1); // next day

            query.departureDate = { $gte: start, $lt: end };
        }

        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
