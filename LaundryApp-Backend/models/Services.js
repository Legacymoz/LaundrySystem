const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Unique identifier for the service
  name: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], required: true }, // Array of garment categories
  prices: { type: Map, of: Number, required: true }, // Stores category-price mapping
  states: { type: [String], required: true }, // Service progress states
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;