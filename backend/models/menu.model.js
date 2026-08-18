const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  breakfast: {
    type: [String],
    default: []
  },
  lunch: {
    type: [String],
    default: []
  },
  dinner: {
    type: [String],
    default: []
  },
  specialItems: [{
    itemName: String,
    price: Number
  }]
}, { timestamps: true });

menuSchema.index({ messId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Menu', menuSchema);
