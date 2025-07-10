const Order = require('../models/Order');
const User = require('../models/User');
const emailService = require('../services/emailService');
const Cart = require('../models/Cart');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { billingAddress, notes } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      billingAddress,
      notes,
      // paymentMethod and shippingMethod will use defaults from schema
    });

    // Send confirmation email to user
    try {
      await emailService.sendOrderConfirmation(order, req.user);
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Clear user's cart after order is created
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err); // This log is for you on the server
    
    // Check for Mongoose validation error and send specific details
    if (err.name === 'ValidationError') {
      // Extract validation messages
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}`, errors });
    }

    // For other types of errors, send a generic 500
    res.status(500).json({ message: 'Order creation failed due to a server error.', error: err.message });
  }
};

// Get orders for current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only admin or owner can access
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Send status update email to user
    try {
      const user = await User.findById(order.user);
      if (user) {
        // We don't have previousStatus here, so we'll pass the new status.
        // Or we can decide not to send it, or fetch the order before updating.
        // For now, let's just indicate it's an update.
        await emailService.sendOrderStatusUpdate(order, user, 'updated');
        console.log('Order status update email sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
      // Don't fail the status update if email fails
    }

    res.json(order);
  } catch (err) {
    console.error('Failed to update order status:', err); // Enhanced logging
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

// Client: Cancel order if not shipped or delivered
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (["ready_for_pickup", "completed", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be cancelled when status is '${order.status}'.` });
    }
    
    const previousStatus = order.status;
    order.status = 'cancelled';
    await order.save();

    // Send cancellation email to user
    try {
      await emailService.sendOrderStatusUpdate(order, req.user, previousStatus);
      console.log('Order cancellation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only admin can delete orders
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete orders' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Failed to delete order:', err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
