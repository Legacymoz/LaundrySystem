const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  vehicleDetails: {
    type: String,
    required: true,
  },
  isActive: { type: Boolean, default: true },
  pickupOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
  ],
  dropoffOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Driver", driverSchema);