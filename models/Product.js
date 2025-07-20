const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
  multiSelect: { type: Boolean, default: false },
  options: [optionSchema]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  customizationOptions: [categorySchema],
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);