const Notification = require("../models/Notifications");

const orderUpdateNotification = async (customerID, orderID, newState) => {
  try {

    const stateMessages = {
      scheduled: "Your order has been scheduled for pickup.",
      washing: "Your order is now being washed.",
      ironing: "Your order is now being ironed.",
      ready: "Your order is ready for pickup.",
      delivered: "Your order has been delivered.",
    };

    const formattedOrderID =
      "ORD-" + orderID.slice(0, 6).toUpperCase();

    const message =
      stateMessages[newState] ||
      `Your order ${formattedOrderID} is now ${newState}.`;

    const newNotification = new Notification({
      customerID,
      orderID,
      message,
      timestamp: new Date(),
      read: false,
    });

    await newNotification.save();
    console.log("Notification created:", newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const sendNotification = async (
  customerID,
  orderID,
  message
) => {
  try {
    
    // Log the notification (or send it via SMS, email, etc.)
    console.log(
      `Sending payment notification to customer ${customerID}: ${message}`
    );

    // Example: Save the notification to the database
    const notification = new Notification({
      customerID,
      orderID,
      message,
      read: false,
      timestamp: new Date(), // Mark as unread initially
    });

    await notification.save();
    console.log("Payment notification saved successfully:", notification);
  } catch (error) {
    console.error("Error sending payment notification:", error);
  }
};

module.exports = { orderUpdateNotification, sendNotification };
