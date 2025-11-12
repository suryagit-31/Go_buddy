import React from "react";
import PageTransition from "../components/pagetransition.jsx";
import { motion } from "framer-motion";
import { Shield, Users, Heart } from "lucide-react";

const features = [
  {
    name: "Safety First",
    description:
      "All companions are thoroughly vetted and verified for your safety and peace of mind.",
    icon: Shield,
  },
  {
    name: "Compatible Matches",
    description:
      "Our matching system pairs you with like-minded travelers based on preferences and interests.",
    icon: Users,
  },
  {
    name: "Supportive Community",
    description:
      "Join a community of travelers who understand the unique needs of elderly travelers.",
    icon: Heart,
  },
];

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50">
        {/* Hero section */}
        <div className="bg-primary-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-neutral-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About CompanionFly
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We connect travelers with compatible companions for safer, more
              enjoyable journeys
            </motion.p>
          </div>
        </div>

        {/* Mission section */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                Our Mission
              </h2>
              <p className="mt-2 text-3xl leading-8 font-bold text-neutral-900 sm:text-4xl">
                Travel should be accessible to everyone
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <motion.div
                    key={feature.name}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                  >
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">
                        {feature.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-neutral-600">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
