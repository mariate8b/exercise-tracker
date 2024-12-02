const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String }, // will store the date as a string
});

module.exports = mongoose.model('Exercise', exerciseSchema);
