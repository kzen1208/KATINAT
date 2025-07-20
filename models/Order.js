const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: { type: Number, required: true },
  selectedOptions: [{
    category: { type: String, required: true },
    options: [{ type: String }]
  }],
  itemPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'momo', 'zalopay'],
    required: true 
  },
  deliveryType: { 
    type: String, 
    enum: ['pickup', 'delivery', 'dine-in'],
    required: true 
  },
  deliveryTime: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    street: { type: String },
    city: { type: String },
    district: { type: String },
    notes: { type: String }
  },
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);