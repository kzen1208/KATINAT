const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const { emitOrderUpdate } = require('./socket');
const sendEmail = require('./sendEmail');

// Create payment intent
const createPaymentIntent = async (amount, metadata) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects amount in cents
    currency: 'vnd',
    metadata
  });
};

// Handle Stripe webhook events
const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentIntent.id': paymentIntent.id
    });

    if (!order) {
      console.log(`No order found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.updatedAt = Date.now();
    
    await order.save();

    // Emit order update via socket
    emitOrderUpdate(order._id, 'confirmed');

    // Send confirmation email
    const user = await User.findById(order.user);
    if (user) {
      await sendEmail({
        email: user.email,
        subject: 'Payment Successful - Katinat Coffee',
        message: `Your payment for order #${order._id} has been successfully processed. Thank you for your order!`
      });
    }
  } catch (err) {
    console.error('Error handling payment success:', err);
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  try {
    // Find order by payment intent ID
    const order = await Order.findOne({
      'paymentIntent.id': paymentIntent.id
    });

    if (!order) {
      console.log(`No order found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order status
    order.status = 'payment_failed';
    order.paymentStatus = 'failed';
    order.updatedAt = Date.now();
    
    await order.save();

    // Emit order update via socket
    emitOrderUpdate(order._id, 'payment_failed');

    // Send notification email
    const user = await User.findById(order.user);
    if (user) {
      await sendEmail({
        email: user.email,
        subject: 'Payment Failed - Katinat Coffee',
        message: `Your payment for order #${order._id} has failed. Please try again or contact customer support.`
      });
    }
  } catch (err) {
    console.error('Error handling payment failure:', err);
  }
};

module.exports = {
  createPaymentIntent,
  handleWebhookEvent
};