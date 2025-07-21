const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get orders for current user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('store', 'name address')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('store', 'name address phone')
    .populate('items.product');
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to view this order
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, subtotal, tax, deliveryFee, discount, total, paymentMethod, deliveryType, deliveryTime, address, store } = req.body;
  
  // Validate items
  if (!items || items.length === 0) {
    return next(new ErrorResponse('Please add at least one item to your order', 400));
  }
  
  // Create order
  const order = await Order.create({
    user: req.user.id,
    items,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    paymentMethod,
    deliveryType,
    deliveryTime,
    address,
    store,
    status: 'pending'
  });
  
  // Send order confirmation email
  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Order Confirmation - Katinat Coffee',
      message: `Thank you for your order! Your order #${order._id} has been received and is being processed.`
    });
  } catch (err) {
    console.log('Email could not be sent', err);
  }
  
  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return next(new ErrorResponse('Please provide a status', 400));
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  order.status = status;
  order.updatedAt = Date.now();
  
  await order.save();
  
  // If order is completed, send email notification
  if (status === 'completed') {
    try {
      const user = await User.findById(order.user);
      await sendEmail({
        email: user.email,
        subject: 'Your Katinat Coffee Order is Complete',
        message: `Your order #${order._id} has been completed. Thank you for choosing Katinat Coffee!`
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to cancel this order
  if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }
  
  // Check if order can be cancelled
  if (!['pending', 'confirmed'].includes(order.status)) {
    return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
  }
  
  order.status = 'cancelled';
  order.updatedAt = Date.now();
  
  await order.save();
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create payment intent for Stripe
// @route   POST /api/orders/payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe expects amount in cents
    currency: 'vnd',
    metadata: {
      userId: req.user.id
    }
  });
  
  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});