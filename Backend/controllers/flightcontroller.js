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
   const { iata, date } = req.params;

    console.log(iata, date);

    if (!iata || iata === "undefined" || iata === "null") {
      return res.status(400).json({ error: "flight_iata is required" });
    }

    if (!date || date === "undefined" || date === "null") {
      return res.status(400).json({ error: "flight_date is required" });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const data = await getflightby_iata_and_Date(iata, date);
    //console.log("📦 Controller - response of Data:", data);

    const filteredData = data.filter(
      (flight) => flight.flight_date === date && flight.flight.iata === iata
    );

    // console.log("📦 filter Controller - response of Data:", filteredData);

    res.json(filteredData);
  } catch (error) {
    console.error(" we got error Error fetching flights:", error);
    res
      .status(500)
      .json({ error: " Failed to fetch flights with iata and date" });
  }
}
