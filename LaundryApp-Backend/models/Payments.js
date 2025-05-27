const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    number: {
      type: String,
      required: true, // Phone number used for payment
    },
    orderID: {
      type: String,
      required: true,
    },
    customerID: {
      type: String,
      required: true,
    },
    transactionCode: {
      type: String,
      required: true, // M-Pesa transaction code
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Payment", paymentSchema);