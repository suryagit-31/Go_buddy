import React from "react";
import PageTransition from "../components/pagetransition";
import Hero from "../components/hero";
import HowItWorks from "../components/howitworks";
import FlightSearchForm from "../components/flightsearchform";

const HomePage = () => {
  return (
    <PageTransition>
      <div>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <FlightSearchForm />
        </div>
        <HowItWorks />
      </div>
    </PageTransition>
  );
};

export default HomePage;
