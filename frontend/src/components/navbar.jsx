import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Plane,
  Crown,
  Sparkles,
  Home,
  Search,
  Building2,
  User,
  LogIn,
  UserPlus,
  LogOut,
  MoreVertical,
  Users,
  Info,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/useAuthstore";
import axiosInstance from "../utils/axios";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const { is_userlogged, Logout } = useAuthStore();
  const location = useLocation();
  const moreMenuRef = useRef(null);

  useEffect(() => {
    if (is_userlogged) {
      checkProStatus();
    }
  }, [is_userlogged]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const checkProStatus = async () => {
    try {
      const { data } = await axiosInstance.get("/subscriptions/status");
      setIsPro(data.isPro);
    } catch (error) {
      console.error("Error checking Pro status:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isMoreActive = () => {
    return (
      isActive("/connections") || isActive("/about") || isActive("/bookings")
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Plane className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-neutral-900">
                Go-Buddy
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                isActive("/")
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-neutral-600 hover:text-primary-500"
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            {is_userlogged ? (
              <>
                <Link
                  to="/search"
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                    isActive("/search")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  <Search className="h-4 w-4" />
                  Find Flights
                </Link>
                <Link
                  to="/housing"
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                    isActive("/housing")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Housing
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                    isActive("/profile")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                {/* More Dropdown */}
                <div className="relative" ref={moreMenuRef}>
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                      isMoreActive()
                        ? "text-primary-600 border-b-2 border-primary-500"
                        : "text-neutral-600 hover:text-primary-500"
                    }`}
                  >
                    <MoreVertical className="h-4 w-4" />
                    More
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isMoreOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMoreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1">
                          <Link
                            to="/bookings"
                            onClick={() => setIsMoreOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                              isActive("/bookings")
                                ? "bg-primary-50 text-primary-600"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <Calendar className="h-4 w-4" />
                            My Bookings
                          </Link>
                          <Link
                            to="/connections"
                            onClick={() => setIsMoreOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                              isActive("/connections")
                                ? "bg-primary-50 text-primary-600"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <Users className="h-4 w-4" />
                            Connections
                          </Link>
                          <Link
                            to="/about"
                            onClick={() => setIsMoreOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                              isActive("/about")
                                ? "bg-primary-50 text-primary-600"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            <Info className="h-4 w-4" />
                            About Us
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notification Bell */}
                {is_userlogged && <NotificationBell />}

                {/* Buddy Pro Button */}
                <Link
                  to="/buddypro"
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all transform hover:scale-105 ${
                    isPro
                      ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white shadow-lg"
                      : "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-lg"></div>
                  <span className="relative flex items-center gap-1">
                    {isPro ? (
                      <>
                        <Crown className="h-4 w-4" />
                        Buddy Pro
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Buddy Pro
                      </>
                    )}
                  </span>
                </Link>
                <button
                  onClick={Logout}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                    isActive("/login")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-150 ease-in-out flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
              }`}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            {is_userlogged ? (
              <>
                <Link
                  to="/search"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/search")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <Search className="h-5 w-5" />
                  Find Flights
                </Link>
                <Link
                  to="/housing"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/housing")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                  Housing
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/profile")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                {/* More section in mobile */}
                <div className="border-t border-neutral-200 my-1"></div>
                <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  More
                </div>
                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/bookings")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </Link>
                <Link
                  to="/connections"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/connections")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Connections
                </Link>
                <Link
                  to="/about"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/about")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <Info className="h-5 w-5" />
                  About Us
                </Link>

                {/* Notification Bell Mobile */}
                {is_userlogged && (
                  <div className="border-t border-neutral-200 my-1 py-2">
                    <NotificationBell />
                  </div>
                )}

                {/* Buddy Pro Button Mobile */}
                <div className="border-t border-neutral-200 my-1"></div>
                <Link
                  to="/buddypro"
                  onClick={closeMenu}
                  className={`relative px-3 py-2 text-base font-semibold rounded-lg flex items-center gap-2 ${
                    isPro
                      ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white"
                      : "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-lg"></div>
                  <span className="relative flex items-center gap-2">
                    {isPro ? (
                      <>
                        <Crown className="h-5 w-5" />
                        Buddy Pro
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Buddy Pro
                      </>
                    )}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    Logout();
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium flex items-center gap-2 ${
                    isActive("/login")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  <LogIn className="h-5 w-5" />
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
