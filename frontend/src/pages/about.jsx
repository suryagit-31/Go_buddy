import React from "react";
import PageTransition from "../components/pagetransition.jsx";
import { motion } from "framer-motion";
import { Shield, Users, Heart, Clock } from "lucide-react";

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

const testimonials = [
  {
    id: 1,
    content:
      "CompanionFly made traveling so much more enjoyable for me. I was hesitant to travel alone at my age, but found a wonderful companion who made the journey stress-free and fun.",
    author: "Margaret W.",
    location: "72, Florida",
  },
  {
    id: 2,
    content:
      "I was nervous about flying internationally alone, but thanks to CompanionFly, I found a travel partner who helped me navigate the airports and made the trip so much more enjoyable.",
    author: "Robert J.",
    location: "68, California",
  },
  {
    id: 3,
    content:
      "After my husband passed away, I thought my traveling days were over. CompanionFly connected me with another widow who loves adventure as much as I do!",
    author: "Elizabeth M.",
    location: "75, New York",
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
              We connect  travelers with compatible companions for safer,
              more enjoyable journeys
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

        {/* How it started section */}
        
        {/* Testimonials */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl leading-8 font-bold text-neutral-900 sm:text-4xl">
                Hear from our travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-soft"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-neutral-600 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold   text-primary-500">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {testimonial.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
