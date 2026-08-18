const express = require('express');
const router = express.Router();
const { getTomorrowMenu, registerMeals, getTomorrowRegistration } = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.get('/menu/tomorrow', protect, getTomorrowMenu);
router.get('/registration/tomorrow', protect, getTomorrowRegistration);
router.post('/register', protect, registerMeals);

module.exports = router;
