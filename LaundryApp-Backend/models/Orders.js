const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerID: { type: String, required: true },
    serviceType: { type: String, required: true },
    garments: { type: Object, required: true },

    pickupDate: { type: Date, required: true }, // Separate pickup date
    pickupTime: { type: String, required: true }, // Separate pickup time (e.g., "10:30")

    dropoffDate: { type: Date, required: true }, // Separate dropoff date
    dropoffTime: { type: String, required: true }, // Separate dropoff time (e.g., "16:00")

    pickupAddress: { type: String, required: true },
    dropoffAddress: { type: String, required: true },

    totalCost: { type: Number, required: true },
    status: { type: String, default: "new" },
    // New field: Driver ID
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    // New field: Payment status
    payment: { type: String, default: "pending" },

    // New field: Profile picture URL or location
    profilePic: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
