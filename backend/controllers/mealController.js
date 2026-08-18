const Menu = require('../models/menu.model.js');
const Registration = require('../models/registration.model.js');

// @desc    Get tomorrow's menu
// @route   GET /api/meals/menu/tomorrow
const getTomorrowMenu = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const menu = await Menu.findOne({ date: tomorrow });
    if (!menu) {
      return res.status(404).json({ message: 'Menu for tomorrow is not uploaded yet.' });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register or update meal choices for tomorrow
// @route   POST /api/meals/register
const registerMeals = async (req, res) => {
  try {
    const { breakfast, lunch, dinner, specialItemsSelected } = req.body;
    
    // Check if the 10 PM deadline has passed
    const now = new Date();
    if (now.getHours() >= 22) {
      return res.status(400).json({ message: 'Registration is closed after 10:00 PM.' });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Calculate total cost for special items (Requires wallet deduction logic later)
    // For now, just save the registration
    const qrData = `MESS-${req.user._id}-${tomorrow.getTime()}`;

    // Update if exists, otherwise create new
    const registration = await Registration.findOneAndUpdate(
      { studentId: req.user._id, date: tomorrow },
      {
        meals: { breakfast, lunch, dinner },
        specialItemsSelected: specialItemsSelected || [],
        status: (breakfast || lunch || dinner) ? 'registered' : 'withdrawn',
        qrCodeData: qrData
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Meals updated successfully', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTomorrowMenu, registerMeals };
