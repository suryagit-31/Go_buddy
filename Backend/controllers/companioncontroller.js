import CompanionRequest from "../models/CompanionRequest.model.js";
import mongoose from "mongoose";
import { HelperRequest } from "../models/Helper.model.js";
import { HelpSeekerRequest } from "../models/Helpseekers.model.js";

export const createCompanion = (req, res) => {
  console.log(req.body);
  const companion = req.body;
  try {
    if (companion.passenger_role == "helper") {
      const helper = new HelperRequest(companion);
      const companionRequest = helper.save();
      return res.status(201).json(companionRequest);
    } else if (companion.passenger_role == "seeker") {
      const helpseeker = new HelpSeekerRequest(companion);
      const companionRequest = helpseeker.save();
      return res.status(201).json(companionRequest);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOtherCompanions = async (req, res) => {
  try {
    const { flight_date, flight_iata } = req.params;
    try {
      const [helpers, seekers] = await Promise.all([
        HelperRequest.find({ flight_iata, flight_date }),
        HelpSeekerRequest.find({ flight_iata, flight_date }),
      ]);

      // Combine both into one array (if needed)
      const allCompanions = [...helpers, ...seekers];

      res.status(200).json(allCompanions);
    } catch (err) {
      console.error("Error fetching companions:", err);
      res.status(500).json({ message: "Error fetching companions" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
