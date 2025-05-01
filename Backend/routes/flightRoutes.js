import express from "express";
import { fetchFlightsByRouteAndDate } from "../controllers/flightcontroller.js";

const router = express.Router();

router.post("/", fetchFlightsByRouteAndDate);

export default router;
