const CanteenItem = require('../models/canteenItem.model');
const CanteenOrder = require('../models/canteenOrder.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

// @desc    Get all available canteen items for the student's mess
// @route   GET /api/canteen/items
const getItems = async (req, res) => {
  try {
    // If empty, auto-seed some test items for their specific mess so testing is easy
    let items = await CanteenItem.find({ messId: req.user.messId, isAvailable: true });
    
    if (items.length === 0) {
      items = await CanteenItem.insertMany([
        { messId: req.user.messId, name: 'Maggi', price: 40 },
        { messId: req.user.messId, name: 'Cold Coffee', price: 60 },
        { messId: req.user.messId, name: 'Grilled Cheese Sandwich', price: 50 },
        { messId: req.user.messId, name: 'Oreo Shake', price: 80 }
      ]);
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Place an order and deduct wallet balance
// @route   POST /api/canteen/order
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    // 1. Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance. Please recharge.' });
    }

    // 2. Deduct from wallet
    user.walletBalance -= totalAmount;
    await user.save();

    // 3. Create order
    const order = await CanteenOrder.create({
      studentId: user._id,
      messId: user.messId,
      items,
      totalAmount
    });

    // 4. Create transaction history
    await Transaction.create({
      studentId: user._id,
      type: 'debit',
      amount: totalAmount,
      description: `Night Canteen Order #${order._id.toString().slice(-4)}`
    });

    res.status(201).json({ message: 'Order placed successfully!', order, balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getItems, placeOrder };
