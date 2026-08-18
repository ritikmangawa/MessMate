const express = require('express');
const router = express.Router();
const { getActivePoll, votePoll } = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getActivePoll);
router.post('/vote', protect, votePoll);

module.exports = router;
