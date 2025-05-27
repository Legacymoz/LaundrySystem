const express = require("express");
const Service = require("../models/Services");

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" });
  }
});

// @route   GET /api/services/:title
// @desc    Get a specific service by title
router.get("/:title", async (req, res) => {
  try {
    const service = await Service.findOne({ title: req.params.title });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error fetching service" });
  }
});

// @route   POST /api/services
// @desc    Add a new service
router.post("/", async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ error: "Error adding service", details: error });
  }
});

// @route   PUT /api/services/:title
// @desc    Update a service by title
//This Endpoint has an issue, opt to use PATCH instead of PUT
router.put("/:title", async (req, res) => {
  try {

    console.log("Updating:", req.params.title);
    console.log("New Data:", req.body);

    const updatedService = await Service.findOneAndUpdate(
      { title: req.params.title },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ error: "Error updating service", details: error });
  }
});

// @route   PATCH /api/services/:title
// @desc    Partially update a service by title
router.patch("/:title", async (req, res) => {
  try {
    console.log("Updating:", req.params.title);
    console.log("New Data:", req.body);

    const updatedService = await Service.findOneAndUpdate(
      { title: req.params.title },
      { $set: req.body }, // Only update the fields provided in req.body
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ error: "Error updating service", details: error });
  }
});

// @route   DELETE /api/services/:title
// @desc    Delete a service by title
router.delete("/:title", async (req, res) => {
  try {
    const deletedService = await Service.findOneAndDelete({
      title: req.params.title,
    });
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting service" });
  }
});

module.exports = router;
