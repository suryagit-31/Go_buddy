// Test script to identify problematic route file
import express from "express";

const testRouteFile = async (routePath, routeName) => {
  try {
    console.log(`\nTesting ${routeName}...`);
    const routeModule = await import(routePath);
    const router = routeModule.default;

    // Try to create a test app and mount the router
    const app = express();
    app.use("/test", router);
    console.log(`✅ ${routeName} is valid`);
    return true;
  } catch (err) {
    console.error(`❌ ${routeName} has an error:`, err.message);
    console.error("Stack:", err.stack);
    return false;
  }
};

const testAllRoutes = async () => {
  console.log("Testing all route files...\n");

  const routes = [
    ["./routes/userRoutes.js", "userRoutes"],
    ["./routes/companionRequestRoutes.js", "companionRequestRoutes"],
    ["./routes/connectionRoutes.js", "connectionRoutes"],
    ["./routes/messageRoutes.js", "messageRoutes"],
    ["./routes/paymentRoutes.js", "paymentRoutes"],
    ["./routes/subscriptionRoutes.js", "subscriptionRoutes"],
    ["./routes/flightRoutes.js", "flightRoutes"],
    ["./routes/housingRoutes.js", "housingRoutes"],
    ["./routes/notificationRoutes.js", "notificationRoutes"],
  ];

  for (const [path, name] of routes) {
    const isValid = await testRouteFile(path, name);
    if (!isValid) {
      console.error(`\n🚨 FOUND PROBLEMATIC ROUTE: ${name}`);
      process.exit(1);
    }
  }

  console.log("\n✅ All routes are valid!");
};

testAllRoutes().catch(console.error);
