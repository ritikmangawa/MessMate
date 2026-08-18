const express = require('express');
const router = express.Router();
const { uploadMenu } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Both middleware applied: must be logged in, AND must be an admin!
router.post('/menu', protect, adminOnly, uploadMenu);

module.exports = router;
