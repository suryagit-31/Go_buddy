import express from "express";
import CompanionRequest from "../models/CompanionRequest.model.js";
import {
  createCompanion,
  getOtherCompanions,
} from "../controllers/companioncontroller.js";

const router = express.Router();

// Create a companion request
router.post("/", createCompanion);

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

router.get("/:flight_iata/:flight_date", getOtherCompanions);


export default router;
