const express = require("express");
const router = express.Router();
const Notification = require("../models/Notifications"); // Your Notification model

router.get("/", async (req, res) => {
  try {
    // Find all notifications in the database
    const notifications = await Notification.find().sort({ timestamp: -1 }); // Sort by most recent
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: "No notifications found." });
    }

    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching notifications", details: error });
  }
});

// Route to get all notifications for a specific customer
router.get("/:customerID", async (req, res) => {
  try {
    const { customerID } = req.params;

    // Find notifications by customerID
    const notifications = await Notification.find({ customerID }).sort({
      timestamp: -1,
    }); // Sort by most recent
    if (!notifications) {
      return res
        .status(404)
        .json({ error: "No notifications found for this customer." });
    }

    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching notifications", details: error });
  }
});

// Route to mark a notification as read
router.patch("/:notificationID/read", async (req, res) => {
  try {
    const { notificationID } = req.params;

    // Find the notification and mark it as read
    const notification = await Notification.findById(notificationID);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Mark the notification as read
    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating notification", details: error });
  }
});

// Route to get a specific notification by its ID
router.get("/:notificationID", async (req, res) => {
  try {
    const { notificationID } = req.params;

    // Find the specific notification by ID
    const notification = await Notification.findById(notificationID);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching notification", details: error });
  }
});



module.exports = router;
