import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  const isActive = (path) => {
    return location.pathname === path;
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium ${
                isActive("/")
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-neutral-600 hover:text-primary-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium ${
                isActive("/about")
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-neutral-600 hover:text-primary-500"
              }`}
            >
              About Us
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/search"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/search")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Find Flights
                </Link>
                <Link
                  to="/bookings"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/bookings")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/profile")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive("/login")
                      ? "text-primary-600 border-b-2 border-primary-500"
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-150 ease-in-out"
                >
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
              className={`block px-3 py-2 text-base font-medium ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={`block px-3 py-2 text-base font-medium ${
                isActive("/about")
                  ? "text-primary-600 bg-primary-50"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
              }`}
            >
              About Us
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/search"
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/search")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  Find Flights
                </Link>
                <Link
                  to="/bookings"
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/bookings")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/profile")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive("/login")
                      ? "text-primary-600 bg-primary-50"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                >
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
