const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  hostel: {
    type: String,
    required: function() { 
        return this.role === 'student'; 
    } 
  },
  roomNumber: {
    type: String,
    required: function() { 
        return this.role === 'student'; 
    }
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  autoPilotMode: {
    type: String,
    enum: ['mode1', 'mode2'], // mode1 = Default Registered, mode2 = Default Not Registered
    default: 'mode1',
  }
}, { timestamps: true }); 
module.exports = mongoose.model('User', userSchema);
