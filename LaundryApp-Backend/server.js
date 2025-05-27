require("dotenv").config();
require('./controllers/timeslotController'); // Import the timeslot controller to set up cron jobs
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const orderRoutes = require("./routes/orderRoutes"); // Import the order routes
const serviceRoutes = require("./routes/serviceRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // Import the notification routes
const authRoutes = require("./routes/authRoutes");
const timeslotRoutes = require("./routes/timeslotRoutes"); // Import the timeslot routes
const productsRoute = require("./routes/productRoutes");
const driverRoutes = require("./routes/driverRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();

// Connect to MongoDB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Middleware
    app.use(express.json());
    app.use(
      cors({
        origin: "http://localhost:5173", // your frontend dev server
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(bodyParser.json());

    // Use the order routes with a prefix
    app.use("/api/auth", authRoutes);
    app.use("/api/orders", orderRoutes); 
    app.use("/api/services", serviceRoutes);
    app.use("/api/notifications", notificationRoutes); 
    app.use("/api/timeslots", timeslotRoutes);
    app.use("/api/products", productsRoute);
    app.use("/api/drivers", driverRoutes);
    app.use("/api/mpesa", paymentRoutes);


    app.put("/test", (req, res) => {
      console.log("Request Body:", req.body);
      res.json(req.body);
    });

    // Start the server only after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if the DB connection fails
  });
