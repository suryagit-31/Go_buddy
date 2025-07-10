import express from "express";
import CompanionRequest from "../models/CompanionRequest.model.js";
import { createCompanion , getOtherCompanions} from "../controllers/companioncontroller.js";

const router = express.Router();

// Create a companion request
router.post("/", createCompanion);
router.get("/:flight_iata/:flight_date", getOtherCompanions);

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
