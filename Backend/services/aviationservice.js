import axios from "axios";

const AVIATION_BASEURL = "https://api.aviationstack.com/v1/flights";
const Aviation_key = process.env.AVIATIONSTACK_APIKEY;

async function getFlightsByRouteAndDate(dep_iata, arr_iata) {
  try {
    const response = await axios.get(AVIATION_BASEURL, {
      params: {
        access_key: Aviation_key,
        dep_iata: dep_iata,
        arr_iata: arr_iata,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching flight data:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export default getFlightsByRouteAndDate;
