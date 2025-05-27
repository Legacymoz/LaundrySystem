const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Garment name
  price: { type: Number, required: true }, // Price of the garment
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
