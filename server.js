// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// User and Exercise Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Routes

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add exercise to a user
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;
    const exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString();
    
    const newExercise = new Exercise({
      description,
      duration,
      date: exerciseDate,
      userId: _id,
    });

    await newExercise.save();

    const user = await User.findById(_id);
    user.exercises = user.exercises ? [...user.exercises, newExercise] : [newExercise];
    await user.save();

    res.json({
      username: user.username,
      _id: user._id,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get exercise log for a user
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    let filters = { userId: _id };
    if (from) filters.date = { $gte: new Date(from).toDateString() };
    if (to) filters.date = { $lte: new Date(to).toDateString() };

    const exercises = await Exercise.find(filters)
      .limit(Number(limit))
      .exec();

    const user = await User.findById(_id);
    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
      })),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


