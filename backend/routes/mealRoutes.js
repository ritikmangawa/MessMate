const express = require('express');
const router = express.Router();
const { getTomorrowMenu, registerMeals } = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.get('/menu/tomorrow', protect, getTomorrowMenu);
router.post('/register', protect, registerMeals);

module.exports = router;
