const Driver = require("../models/Drivers");
const Order = require("../models/Orders");

// Remove order from pickupOrders
const removeFromPickupOrders = async (orderId, driverId) => {
  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Remove the orderId from the pickupOrders array
    driver.pickupOrders = driver.pickupOrders.filter(
      (id) => id.toString() !== orderId
    );

    await driver.save();
    return { success: true, message: "Order removed from pickupOrders" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Remove order from dropoffOrders
const removeFromDropoffOrders = async (orderId, driverId) => {
  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Remove the orderId from the dropoffOrders array
    driver.dropoffOrders = driver.dropoffOrders.filter(
      (id) => id.toString() !== orderId
    );

    await driver.save();
    return { success: true, message: "Order removed from dropoffOrders" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const unassignDriverFromOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Set the driver field to null
    order.driver = null;

    await order.save();
    return {
      success: true,
      message: "Driver unassigned from order successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  removeFromPickupOrders,
  removeFromDropoffOrders,
  unassignDriverFromOrder, // Export the new function
};