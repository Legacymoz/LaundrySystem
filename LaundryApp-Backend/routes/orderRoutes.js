const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Service = require("../models/Services");
const { orderUpdateNotification } = require("../controllers/notificationController");
const {incrementOrderCount} = require("../controllers/timeslotController");
const {
  removeFromPickupOrders,
  removeFromDropoffOrders,
  unassignDriverFromOrder,
} = require("../controllers/orderController");

// Create Order
router.post("/", async (req, res) => {
  const {
    customerID,
    serviceType,
    garments,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    pickupAddress,
    dropoffAddress,
    totalCost,
  } = req.body;

  console.log("Order Data:", req.body);

  try {

    // we wont need to change the date to midnight time since the timeslots date are automatically in midnight time.
    // Set pickup time to midnight (00:00) for ease of comparison
    const pickupDateWithMidnightTime = new Date(pickupDate);
    pickupDateWithMidnightTime.setHours(0, 0, 0, 0);

    // Set dropoff time to midnight (00:00) for ease of comparison
    const dropoffDateWithMidnightTime = new Date(dropoffDate);
    dropoffDateWithMidnightTime.setHours(0, 0, 0, 0);
    console.log("Below is my New orders");

    await incrementOrderCount(pickupDate, pickupTime);
    console.log("Below is my New orders");

    const newOrder = new Order({
      customerID,
      serviceType,
      garments,
      pickupDate: pickupDateWithMidnightTime, // Store date with midnight time
      pickupTime, // Keep time separately
      dropoffDate: dropoffDateWithMidnightTime, // Store date with midnight time
      dropoffTime, // Keep time separately
      pickupAddress,
      dropoffAddress,
      totalCost,
    });

    console.log("New Order:", newOrder);
    console.log("The above is my New orders")

    const savedOrder = await newOrder.save(); // Save the new order to the database
    res.status(201).json(savedOrder); // Return the saved order as a response
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Failed to create order", error });
  }
});

// Get all Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

//Get all orders for a singe customer
router.get("/:customerID", async (req, res) => {
  try {
    const { customerID } = req.params;
    

    // Find orders by customerID
    const orders = await Order.find({ customerID });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
});

//updating the order status
router.patch("/:orderId/state", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Find the service details (to get the states)
    const service = await Service.findOne({ title: order.serviceType });
    if (!service)
      return res.status(400).json({ error: "Service type not found" });

    const states = service.states; // Get the states array from the service document
    const currentIndex = states.indexOf(order.status);

    console.log("order", order);
    console.log("Service", service);
    console.log("Current State:", order.status);
    console.log("Current Index:", currentIndex);
    console.log("States:", states);

    // Check if the state can be updated
    if (currentIndex === -1 || currentIndex === states.length - 1) {
      return res.status(400).json({ error: "Order already completed" });
    }

    // Handle driver updates based on state transitions
    if (order.status === "scheduled" ) {
      // Remove from pickupOrders
      const result = await removeFromPickupOrders(orderId, order.driver);
      if (!result.success) {
        return res.status(500).json({ error: result.message });
      }
    }

    if (order.status === "delivered") {
      // Remove from dropoffOrders
      const result = await removeFromDropoffOrders(orderId, order.driver);
      if (!result.success) {
        return res.status(500).json({ error: result.message });
      }
    }

    if (order.status === "delivery") {
      // Remove from dropoffOrders
      const result = await removeFromDropoffOrders(orderId, order.driver);
      if (!result.success) {
        return res.status(500).json({ error: result.message });
      }
    }
    const prevstate = order.status;

    // Move to the next state
    const nextState = states[currentIndex + 1];
    order.status = nextState;
    console.log("Next State:", nextState);
    await order.save();

    if (prevstate === "scheduled") {
      // Unassign driver from order
      const result = await unassignDriverFromOrder(orderId);
      if (!result.success) {
        return res.status(500).json({ error: result.message });
      }
    }

    await orderUpdateNotification(order.customerID, orderId, nextState);

    res.json({ message: "Order state updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating order state", details: error });
  }
});

//assign driver to order
router.patch("/:id/assign-driver", async (req, res) => {
  try {
    const { driverId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.driver = driverId;
    await order.save();

    res
      .status(200)
      .json({ message: "Driver assigned to order successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error assigning driver to order", error });
  }

    
});

router.delete("/cleanup-orders", async (req, res) => {
  try {
    // Find and delete all orders where the `payment` field is missing
    const result = await Order.deleteMany({ payment: { $exists: false } });

    console.log(
      `${result.deletedCount} orders without the payment field were deleted.`
    );
    res.status(200).json({
      message: `${result.deletedCount} orders without the payment field were deleted.`,
    });
  } catch (error) {
    console.error("Error deleting orders without the payment field:", error);
    res.status(500).json({
      message: "Error deleting orders without the payment field",
      error: error.message,
    });
  }
});

module.exports = router;
