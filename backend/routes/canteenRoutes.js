const express = require('express');
const router = express.Router();
const { getItems, placeOrder } = require('../controllers/canteenController');
const { protect } = require('../middleware/authMiddleware');

router.get('/items', protect, getItems);
router.post('/order', protect, placeOrder);

module.exports = router;
