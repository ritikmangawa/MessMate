const express = require('express');
const router = express.Router();
const { getItems, placeOrder, getAllOrders, updateOrderStatus } = require('../controllers/canteenController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/items', protect, getItems);
router.post('/order', protect, placeOrder);

// Admin Routes
router.get('/orders/all', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
