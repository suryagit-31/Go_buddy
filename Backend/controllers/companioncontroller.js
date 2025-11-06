import CompanionRequest from "../models/CompanionRequest.model.js";
import mongoose from "mongoose";
import { HelperRequest } from "../models/Helper.model.js";
import { HelpSeekerRequest } from "../models/Helpseekers.model.js";

export const createCompanion = async (req, res) => {
  console.log(req.body);
  const companion = req.body;
  try {
    // Add userId from authenticated user if available
    if (req.user) {
      companion.userId = req.user._id;
    } else if (companion.userID) {
      companion.userId = companion.userID;
    }

    if (companion.passenger_role == "helper") {
      const helper = new HelperRequest(companion);
      const companionRequest = await helper.save();
      return res.status(201).json(companionRequest);
    } else if (companion.passenger_role == "seeker") {
      const helpseeker = new HelpSeekerRequest(companion);
      const companionRequest = await helpseeker.save();
      return res.status(201).json(companionRequest);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOtherCompanions = async (req, res) => {
  try {
    const { flight_date, flight_iata } = req.params;
    const currentUser = req.user; // Get current user from middleware if available

    try {
      const [helpers, seekers] = await Promise.all([
        HelperRequest.find({ flight_iata, flight_date }),
        HelpSeekerRequest.find({ flight_iata, flight_date }),
      ]);

      // Combine both into one array
      let allCompanions = [...helpers, ...seekers];

      // Filter out current user's own requests if user is authenticated
      if (currentUser) {
        allCompanions = allCompanions.filter((companion) => {
          // Check by userId if available
          if (companion.userId) {
            const companionUserId = companion.userId.toString
              ? companion.userId.toString()
              : companion.userId;
            const currentUserId = currentUser._id.toString();
            if (companionUserId === currentUserId) {
              return false; // Filter out own request
            }
          }
          // Check by email as fallback
          if (companion.email && currentUser.email) {
            if (
              companion.email.toLowerCase() === currentUser.email.toLowerCase()
            ) {
              return false; // Filter out own request
            }
          }
          return true; // Keep this companion
        });
      }

      // PRO FEATURE: Priority matching - Show Pro users first
      // Populate user data to check subscription status
      const companionsWithUsers = await Promise.all(
        allCompanions.map(async (companion) => {
          let user = null;
          if (companion.userId) {
            const userId = companion.userId.toString
              ? companion.userId.toString()
              : companion.userId;
            user = await User.findById(userId).select("subscription");
          } else if (companion.email) {
            user = await User.findOne({ email: companion.email }).select(
              "subscription"
            );
          }

          const isPro =
            user?.subscription?.plan === "pro" &&
            user?.subscription?.status === "active";

          return {
            ...companion.toObject(),
            isPro: isPro || false,
          };
        })
      );

      // Sort: Pro users first, then free users
      companionsWithUsers.sort((a, b) => {
        if (a.isPro && !b.isPro) return -1;
        if (!a.isPro && b.isPro) return 1;
        return 0;
      });

      res.status(200).json(companionsWithUsers);
    } catch (err) {
      console.error("Error fetching companions:", err);
      res.status(500).json({ message: "Error fetching companions" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  const { UserMail } = req.params;
  const currentUser = req.user; // Get authenticated user from middleware

  console.log("Fetching bookings for:", UserMail);
  console.log("Authenticated user:", currentUser?._id);

  try {
    let query = {};

    // If user is authenticated, search by userId first (more reliable)
    if (currentUser && currentUser._id) {
      query = { userId: currentUser._id };
    } else {
      // Fallback to email search if not authenticated
      query = { email: decodeURIComponent(UserMail) };
    }

    const [helpers, seekers] = await Promise.all([
      HelperRequest.find(query),
      HelpSeekerRequest.find(query),
    ]);

    // If no results found with userId and user is authenticated, also try email as fallback
    if (
      currentUser &&
      currentUser._id &&
      helpers.length === 0 &&
      seekers.length === 0
    ) {
      const emailQuery = {
        email: currentUser.email || decodeURIComponent(UserMail),
      };
      const [helpersByEmail, seekersByEmail] = await Promise.all([
        HelperRequest.find(emailQuery),
        HelpSeekerRequest.find(emailQuery),
      ]);

      // Combine results, avoiding duplicates
      const allBookings = [
        ...helpers,
        ...seekers,
        ...helpersByEmail,
        ...seekersByEmail,
      ];
      const uniqueBookings = allBookings.filter(
        (booking, index, self) =>
          index ===
          self.findIndex((b) => b._id.toString() === booking._id.toString())
      );

      return res.status(200).json(uniqueBookings);
    }

    const allBookings = [...helpers, ...seekers];
    res.status(200).json(allBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    // Try deleting from both collections; only one should match
    const [helperDeleteResult, seekerDeleteResult] = await Promise.all([
      HelperRequest.deleteOne({ _id: id }),
      HelpSeekerRequest.deleteOne({ _id: id }),
    ]);

    const deletedCount =
      (helperDeleteResult?.deletedCount || 0) +
      (seekerDeleteResult?.deletedCount || 0);

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
