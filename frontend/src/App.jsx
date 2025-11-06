import React from "react";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signup";
import AboutPage from "./pages/about";
import ProfilePage from "./pages/profilepage";
import FlightSearchPage from "./pages/findflights";
import BookingsPage from "./pages/bookingspage";
import ConnectionsPage from "./pages/connectionspage";
import HousingPage from "./pages/housingpage";
import FlightJoinpage from "./pages/flightjoinpage";
import BuddyProPage from "./pages/buddypro";
import useAuthStore from "./store/useAuthstore";
import { Toaster } from "react-hot-toast";
import { initializeSocket } from "./utils/socket";
import ChatSidebar from "./components/ChatSidebar";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const { checkAuth_validity, ischeckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only check auth if we don't have a cached user or if checking is needed
    if (!authUser) {
      checkAuth_validity();
    } else {
      // Initialize socket when user is logged in
      initializeSocket();
    }
  }, [checkAuth_validity, authUser]);

  if (ischeckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-12" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/login"
                element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
              />
              <Route
                path="/signup"
                element={!authUser ? <SignupPage /> : <Navigate to="/home" />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/profile"
                element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/search"
                element={
                  authUser ? <FlightSearchPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/bookings"
                element={authUser ? <BookingsPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/connections"
                element={
                  authUser ? <ConnectionsPage /> : <Navigate to="/login" />
                }
              />
              <Route path="/housing" element={<HousingPage />} />
              <Route
                path="/flightjoin/:iata/:date"
                element={
                  authUser ? <FlightJoinpage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/buddypro"
                element={authUser ? <BuddyProPage /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        {/* Chat Sidebar - Right Side */}
        {authUser && <ChatSidebar />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
