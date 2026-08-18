const express = require('express');
const router = express.Router();
const { getActivePoll, votePoll, createPoll } = require('../controllers/pollController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getActivePoll);
router.post('/vote', protect, votePoll);
router.post('/create', protect, adminOnly, createPoll);

module.exports = router;
