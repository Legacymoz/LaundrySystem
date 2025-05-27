// models/TimeSlot.js
const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        time: { type: String, required: true }, // e.g., "08:00", "13:00", "18:00"
        maxOrders: { type: Number, required: true, default: 50 },
        currentOrders: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const TimeSlot =
  mongoose.models.TimeSlot || mongoose.model("TimeSlot", timeSlotSchema);
module.exports = TimeSlot;
