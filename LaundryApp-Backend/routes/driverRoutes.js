const express = require("express");
const router = express.Router();
const Driver = require("../models/Drivers");
const Order = require("../models/Orders");

// Create a new driver
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, vehicleDetails } = req.body;

    const newDriver = new Driver({
      name,
      email,
      phone,
      licenseNumber,
      vehicleDetails,
    });

    await newDriver.save();
    res
      .status(201)
      .json({ message: "Driver created successfully", driver: newDriver });
  } catch (error) {
    res.status(500).json({ message: "Error creating driver", error });
  }
});

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drivers", error });
  }
});

// Get a specific driver by ID
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver", error });
  }
});

// Update a driver
router.patch("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res
      .status(200)
      .json({ message: "Driver updated successfully", driver: updatedDriver });
  } catch (error) {
    res.status(500).json({ message: "Error updating driver", error });
  }
});

// Delete a driver
router.delete("/:id", async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);

    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting driver", error });
  }
});

// Assign pickup or dropoff orders to a driver
router.post("/:id/assign-orders", async (req, res) => {
  try {
    const { pickupOrders, dropoffOrders } = req.body; // Array of order IDs
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (pickupOrders) {
      driver.pickupOrders.push(...pickupOrders);
    }

    if (dropoffOrders) {
      driver.dropoffOrders.push(...dropoffOrders);
    }

    await driver.save();
    res.status(200).json({ message: "Orders assigned successfully", driver });
  } catch (error) {
    res.status(500).json({ message: "Error assigning orders", error });
  } });

  // Get all orders assigned to a driver
router.get("/:id/orders", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate("pickupOrders")
      .populate("dropoffOrders");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      pickupOrders: driver.pickupOrders,
      dropoffOrders: driver.dropoffOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver's orders", error });
  }
});


// Toggle the isActive status of a driver
router.patch("/:id/toggle-active", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Toggle the isActive status
    driver.isActive = !driver.isActive;

    await driver.save();

    res.status(200).json({
      message: `Driver isActive status toggled to ${driver.isActive}`,
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling driver's isActive status", error });
  }
});


module.exports = router;
