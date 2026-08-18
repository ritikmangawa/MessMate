const Menu = require('../models/menu.model.js');

// @desc    Upload menu for tomorrow
// @route   POST /api/admin/menu
const uploadMenu = async (req, res) => {
  try {
    const { breakfast, lunch, dinner, specialItems } = req.body;
    
    // Target tomorrow's date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    const menu = await Menu.findOneAndUpdate(
      { date: targetDate },
      { breakfast, lunch, dinner, specialItems: specialItems || [] },
      { new: true, upsert: true } // upsert creates it if it doesn't exist
    );

    res.status(201).json({ message: 'Menu uploaded successfully!', menu });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadMenu };
