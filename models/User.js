const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, default: () => new Date().toDateString() }, // Format date
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exercises: [exerciseSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
