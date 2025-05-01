import getFlightsByRouteAndDate from "./../services/aviationservice.js";

export async function fetchFlightsByRouteAndDate(req, res) {
  try {
    const { dep_iata, arr_iata, flight_date } = req.body;

    if (!dep_iata || !arr_iata || !flight_date) {
      return res
        .status(400)
        .json({ error: "dep_iata, arr_iata, and flight_date are required" });
    }

    const data = await getFlightsByRouteAndDate(
      dep_iata,
      arr_iata,
      flight_date
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
}
