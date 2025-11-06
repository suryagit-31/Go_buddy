import React, { useState, useEffect } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import {
  Check,
  MessageSquare,
  Star,
  Zap,
  Shield,
  BarChart3,
  Calendar,
  Bell,
  Sparkles,
  Crown,
} from "lucide-react";
import axiosInstance from "../utils/axios";
import useAuthStore from "../store/useAuthstore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const features = [
  { icon: MessageSquare, text: "Message before connection acceptance" },
  { icon: Zap, text: "Priority matching & early access" },
  { icon: Star, text: "Verified profile badge" },
  { icon: Shield, text: "Advanced search filters" },
  { icon: BarChart3, text: "Connection analytics & insights" },
  { icon: Calendar, text: "Travel itinerary sharing" },
  { icon: Bell, text: "Smart reminder notifications" },
  { icon: Check, text: "Unlimited active connections" },
];

const BuddyProPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proStatus, setProStatus] = useState(null);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    checkProStatus();

    // Check for success/cancel from Stripe Checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      toast.success("Payment successful! Welcome to Buddy Pro!");
      // Clean up URL
      window.history.replaceState({}, document.title, "/buddypro");

      // Poll for subscription status update (webhook might take a moment)
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const { data } = await axiosInstance.get("/subscriptions/status");
          setIsPro(data.isPro);
          setProStatus(data);

          // Stop polling if we got Pro status or max attempts reached
          if (data.isPro || attempts >= maxAttempts) {
            clearInterval(pollInterval);
            if (data.isPro) {
              toast.success("Your Buddy Pro subscription is now active!");
            } else if (attempts >= maxAttempts) {
              toast("Please refresh the page to see your Pro status", {
                icon: "ℹ️",
              });
            }
          }
        } catch (error) {
          console.error("Error polling Pro status:", error);
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
          }
        }
      }, 2000); // Check every 2 seconds

      // Cleanup interval on unmount
      return () => clearInterval(pollInterval);
    } else if (urlParams.get("canceled") === "true") {
      toast.error("Payment canceled. You can try again anytime.");
      // Clean up URL
      window.history.replaceState({}, document.title, "/buddypro");
    }
  }, [authUser, navigate]);

  const checkProStatus = async () => {
    try {
      const { data } = await axiosInstance.get("/subscriptions/status");
      setIsPro(data.isPro);
      setProStatus(data);
    } catch (error) {
      console.error("Error checking Pro status:", error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/subscriptions/checkout");

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create subscription";
      toast.error(errorMessage);
      console.error("Subscription error:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your Buddy Pro subscription?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/subscriptions/cancel");
      toast.success("Subscription cancelled");
      checkProStatus();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPro) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Current Plan Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-2xl shadow-xl p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Crown className="h-8 w-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Current Plan: Buddy Pro
                  </h2>
                </div>
                <p className="text-white/90 text-lg mb-4">
                  $7/month • Active Subscription
                </p>
                {proStatus?.currentPeriodEnd && (
                  <p className="text-white/80 text-sm">
                    Next billing date:{" "}
                    {new Date(proStatus.currentPeriodEnd).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
                {proStatus?.status && (
                  <div className="mt-3 inline-block">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                      Status:{" "}
                      {proStatus.status.charAt(0).toUpperCase() +
                        proStatus.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pro Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  Your Pro Features 🎉
                </h1>
                <p className="text-lg text-neutral-600">
                  All premium features are now unlocked
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-neutral-800 font-medium">
                        {feature.text}
                      </span>
                    </div>
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Subscription Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <h3 className="text-xl font-bold text-neutral-800 mb-4">
                Subscription Management
              </h3>
              <p className="text-neutral-600 mb-6">
                You can cancel your subscription at any time. Your Pro features
                will remain active until the end of your billing period.
              </p>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Cancel Subscription"}
              </button>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <Sparkles className="h-12 w-12 text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Upgrade to Buddy Pro
            </h1>
            <p className="text-xl text-neutral-600">
              Unlock premium features for just $7/month
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-500" />
                Pro Features
              </h2>
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <feature.icon className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                    <span className="text-neutral-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Payment Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-2xl shadow-xl p-8 relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

              <div className="relative z-10">
                <div className="mb-6">
                  <div className="text-5xl font-bold text-white mb-2">
                    $7<span className="text-2xl">/month</span>
                  </div>
                  <p className="text-white/90">Cancel anytime</p>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-white text-amber-600 rounded-lg font-bold text-lg hover:bg-neutral-50 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5" />
                      Subscribe to Buddy Pro
                    </>
                  )}
                </button>

                <p className="text-white/80 text-sm mt-4 text-center">
                  Secure payment powered by Stripe
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BuddyProPage;
