import getFlightsByRouteAndDate from "./../services/aviationservice.js";
import getflightby_iata_and_Date from "./../services/aviationiata.js";

export async function fetchFlightsByRouteAndDate(req, res) {
  try {
    const { dep_iata, arr_iata, flight_date } = req.body;
    console.log(dep_iata, arr_iata, flight_date);

    if (!dep_iata) {
      return res
        .status(400)
        .json({ error: "dep_iata, arr_iata, are required" });
    }

    const data = await getFlightsByRouteAndDate(
      dep_iata,
      arr_iata,
      flight_date
    );
    // console.log("📦 Controller - response of Data:", data);

    res.json(data);
  } catch (error) {
    console.error("surya we got error Error fetching flights:", error);
    res.status(500).json({ error: "surya Failed to fetch flights" });
  }
}

export async function fetchflightby_iata_and_Date(req, res) {
  try {
    const { flight_iata, flight_date } = req.params;
    console.log(flight_iata, flight_date);

    if (!flight_iata) {
      return res.status(400).json({ error: "flight_iata is required" });
    }

    const data = await getflightby_iata_and_Date(flight_iata, flight_date);
    console.log("📦 Controller - response of Data:", data);
    res.json(data);
  } catch (error) {
    console.error("surya we got error Error fetching flights:", error);
    res.status(500).json({ error: "surya Failed to fetch flights" });
  }
}
