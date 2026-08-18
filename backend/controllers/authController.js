const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// @desc    Register a new user
// @route   POST /api/auth/register

const register = async (req, res) => {
  try {
    const { name, email, password, role, hostel, roomNumber, messId } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    
    if (!messId) {
      return res.status(400).json({ message: 'Please select a Mess.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      hostel,
      roomNumber,
      messId
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};
// @desc    Login user & send JWT token in cookie
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // 3. Generate JWT Token
    // We put the user's ID and role inside the token payload
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );
    //Send token in an HTTP-only cookie (safer than local storage)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    //Send user data back (without the password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostel: user.hostel,
      roomNumber: user.roomNumber,
      messId: user.messId,
      walletBalance: user.walletBalance,
      autoPilotMode: user.autoPilotMode
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
// @desc    Logout user (Clear cookie)
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
module.exports = { register, login, logout };