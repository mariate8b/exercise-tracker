const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/exercise-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// POST /api/users - Create a new user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  const newUser = new User({ username });
  await newUser.save();
  res.json({ username: newUser.username, _id: newUser._id });
});

// GET /api/users - Get list of all users
app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// POST /api/users/:_id/exercises - Add exercise to a user
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;
  if (!description || !duration) {
    return res.status(400).send('Description and duration are required');
  }
  const exercise = { description, duration, date: date || new Date() };
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  user.exercises.push(exercise);
  await user.save();
  res.json(user);
});

// GET /api/users/:_id/logs - Get exercise log for a user
app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const { from, to, limit } = req.query;
  let log = user.exercises;

  // Filter by date range (from and to)
  if (from || to) {
    log = log.filter(exercise => {
      const exerciseDate = new Date(exercise.date);
      return (!from || exerciseDate >= new Date(from)) && (!to || exerciseDate <= new Date(to));
    });
  }

  // Limit the number of logs returned
  if (limit) {
    log = log.slice(0, limit);
  }

  res.json({
    username: user.username,
    count: log.length,
    log,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
