const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Store = require('../models/Store');

// Get sales summary
const getSalesSummary = async (startDate, endDate, storeId = null) => {
  const matchQuery = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    status: { $in: ['completed', 'delivered'] }
  };

  if (storeId) {
    matchQuery.store = storeId;
  }

  const result = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);

  return result[0] || { totalSales: 0, totalOrders: 0, averageOrderValue: 0 };
};

// Get daily sales
const getDailySales = async (startDate, endDate, storeId = null) => {
  const matchQuery = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    status: { $in: ['completed', 'delivered'] }
  };

  if (storeId) {
    matchQuery.store = storeId;
  }

  return await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sales: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Get top selling products
const getTopProducts = async (startDate, endDate, limit = 10, storeId = null) => {
  const matchQuery = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    status: { $in: ['completed', 'delivered'] }
  };

  if (storeId) {
    matchQuery.store = storeId;
  }

  return await Order.aggregate([
    { $match: matchQuery },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.itemPrice' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        name: '$product.name',
        category: '$product.category',
        totalQuantity: 1,
        totalRevenue: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
};

// Get store performance
const getStorePerformance = async (startDate, endDate) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        status: { $in: ['completed', 'delivered'] }
      }
    },
    {
      $group: {
        _id: '$store',
        totalSales: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      }
    },
    {
      $lookup: {
        from: 'stores',
        localField: '_id',
        foreignField: '_id',
        as: 'store'
      }
    },
    { $unwind: '$store' },
    {
      $project: {
        _id: 1,
        name: '$store.name',
        address: '$store.address',
        totalSales: 1,
        totalOrders: 1,
        averageOrderValue: 1
      }
    },
    { $sort: { totalSales: -1 } }
  ]);
};

// Get customer insights
const getCustomerInsights = async (startDate, endDate) => {
  // New vs returning customers
  const newCustomers = await User.countDocuments({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  });

  // Customer retention
  const customerRetention = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$user',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        firstOrder: { $min: '$createdAt' },
        lastOrder: { $max: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 1,
        orderCount: 1,
        totalSpent: 1,
        firstOrder: 1,
        lastOrder: 1,
        daysSinceFirstOrder: {
          $divide: [
            { $subtract: [new Date(), '$firstOrder'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    }
  ]);

  // Calculate retention metrics
  const repeatCustomers = customerRetention.filter(c => c.orderCount > 1).length;
  const totalCustomers = customerRetention.length;
  const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  return {
    newCustomers,
    totalCustomers,
    repeatCustomers,
    retentionRate,
    customerLifetimeValue: customerRetention.reduce((acc, curr) => acc + curr.totalSpent, 0) / totalCustomers
  };
};

module.exports = {
  getSalesSummary,
  getDailySales,
  getTopProducts,
  getStorePerformance,
  getCustomerInsights
};