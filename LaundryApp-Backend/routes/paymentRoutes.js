const express = require("express");
const IntaSend = require("intasend-node");
require("dotenv").config();
const { sendNotification } = require("../controllers/notificationController"); // Notification utility
const Order = require("../models/Orders");
const Payment = require("../models/Payments"); // Import the Payment model
const router = express.Router();

// Initialize IntaSend with your API keys
const intasend = new IntaSend(
  process.env.INTASEND_PUBLISHABLE_KEY,
  process.env.INTASEND_SECRET_KEY,
  true // Set to true for sandbox, false for live
);
const ngrokUrl = "https://75f1-197-139-56-10.ngrok-free.app/api/mpesa/callback"; // Full callback URL
// Replace with your ngrok URL running.... ngrok http 5000
// Route to initiate M-Pesa STK Push
router.post("/stkpush", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      amount,
      orderID,
      customerID,
    } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !amount || !orderID || !customerID) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const apiRef = `${orderID}-${customerID}`;
    console.log("API Reference:", apiRef);

    // Trigger M-Pesa STK Push
    const response = await intasend.collection().mpesaStkPush({
      first_name: firstName,
      last_name: lastName,
      email: email,
      host: ngrokUrl,
      amount: amount,
      phone_number: phoneNumber,
      api_ref: apiRef,
    });
    console.log("STK Push Response :", response);

    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: response,
    });
  } catch (error) {
    console.error("STK Push Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate STK Push",
      error: error.message,
    });
  }
});

// Route to handle M-Pesa callback
router.post("/callback", async (req, res) => {
  try {
    const callbackData = req.body;
    console.log("M-Pesa Callback Data:", callbackData);

    // Extract relevant data
    const {
      state,
      value,
      account: phone_number,
      api_ref,
      invoice_id: invoice,
      mpesa_reference: transactionCode,
      failed_reason,
    } = callbackData;

    // Convert value (string) to a number
    const amount = parseFloat(value);

    // Split the api_ref to get orderID and customerID
    const [orderID, customerID] = api_ref.split("-");

    if (!api_ref || !api_ref.includes("-")) {
      return res.status(400).send("Invalid API reference format");
    }

    if (!state) {
      return res.status(400).send("Missing state in callback data");
    }

    if (state === "COMPLETE") {
      console.log(
        `Payment successful for ${phone_number}. Amount: ${amount}. Transaction Code: ${transactionCode}`
      );

      // 1. Populate the payment database
      const payment = new Payment({
        invoice,
        amount,
        number: phone_number,
        orderID,
        customerID,
        transactionCode: transactionCode || "N/A", // Handle null transactionCode
      });

      await payment.save();
      console.log("Payment saved successfully:", payment);

      // 2. Update the order status to "PAID"
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderID }, // Match the order by orderID
        { payment: "PAID" }, // Update payment status and transaction code
        { new: true } // Return the updated document
      );

      const formattedOrderID =
        "ORD-" + orderID.slice(0, 6).toUpperCase();

      // Notify the user about the successful payment
      const successMessage = `Dear customer, your payment of KES ${amount} for Order ${formattedOrderID} has been received successfully. Thank you!`;
      await sendNotification(customerID, orderID, successMessage);

      if (updatedOrder) {
        console.log("Order updated successfully:", updatedOrder);
      } else {
        console.error("Order not found for OrderID:", orderID);
        throw new Error(`Order not found for OrderID: ${orderID}`);
      }

      // Respond to IntaSend
      res
        .status(200)
        .send("Callback received and payment processed successfully");
    } else if (state === "FAILED") {
      console.error(
        `Payment failed for ${phone_number}. Reason: ${
          failed_reason || "Unknown"
        }`
      );

      // Notify the user about the failed payment
      const message = `Dear customer, your payment of KES ${amount} for Order ${formattedOrderID} has failed. Reason: ${
        failed_reason || "Unknown"
      }. Please try again.`;
      await sendNotification(customerID, orderID, message);

      console.log("User notified about failed payment.");

      // Respond to IntaSend
      res.status(200).send("Callback received and failure handled");
    } else {
      console.log(`Payment state is ${state}. No action taken.`);
      res.status(200).send("Callback received but no action taken");
    }
  } catch (error) {
    console.error("Error processing callback:", error.stack);
    res.status(500).send("Error processing callback");
  }
});

