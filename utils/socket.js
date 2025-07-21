const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join user to their own room
    socket.join(`user:${socket.user.id}`);
    
    // Join admin users to admin room
    if (socket.user.role === 'admin') {
      socket.join('admin');
    }
    
    // Join store staff to their store room
    if (socket.user.role === 'staff' && socket.handshake.query.storeId) {
      socket.join(`store:${socket.handshake.query.storeId}`);
    }
    
    // Handle client events
    socket.on('order:track', (orderId) => {
      socket.join(`order:${orderId}`);
    });
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit order status update
const emitOrderUpdate = (orderId, status) => {
  if (!io) return;
  
  io.to(`order:${orderId}`).emit('order:update', {
    orderId,
    status
  });
};

// Emit new order notification to store
const emitNewOrder = (order) => {
  if (!io) return;
  
  // Notify store staff
  if (order.store) {
    io.to(`store:${order.store}`).emit('order:new', {
      orderId: order._id,
      store: order.store
    });
  }
  
  // Notify admins
  io.to('admin').emit('order:new', {
    orderId: order._id,
    store: order.store
  });
};

// Emit user notification
const emitUserNotification = (userId, notification) => {
  if (!io) return;
  
  io.to(`user:${userId}`).emit('notification', notification);
};

module.exports = {
  initSocket,
  emitOrderUpdate,
  emitNewOrder,
  emitUserNotification
};