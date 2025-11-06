import cron from "node-cron";
import {
  sendPreFlightReminders,
  sendUrgentReminders,
} from "../services/reminderService.js";

/**
 * Schedule reminder jobs
 * - Pre-flight reminders: Run every hour, checks for flights 24-48 hours away
 * - Urgent reminders: Run every 30 minutes, checks for flights within 24 hours
 */
export const scheduleReminders = () => {
  // Pre-flight reminders (24-48 hours before flight)
  // Run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running pre-flight reminder check...");
    try {
      await sendPreFlightReminders();
    } catch (error) {
      console.error("Error in pre-flight reminder job:", error);
    }
  });

  // Urgent reminders (within 24 hours)
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("⏰ Running urgent reminder check...");
    try {
      await sendUrgentReminders();
    } catch (error) {
      console.error("Error in urgent reminder job:", error);
    }
  });

  console.log("✅ Reminder jobs scheduled");
};
