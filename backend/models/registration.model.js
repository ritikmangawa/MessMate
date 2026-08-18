const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false }
  },
  specialItemsSelected: [{
    itemName: String,
    price: Number
  }],
  status: {
    type: String,
    enum: ['registered', 'withdrawn'],
    default: 'registered'
  },
  qrCodeData: {
    type: String
  }
}, { timestamps: true });

registrationSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
