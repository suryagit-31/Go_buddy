import express from "express";
import {
  fetchFlightsByRouteAndDate,
  fetchflightby_iata_and_Date,
} from "../controllers/flightcontroller.js";

const router = express.Router();

router.post("/", fetchFlightsByRouteAndDate);
router.get("/flightjoin/:iata/:date", fetchflightby_iata_and_Date);

export default router;
