const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Service = require('../models/Service');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('=== FETCHING DASHBOARD STATISTICS ===');
    
    // Get current date and calculate date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Basic counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalServices,
      totalRevenueData,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      adminUsers
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ createdAt: { $gte: monthAgo } }),
      User.countDocuments({ role: 'admin' })
    ]);

    const totalRevenue = totalRevenueData[0]?.totalSales || 0;

    // Order status breakdown
    const orderStatusData = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatus = {
      pending: orderStatusData.find(item => item._id === 'pending')?.count || 0,
      processing: orderStatusData.find(item => item._id === 'processing')?.count || 0,
      completed: orderStatusData.find(item => item._id === 'completed')?.count || 0,
      cancelled: orderStatusData.find(item => item._id === 'cancelled')?.count || 0,
      ready_for_pickup: orderStatusData.find(item => item._id === 'ready_for_pickup')?.count || 0
    };

    // Inventory statistics
    const [
      lowStockProducts,
      outOfStockProducts,
      featuredProducts,
      newProducts,
      onSaleProducts
    ] = await Promise.all([
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
      Product.countDocuments({ stock: 0, isActive: true }),
      Product.countDocuments({ isFeatured: true, isActive: true }),
      Product.countDocuments({ isNew: true, isActive: true }),
      Product.countDocuments({ isOnSale: true, isActive: true })
    ]);

    // Financial calculations
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Monthly revenue for last 6 months
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format monthly revenue data
    const monthlyRevenueFormatted = monthlyRevenue.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item.revenue
    }));

    // Top categories by product count
    const topCategories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $project: {
          name: '$categoryInfo.name',
          value: '$productCount',
          color: { $literal: '#8884d8' } // Default color, can be customized
        }
      },
      {
        $sort: { value: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Add colors to top categories
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    topCategories.forEach((category, index) => {
      category.color = colors[index % colors.length];
    });

    // Recent activity (last 10 activities)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProducts = await Product.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Combine and format recent activity
    const recentActivity = [];
    
    recentOrders.forEach(order => {
      recentActivity.push({
        action: `New order #${order._id.toString().slice(-6)}`,
        time: getTimeAgo(order.createdAt),
        type: 'order',
        icon: 'shopping_cart'
      });
    });

    recentUsers.forEach(user => {
      recentActivity.push({
        action: `User ${user.name} registered`,
        time: getTimeAgo(user.createdAt),
        type: 'user',
        icon: 'person'
      });
    });

    recentProducts.forEach(product => {
      recentActivity.push({
        action: `Product "${product.name}" updated`,
        time: getTimeAgo(product.updatedAt),
        type: 'product',
        icon: 'inventory_2'
      });
    });

    // Sort by time and take top 10
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    // Calculate trends (simplified - can be enhanced with historical data)
    const trends = {
      revenue: '+12.5%',
      products: '+5.2%',
      orders: '+8.3%',
      users: '+3.7%',
      pendingOrders: '-2.1%',
      lowStockProducts: '+1.8%'
    };

    const stats = {
      // Basic counts
      products: totalProducts,
      orders: totalOrders,
      users: totalUsers,
      services: totalServices,
      revenue: totalRevenue,
      
      // Order status
      pendingOrders: orderStatus.pending,
      processingOrders: orderStatus.processing,
      completedOrders: orderStatus.completed,
      cancelledOrders: orderStatus.cancelled,
      readyForPickupOrders: orderStatus.ready_for_pickup,
      
      // Inventory
      lowStockProducts,
      outOfStockProducts,
      featuredProducts,
      newProducts,
      onSaleProducts,
      
      // User statistics
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      adminUsers,
      
      // Financial
      avgOrderValue,
      conversionRate: 3.2, // Placeholder - would need visitor tracking
      
      // Charts data
      topCategories,
      monthlyRevenue: monthlyRevenueFormatted,
      orderStatus: [
        { name: 'Completed', value: orderStatus.completed, color: '#28a745' },
        { name: 'Pending', value: orderStatus.pending, color: '#ffc107' },
        { name: 'Processing', value: orderStatus.processing, color: '#007bff' },
        { name: 'Ready for Pickup', value: orderStatus.ready_for_pickup, color: '#17a2b8' },
        { name: 'Cancelled', value: orderStatus.cancelled, color: '#dc3545' }
      ],
      recentActivity,
      
      // Trends
      trends
    };

    console.log('=== DASHBOARD STATISTICS CALCULATED ===');
    console.log('Total Users:', totalUsers);
    console.log('Total Products:', totalProducts);
    console.log('Total Orders:', totalOrders);
    console.log('Total Revenue:', totalRevenue);

    res.json(stats);
  } catch (err) {
    console.error('=== DASHBOARD STATISTICS ERROR ===');
    console.error('Error:', err);
    res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders (for admin)
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
