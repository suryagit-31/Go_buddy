import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect production environment
  if (import.meta.env.PROD) {
    // Production: Use your backend URL
    return "https://go-buddy-1.onrender.com";
  }

  // Development: Use localhost
  return "http://localhost:5000";
};

const BASE_URL = getBaseURL();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important: This ensures cookies are sent with requests
});

// Add request interceptor to ensure credentials are always sent
axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      localStorage.removeItem("auth-storage");
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
