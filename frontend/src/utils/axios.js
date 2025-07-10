import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://go-buddy-zm0k.onrender.com/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axiosInstance;
