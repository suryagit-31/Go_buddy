import mongoose from "mongoose";
import dotenv from "dotenv";
import HousingListing from "../models/HousingListing.model.js";
import User from "../models/User.model.js";
import connectDB from "../libs/connect.js";

dotenv.config();

const seedHousingListings = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Get or create a user for the listings
    let user = await User.findOne({ email: "dammalapateja@gmail.com" });

    if (!user) {
      // Create a user if doesn't exist (for seeding purposes)
      console.log("Creating seed user...");
      user = new User({
        name: "TEJA DAMMALAPA",
        email: "dammalapateja@gmail.com",
        password: "seedpassword123", // This won't be used for login
        phone: "+971 503695235",
        age: 25,
        role: "user",
      });
      await user.save();
      console.log("Seed user created");
    }

    const userId = user._id;

    // Clear existing seed listings (optional - comment out if you want to keep existing)
    // await HousingListing.deleteMany({ userId });

    const housingListings = [
      {
        userId,
        state: "Dubai",
        city: "Dubai Marina",
        zipCode: "00000",
        rentPerMonth: 3500,
        description:
          "Beautiful modern apartment in Dubai Marina with stunning sea views. Fully furnished, 2 bedrooms, 2 bathrooms. Perfect for students or professionals. Close to metro, malls, and beaches. Includes WiFi, AC, and all utilities.",
        contactEmail: "dammalapateja@gmail.com",
        helperType: "Student",
        isAvailable: true,
        amenities: [
          "WiFi",
          "AC",
          "Furnished",
          "Parking",
          "Gym",
          "Pool",
          "Near Metro",
        ],
        numberOfBedrooms: 2,
        numberOfBathrooms: 2,
        availableFrom: new Date("2025-02-01"),
        availableUntil: new Date("2025-12-31"),
      },
      {
        userId,
        state: "Qatar",
        city: "Doha",
        zipCode: "00000",
        rentPerMonth: 2800,
        description:
          "Cozy studio apartment in the heart of Doha. Ideal location near Education City and major universities. Fully equipped kitchen, modern amenities. Safe neighborhood with 24/7 security. Perfect for students looking for affordable housing.",
        contactEmail: "dammalapateja@gmail.com",
        helperType: "Student",
        isAvailable: true,
        amenities: [
          "WiFi",
          "AC",
          "Furnished",
          "Security",
          "Near University",
          "Shopping",
        ],
        numberOfBedrooms: 1,
        numberOfBathrooms: 1,
        availableFrom: new Date("2025-01-15"),
        availableUntil: new Date("2025-11-30"),
      },
      {
        userId,
        state: "Abu Dhabi",
        city: "Al Reem Island",
        zipCode: "00000",
        rentPerMonth: 4200,
        description:
          "Luxurious 3-bedroom apartment on Al Reem Island with panoramic city views. Spacious living area, modern kitchen, and balcony. Close to NYU Abu Dhabi and other educational institutions. Includes all modern amenities.",
        contactEmail: "dammalapateja@gmail.com",
        helperType: "Volunteer",
        isAvailable: true,
        amenities: [
          "WiFi",
          "AC",
          "Furnished",
          "Balcony",
          "Gym",
          "Pool",
          "Parking",
          "Security",
        ],
        numberOfBedrooms: 3,
        numberOfBathrooms: 2,
        availableFrom: new Date("2025-02-01"),
        availableUntil: new Date("2025-12-31"),
      },
      {
        userId,
        state: "Saudi Arabia",
        city: "Riyadh",
        zipCode: "00000",
        rentPerMonth: 2200,
        description:
          "Affordable 1-bedroom apartment in Riyadh's King Fahd District. Clean, well-maintained, and fully furnished. Perfect for students or young professionals. Walking distance to public transport and shopping centers.",
        contactEmail: "dammalapateja@gmail.com",
        helperType: "Paid",
        isAvailable: true,
        amenities: ["WiFi", "AC", "Furnished", "Near Transport", "Shopping"],
        numberOfBedrooms: 1,
        numberOfBathrooms: 1,
        availableFrom: new Date("2025-01-20"),
        availableUntil: new Date("2025-10-31"),
      },
      {
        userId,
        state: "Sharjah",
        city: "Sharjah",
        zipCode: "00000",
        rentPerMonth: 1800,
        description:
          "Budget-friendly shared accommodation option in Sharjah. Single room in a shared apartment. Great for students on a tight budget. Close to University of Sharjah. Includes WiFi, AC, and shared kitchen facilities.",
        contactEmail: "dammalapateja@gmail.com",
        helperType: "Student",
        isAvailable: true,
        amenities: [
          "WiFi",
          "AC",
          "Shared Kitchen",
          "Near University",
          "Public Transport",
        ],
        numberOfBedrooms: 1,
        numberOfBathrooms: 1,
        availableFrom: new Date("2025-02-15"),
        availableUntil: new Date("2025-11-30"),
      },
    ];

    console.log("Creating housing listings...");
    const createdListings = await HousingListing.insertMany(housingListings);
    console.log(
      `✅ Successfully created ${createdListings.length} housing listings!`
    );

    createdListings.forEach((listing, index) => {
      console.log(
        `${index + 1}. ${listing.city}, ${listing.state} - AED ${
          listing.rentPerMonth
        }/month`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding housing listings:", error);
    process.exit(1);
  }
};

seedHousingListings();
