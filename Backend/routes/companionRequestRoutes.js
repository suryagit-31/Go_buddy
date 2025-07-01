import express from "express";
import CompanionRequest from "../models/CompanionRequest.js";

const router = express.Router();

// Create a companion request
router.post("/", async (req, res) => {
  try {
    console.log(
      "🚀 ~ file: companionRequestRoutes.js:18 ~ router.post ~ req.body:",
      req.body
    );
    const companionRequest = new CompanionRequest(req.body);
    await companionRequest.save();
    res.status(201).json(companionRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get companion requests (optional: filter by flightId or userId)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.flightId) filter.flightId = req.query.flightId;
    if (req.query.userId) filter.userId = req.query.userId;

    const companionRequests = await CompanionRequest.find(filter)
      .populate("flightId")
      .populate("userId");

    res.json(companionRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update request status (accept or decline)
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const companionRequest = await CompanionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(companionRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find companions for a specific flight
router.get("/flight/:flightId", async (req, res, next) => {
  try {
    const companions = await CompanionRequest.find({
      flightId: req.params.flightId,
      status: "accepted",
    }).populate("userId");

    res.json(companions);
  } catch (error) {
    next(error);
  }
});

export default router;
