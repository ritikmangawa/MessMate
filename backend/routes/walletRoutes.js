const express = require('express');
const router = express.Router();
const { mockRecharge, getTransactions } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recharge', protect, mockRecharge);
router.get('/transactions', protect, getTransactions);

module.exports = router;
