const User = require('../models/user.model.js');
const Transaction = require('../models/transaction.model.js');

// @desc    Mock recharge wallet (bypassing Razorpay)
// @route   POST /api/wallet/recharge
const mockRecharge = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if(!amount || amount <= 0) return res.status(400).json({message: 'Invalid amount'});

    // 1. Add amount to user's wallet
    const user = await User.findById(req.user._id);
    user.walletBalance += Number(amount);
    await user.save();

    // 2. Create a permanent transaction record
    const transaction = await Transaction.create({
      studentId: user._id,
      type: 'credit',
      amount: Number(amount),
      description: `Wallet recharge (Mock)`
    });

    res.status(200).json({ message: 'Recharge successful', balance: user.walletBalance, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's transaction history
// @route   GET /api/wallet/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { mockRecharge, getTransactions };
