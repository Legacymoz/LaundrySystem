const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  customerID: {
    
    type: String, 
    required: true,
  }, 
  orderID: {
    
    type: String, 
    required: true,
  }, 
  message: { type: String, required: true }, // Notification message
  timestamp: { type: Date, default: Date.now }, // Time when the notification was created
  read: { type: Boolean, default: false }, // Read status (false by default)
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
