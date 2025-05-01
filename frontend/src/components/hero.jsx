import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/authcontext";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-primary-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Helping elderly travelers
            <br className="hidden md:inline" /> find trusted companions
          </motion.h1>

          <motion.p
            className="mt-4 md:mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Travel with confidence knowing you have a companion by your side
            throughout your journey.
          </motion.p>

          <motion.div
            className="mt-8 md:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to={isAuthenticated ? "/search" : "/signup"}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base md:text-lg font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
            >
              {isAuthenticated ? "Find a Companion" : "Get Started"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
