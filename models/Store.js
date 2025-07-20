const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true 
  },
  open: { type: String, required: true },
  close: { type: String, required: true },
  isClosed: { type: Boolean, default: false }
});

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  phone: { type: String },
  email: { type: String },
  images: [{ type: String }],
  operatingHours: [operatingHoursSchema],
  features: [{
    type: String,
    enum: ['wifi', 'parking', 'outdoor-seating', 'air-conditioning', 'power-outlets']
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);