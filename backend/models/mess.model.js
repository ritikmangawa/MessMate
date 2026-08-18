const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Mess', messSchema);
