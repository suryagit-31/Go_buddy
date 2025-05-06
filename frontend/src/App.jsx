import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signup";
import AboutPage from "./pages/about";
import ProfilePage from "./pages/profilepage";
import FlightSearchPage from "./pages/findflights";
import BookingsPage from "./pages/bookingspage";
import HousingPage from "./pages/housingpage";
import FlightJoinpage from "./pages/flightjoinpage";
function App() {
  return (
    <>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<FlightSearchPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/housing" element={<HousingPage />} />
              <Route
                path="/flightjoin/:iata/:date"
                element={<FlightJoinpage />}
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default App;
