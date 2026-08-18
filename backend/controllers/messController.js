const Mess = require('../models/mess.model.js');

// @desc    Get all messes (auto-seeds if DB is empty so testing is easy)
// @route   GET /api/messes
const getMesses = async (req, res) => {
  try {
    let messes = await Mess.find();
    
    if (messes.length === 0) {
      messes = await Mess.insertMany([
        { name: 'Block A Mess', location: 'North Wing' },
        { name: 'Block B Mess', location: 'South Wing' }
      ]);
    }
    
    res.status(200).json(messes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMesses };
