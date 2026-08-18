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
      { date: targetDate, messId: req.user.messId },
      { breakfast, lunch, dinner, specialItems: specialItems || [] },
      { new: true, upsert: true } // upsert creates it if it doesn't exist
    );

    res.status(201).json({ message: 'Menu uploaded successfully!', menu });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const Registration = require('../models/registration.model.js');

// @desc    Get meal counts for tomorrow
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    const registrations = await Registration.find({ 
      date: targetDate, 
      status: 'registered',
      messId: req.user.messId 
    });
    
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    registrations.forEach(reg => {
      if(reg.meals.breakfast) breakfastCount++;
      if(reg.meals.lunch) lunchCount++;
      if(reg.meals.dinner) dinnerCount++;
    });

    res.status(200).json({
      totalRegistered: registrations.length,
      breakfastCount,
      lunchCount,
      dinnerCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { uploadMenu, getStats };