router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

router.get("/payments/customer/:customerID", async (req, res) => {
  const { customerID } = req.params;

  try {
    // Find payments for the given customerID
    const payments = await Payment.find({ customerID });

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this customer" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments for customer:", error);
    res.status(500).json({ message: "Error fetching payments for customer", error: error.message });
  }
});
// Route to initiate M-Pesa STK Push
router.post("/stkpush", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    amount,
    orderID,
    customerID,
  } = req.body;

  const apiRef = `${orderID}-${customerID}`;
  console.log("API Reference:", apiRef);

  try {
    // Trigger M-Pesa STK Push
    const response = await intasend.collection().mpesaStkPush({
      first_name: firstName,
      last_name: lastName,
      email: email,
      host: ngrokUrl,
      amount: amount,
      phone_number: phoneNumber,
      api_ref: apiRef,
    });
    console.log("STK Push Response :", response);

    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: response,
    });
  } catch (error) {
    console.error("STK Push Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate STK Push",
      error: error.message,
    });
  }
});

// Route to handle M-Pesa callback
router.post("/callback", async (req, res) => {
  console.log("Received M-Pesa callback request");

  const callbackData = req.body;
  console.log("M-Pesa Callback Data:", callbackData);

  // Extract relevant data
  const {
    state,
    value,
    account: phone_number,
    api_ref,
    invoice_id: invoice,
    mpesa_reference: transactionCode,
    failed_reason,
  } = callbackData;

  // Convert value (string) to a number
  const amount = parseFloat(value);

  // Split the api_ref to get orderID and customerID
  const [orderID, customerID] = api_ref.split("-");

  if (!api_ref || !api_ref.includes("-")) {
    return res.status(400).send("Invalid API reference format");
  }

  if (!state) {
    return res.status(400).send("Missing state in callback data");
  }

  try {
    if (state === "COMPLETE") {
      console.log(
        `Payment successful for ${phone_number}. Amount: ${amount}. Transaction Code: ${transactionCode}`
      );

      // 1. Populate the payment database
      const payment = new Payment({
        invoice,
        amount,
        number: phone_number,
        orderID,
        customerID,
        transactionCode: transactionCode || "N/A", // Handle null transactionCode
      });

      await payment.save();
      console.log("Payment saved successfully:", payment);

      // 2. Update the order status to "PAID"
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderID }, // Match the order by orderID
        { payment: "PAID" }, // Update payment status and transaction code
        { new: true } // Return the updated document
      );

      const formattedOrderID =
        "ORD-" + orderID.slice(0, 6).toUpperCase();

      // Notify the user about the successful payment
      const successMessage = `Dear customer, your payment of KES ${amount} for Order ${formattedOrderID} has been received successfully. Thank you!`;
      await sendNotification(customerID, orderID, successMessage);

      if (updatedOrder) {
        console.log("Order updated successfully:", updatedOrder);
      } else {
        console.error("Order not found for OrderID:", orderID);
        throw new Error(`Order not found for OrderID: ${orderID}`);
      }

      // Respond to IntaSend
      res
        .status(200)
        .send("Callback received and payment processed successfully");
    } else if (state === "FAILED") {
      console.error(
        `Payment failed for ${phone_number}. Reason: ${
          failed_reason || "Unknown"
        }`
      );

      // Notify the user about the failed payment
      const message = `Dear customer, your payment of KES ${amount} for Order ${formattedOrderID} has failed. Reason: ${
        failed_reason || "Unknown"
      }. Please try again.`;
      await sendNotification(customerID, orderID, message);

      console.log("User notified about failed payment.");

      // Respond to IntaSend
      res.status(200).send("Callback received and failure handled");
    } else {
      console.log(`Payment state is ${state}. No action taken.`);
      res.status(200).send("Callback received but no action taken");
    }
  } catch (error) {
    console.error("Error processing callback:", error.stack);
    res.status(500).send("Error processing callback");
  }
});


router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

router.get("/payments/customer/:customerID", async (req, res) => {
  const { customerID } = req.params;

  try {
    // Find payments for the given customerID
    const payments = await Payment.find({ customerID });

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this customer" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments for customer:", error);
    res.status(500).json({ message: "Error fetching payments for customer", error: error.message });
  }
});


module.exports = router;
