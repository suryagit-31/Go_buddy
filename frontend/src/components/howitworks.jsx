import React from "react";
import { motion } from "framer-motion";
import { UserRound, Search, Users, Home, Plane } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Sign up and tell us about yourself, your preferences, and needs.",
    icon: UserRound,
  },
  {
    id: 2,
    title: "Choose Your Goal",
    description:
      "Looking for a travel companion or housing buddy? Select your path.",
    icon: Search,
  },
  {
    id: 3,
    title: "Connect & Travel",
    description: "Find and connect with travel companions for your journey.",
    icon: Plane,
    type: "travel",
  },
  {
    id: 4,
    title: "Find Housing",
    description:
      "Browse housing listings or post your own to find the perfect match.",
    icon: Home,
    type: "housing",
  },
  {
    id: 5,
    title: "Build Trust",
    description:
      "Get to know your companion through our safe communication platform.",
    icon: Users,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorks= () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            How it works
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Simple steps to find your perfect travel or housing companion
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center text-center"
              variants={item}
            >
              <div
                className={`flex justify-center items-center w-16 h-16 rounded-full ${
                  step.type === "travel"
                    ? "bg-primary-100 text-primary-600"
                    : step.type === "housing"
                    ? "bg-secondary-100 text-secondary-600"
                    : "bg-primary-100 text-primary-600"
                } mb-4`}
              >
                <step.icon size={28} />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-neutral-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
