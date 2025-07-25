import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AVIATION_BASEURL = "https://api.aviationstack.com/v1/flights";
const Aviation_key = process.env.AVIATIONSTACK_APIKEY;

async function getFlightsByRouteAndDate(dep_iata, arr_iata, flight_date) {
  try {
    console.log("API KEY:", Aviation_key);

    const response = await axios.get(AVIATION_BASEURL, {
      params: {
        access_key: Aviation_key,
        dep_iata: dep_iata,
        arr_iata: arr_iata,
      },
    });

    //console.log("Full response:", JSON.stringify(response.data, null, 2));

    if (!response.data.data || !response.data.data.length) {
      console.error("No flight data found for the given route and date.");
    }
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching flight data because:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export default getFlightsByRouteAndDate;
