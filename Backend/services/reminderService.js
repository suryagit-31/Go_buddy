import Connection from "../models/Connection.model.js";
import Message from "../models/Message.model.js";
import Notification from "../models/Notification.model.js";
import { getIO } from "../socket/socketServer.js";

/**
 * Send pre-flight check-in reminders
 * Should be called by a cron job 24 hours before flight
 */
export const sendPreFlightReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    // Find connections with flights tomorrow (within 24-48 hour window)
    const connections = await Connection.find({
      status: "accepted",
      flight_date: {
        $gte: tomorrow,
        $lt: dayAfter,
      },
    })
      .populate("helperUserId", "name email")
      .populate("seekerUserId", "name email");

    console.log(
      `Found ${connections.length} connections for pre-flight reminders`
    );

    const io = getIO();
    const reminders = [];

    for (const connection of connections) {
      const flightDate = new Date(connection.flight_date);
      const hoursUntilFlight = (flightDate - now) / (1000 * 60 * 60);

      // Only send if flight is between 24-48 hours away
      if (hoursUntilFlight >= 24 && hoursUntilFlight <= 48) {
        const flightDateStr = flightDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const reminderMessage = `Don't forget! Your flight ${connection.flight_iata} is tomorrow (${flightDateStr}). Make sure to check in online!`;

        // Create reminder for helper
        const helperReminder = new Notification({
          userId: connection.helperUserId._id,
          type: "reminder",
          title: "Pre-Flight Check-in Reminder",
          message: reminderMessage,
          connectionId: connection._id,
          metadata: {
            flight_iata: connection.flight_iata,
            flight_date: connection.flight_date.toISOString(),
          },
        });
        await helperReminder.save();
        reminders.push(helperReminder);

        // Create reminder for seeker
        const seekerReminder = new Notification({
          userId: connection.seekerUserId._id,
          type: "reminder",
          title: "Pre-Flight Check-in Reminder",
          message: reminderMessage,
          connectionId: connection._id,
          metadata: {
            flight_iata: connection.flight_iata,
            flight_date: connection.flight_date.toISOString(),
          },
        });
        await seekerReminder.save();
        reminders.push(seekerReminder);

        // Send real-time notifications via socket
        if (io) {
          io.to(`user:${connection.helperUserId._id}`).emit("notification", {
            type: "reminder",
            title: "Pre-Flight Check-in Reminder",
            message: reminderMessage,
            connectionId: connection._id,
            timestamp: new Date(),
          });

          io.to(`user:${connection.seekerUserId._id}`).emit("notification", {
            type: "reminder",
            title: "Pre-Flight Check-in Reminder",
            message: reminderMessage,
            connectionId: connection._id,
            timestamp: new Date(),
          });
        }

        // Also create a system message in the connection
        const systemMessage = new Message({
          connectionId: connection._id,
          senderId: connection.helperUserId._id, // System message
          receiverId: connection.seekerUserId._id,
          content: `✈️ Reminder: Flight ${connection.flight_iata} is tomorrow! Don't forget to check in online.`,
          messageType: "reminder",
        });
        await systemMessage.save();
      }
    }

    console.log(`Sent ${reminders.length} pre-flight reminders`);
    return reminders;
  } catch (error) {
    console.error("Error sending pre-flight reminders:", error);
    throw error;
  }
};

/**
 * Send immediate reminder for flights within 24 hours
 */
export const sendUrgentReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    // Find connections with flights within next 24 hours
    const connections = await Connection.find({
      status: "accepted",
      flight_date: {
        $gte: now,
        $lte: tomorrow,
      },
    })
      .populate("helperUserId", "name email")
      .populate("seekerUserId", "name email");

    console.log(`Found ${connections.length} connections for urgent reminders`);

    const io = getIO();

    for (const connection of connections) {
      const flightDate = new Date(connection.flight_date);
      const hoursUntilFlight = (flightDate - now) / (1000 * 60 * 60);

      if (hoursUntilFlight > 0 && hoursUntilFlight <= 24) {
        const reminderMessage = `⚠️ URGENT: Your flight ${
          connection.flight_iata
        } is in ${Math.round(hoursUntilFlight)} hours! Check in now!`;

        // Create urgent reminder notifications
        await Notification.create([
          {
            userId: connection.helperUserId._id,
            type: "reminder",
            title: "⚠️ Urgent: Flight Check-in",
            message: reminderMessage,
            connectionId: connection._id,
            metadata: {
              flight_iata: connection.flight_iata,
              flight_date: connection.flight_date.toISOString(),
              urgent: "true",
            },
          },
          {
            userId: connection.seekerUserId._id,
            type: "reminder",
            title: "⚠️ Urgent: Flight Check-in",
            message: reminderMessage,
            connectionId: connection._id,
            metadata: {
              flight_iata: connection.flight_iata,
              flight_date: connection.flight_date.toISOString(),
              urgent: "true",
            },
          },
        ]);

        // Send real-time notifications
        if (io) {
          io.to(`user:${connection.helperUserId._id}`).emit("notification", {
            type: "reminder",
            title: "⚠️ Urgent: Flight Check-in",
            message: reminderMessage,
            connectionId: connection._id,
            urgent: true,
            timestamp: new Date(),
          });

          io.to(`user:${connection.seekerUserId._id}`).emit("notification", {
            type: "reminder",
            title: "⚠️ Urgent: Flight Check-in",
            message: reminderMessage,
            connectionId: connection._id,
            urgent: true,
            timestamp: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Error sending urgent reminders:", error);
    throw error;
  }
};
