import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import CustomCakeRequest from '../models/CustomCakeRequest.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's orders
    const todayOrdersCount = await Order.countDocuments({ createdAt: { $gte: today } });

    // Total revenue from all non-cancelled orders
    const completedOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    // Pending orders
    const pendingOrdersCount = await Order.countDocuments({ orderStatus: 'Pending' });

    // New custom requests
    const newCustomRequestsCount = await CustomCakeRequest.countDocuments({ status: 'Pending' });

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Low stock alerts (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock images basePrice');

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(8);

    // Sales chart data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const salesByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          orderStatus: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        todayOrdersCount,
        totalRevenue,
        pendingOrdersCount,
        newCustomRequestsCount,
        totalCustomers,
        lowStockProducts,
        recentOrders,
        salesByDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers with order metrics (Admin)
// @route   GET /api/admin/customers
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    const customerDetails = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ user: cust._id });
        const totalSpent = orders
          .filter(o => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        return {
          ...cust.toObject(),
          totalOrders: orders.length,
          totalSpent
        };
      })
    );

    res.json({ success: true, customers: customerDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock customer (Admin)
// @route   PATCH /api/admin/customers/:id/toggle-block
export const toggleBlockCustomer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block an admin user' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'Customer blocked' : 'Customer unblocked',
      isBlocked: user.isBlocked
    });
  } catch (error) {
    next(error);
  }
};
