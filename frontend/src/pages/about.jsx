import React from "react";
import PageTransition from "../components/pagetransition.jsx";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Heart,
  Clock,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  Code,
  UserRound,
} from "lucide-react";

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
  const developerPhoto = localStorage.getItem("developerPhoto") || null;

  const developerInfo = {
    name: "TEJA DAMMALAPA",
    email: "dammalapateja@gmail.com",
    phone: "+971 503695235",
    location: "Dubai",
    github: "Dammalapateja1",
    githubUrl: "https://github.com/Dammalapateja1",
    linkedin: "teja-dammalapa",
    linkedinUrl: "https://www.linkedin.com/in/teja-dammalapa/",
    profile:
      "I am an Artificial Intelligence and Machine Learning Engineer with strong expertise in Web Development and Full Stack Engineering. Skilled in LLMs, ML Models, Statistics, Agentic AI, and deployment. Experienced with modern web technologies including JavaScript, React, Node.js, and MongoDB. Proficient in building scalable web applications and RESTful APIs. Experienced with Ollama, LangChain, CrewAI, and FastAPI, AWS Cloud. Passionate about building intelligent automation systems and simplifying complex AI concepts into real business solutions through web development and AI integration.",
    education: [
      {
        institution: "Pacific Link College Rak, UAE",
        degree: "Associate Diploma in Information and Communication Technology",
        gpa: "8.2",
        period: "Jan 2025 - April 2025",
      },
      {
        institution: "Kalasalingam Academy of Research and Education",
        degree: "Computer Science and Engineering - Artificial Intelligence",
        gpa: "7.8",
        period: "Sep 2021 - May 2025",
      },
    ],
    skills: [
      "Web Development",
      "Javascript",
      "LLMs",
      "Machine Learning",
      "Statistics",
      "Agentic AI",
      "Ollama",
      "LangChain",
      "CrewAI",
      "FastAPI",
      "AWS Cloud",
      "Python",
      "Deep Learning",
      "React",
      "REST API",
      "Node.js",
      "MongoDB",
    ],
  };

  const getInitials = (name) => {
    if (!name) return "TD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

        {/* Developers Section */}
        <div className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                Developer's Note
              </h2>
              <p className="mt-2 text-3xl leading-8 font-bold text-neutral-900 sm:text-4xl">
                Meet the Developer
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Side - Profile Picture & Name */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
                        {developerPhoto ? (
                          <img
                            src={developerPhoto}
                            alt={developerInfo.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl font-bold text-primary-600">
                            {getInitials(developerInfo.name)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-2">
                      {developerInfo.name}
                    </h3>
                    <p className="text-primary-100 text-xl mb-6">
                      AI/ML & Full Stack Engineer
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-3 w-full max-w-xs">
                      <a
                        href={`mailto:${developerInfo.email}`}
                        className="flex items-center justify-center gap-3 text-white hover:text-primary-100 transition-colors bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm">{developerInfo.email}</span>
                      </a>
                      <a
                        href={`tel:${developerInfo.phone.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-3 text-white hover:text-primary-100 transition-colors bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="text-sm">{developerInfo.phone}</span>
                      </a>
                      <div className="flex items-center justify-center gap-3 text-white bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm">
                          {developerInfo.location}
                        </span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 mt-6">
                      <a
                        href={developerInfo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                      >
                        <Github className="w-6 h-6 text-white" />
                      </a>
                      <a
                        href={developerInfo.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                      >
                        <Linkedin className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Right Side - Skills, Profile, Education */}
                  <div className="p-8 md:p-12 bg-neutral-50">
                    {/* Profile Description */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <UserRound className="w-6 h-6 text-primary-600" />
                        Profile
                      </h4>
                      <p className="text-neutral-700 leading-relaxed text-base">
                        {developerInfo.profile}
                      </p>
                    </div>

                    {/* Skills & Technologies */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <Code className="w-6 h-6 text-primary-600" />
                        Skills & Technologies
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {developerInfo.skills.map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-white text-primary-700 rounded-lg text-sm font-medium border border-primary-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                        Education
                      </h4>
                      <div className="space-y-4">
                        {developerInfo.education.map((edu, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg p-4 border-l-4 border-primary-500 shadow-sm"
                          >
                            <h5 className="font-semibold text-neutral-900 text-base mb-1">
                              {edu.institution}
                            </h5>
                            <p className="text-neutral-700 text-sm mb-2">
                              {edu.degree}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                GPA: {edu.gpa}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {edu.period}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
